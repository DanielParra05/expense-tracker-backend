# CLAUDE.md

## Architecture
This NestJS App uses Use-case layer architecture / service & repository. This is a base example of scaffolding:

```text
src/
├── main.ts                              # bufferLogs, global pipes + filters, port from config
├── app.module.ts
│
├── config/
│   ├── configuration.ts
│   ├── env.validation.ts
│   └── config.types.ts
│
├── shared/
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── errors/
│   │   ├── domain.error.ts               # abstract base: message + stable code
│   │   ├── not-found.error.ts
│   │   ├── conflict.error.ts
│   │   └── validation.error.ts
│   └── filters/
│       ├── all-exceptions.filter.ts      # fallback → 500, logs, leaks nothing
│       ├── prisma-exception.filter.ts    # P2002→409, P2025→404, P2003→400
│       └── domain-exception.filter.ts    # DomainError → status via error kind
│
└── modules/
    │
    ├── users/                            # ── DEFAULT: one service ──
    │   ├── domain/
    │   │   ├── user.ts
    │   │   └── errors.ts                 # UserNotFoundError, EmailAlreadyTakenError
    │   ├── dto/
    │   │   ├── create-user.dto.ts
    │   │   ├── update-user.dto.ts
    │   │   └── user-response.dto.ts
    │   ├── users.controller.ts
    │   ├── users.service.ts              # throws domain errors, never HttpException
    │   ├── users.repository.ts
    │   ├── users.mapper.ts
    │   └── users.module.ts
    │
    └── expenses/                         # ── EXAMPLE ONLY: promoted shape ──
        ├── domain/
        │   ├── expense.ts
        │   └── errors.ts
        ├── application/
        │   └── create-expense.use-case.ts
        ├── dto/
        │   ├── create-expense.dto.ts
        │   ├── update-expense.dto.ts
        │   └── expense-response.dto.ts
        ├── expenses.controller.ts
        ├── expenses.service.ts
        ├── expenses.repository.ts
        ├── expenses.mapper.ts
        └── expenses.module.ts
```

### Three rules to keep it clean

Everything starts just being a service like 'user'. Once it grows we can layer it as a use-case, but starting it should always be a service. Prisma appears in exactly one file per module — users.repository.ts. If @prisma/client shows up in a use case, the layer has leaked. 

The repository returns User, never Prisma.User. That's what users.mapper.ts is for. Even at five lines it earns its place — it's where passwordHash gets dropped and where Decimal becomes integer cents in the expenses module.

Controllers inject use cases only. A controller reaching for UsersRepository is the shortcut that quietly collapses the whole structure.

##  Rules for code
Follow them when writing or modifying code. If a rule conflicts with existing code in a file, match the file's conventions and mention the inconsistency rather than silently reformatting.

### TypeScript

- `strict` mode is non-negotiable. Never weaken `tsconfig.json` to make code compile.
- No `any`. Use `unknown` plus narrowing, generics, or a proper type. `as` casts are a
  last resort and need a comment explaining why they're safe.
- No non-null assertions (`!`). Narrow the type or handle the null case.
- Let TypeScript infer local variables and return types of trivial functions; annotate
  public method signatures, exported functions, and anything crossing a module boundary.
- Prefer `type` for unions and function signatures, `interface` for object contracts that
  may be implemented or extended.
- Model illegal states out of existence: discriminated unions over optional-field soup.
- Prefer `as const` objects over `enum`; use `readonly` on properties and arrays that
  shouldn't be mutated.
- No `@ts-ignore`. `@ts-expect-error` is allowed only with a one-line justification.

### Naming

- Intention-revealing names. `activeSubscriptions`, not `data` / `tmp` / `res2` / `r` / `s`.
- Booleans read as predicates: `isActive`, `hasAccess`, `canRetry`.
- Functions are verbs, classes and types are nouns.
- No abbreviations beyond well-known ones (`id`, `url`, `dto`). No Hungarian prefixes,
  no `I` prefix on interfaces.
- Files: `kebab-case` with the NestJS suffix convention —
  `user.service.ts`, `create-user.dto.ts`, `auth.guard.ts`, `user.repository.ts`.
- One primary export per file; the filename matches it.

### Functions

- Small and single-purpose. If you need "and" to describe what it does, split it.
- One level of abstraction per function; don't mix orchestration with low-level detail.
- Max ~3 positional parameters. Beyond that, take a single options object.
- No boolean flag parameters — write two functions instead.
- Guard clauses and early returns over nested `if`/`else` pyramids.
- No side effects hidden behind an innocent name. A getter never mutates.
- Pure functions where practical: easier to test, easier to reason about.


### Error handling

- Throw, don't return error sentinels or `null` to signal failure.
- Services throw domain-meaningful errors; an exception filter maps them to HTTP status
  codes. Avoid scattering `HttpException` through business logic.
- Never swallow an error. No empty `catch {}`. If you catch, either handle it, enrich it,
  or rethrow.
- Only catch what you can act on. Let the global filter handle the rest.
- Error messages are actionable and safe: no stack traces, SQL, or secrets in responses.
- Never return HTTP status codes in a response body — the status line already carries them.
- Every error response is `{ code, message }`, plus `fields` for validation failures. `code`
  is a stable `UPPER_SNAKE_CASE` identifier the frontend maps to user-facing copy; `message`
  is a developer aid and is never rendered to users.
- Error codes belong to the module that owns them: an `as const` object plus a same-named
  derived type in that module's `domain/errors.ts`, prefixed with the module name
  (`USER_NOT_FOUND`). Annotate each error class's `code` with that type — without the
  annotation a typo compiles. Only codes belonging to no module live in
  `shared/errors/shared-error-code.ts`.
- `shared/` never imports from `modules/`. There is deliberately no central union of every
  error code: a single response shape, not a single type, is what the frontend contract needs.
- `DomainExceptionFilter` maps to HTTP status by base class (`NotFoundError`→404,
  `ConflictError`→409, `ValidationError`→400), never by code. Adding a module code must never
  require editing a filter.
- Exception filters serialize through `sendError` and never call `response.json()` directly,
  so every error body is typed `ErrorResponse`. Logging stays each filter's own decision —
  keep it out of the shared helper.

### Async

- No floating promises — `await` everything or explicitly `void` it with a comment.
- Independent async work runs in parallel via `Promise.all` / `allSettled`, not in a
  sequential `for` loop.
- No `async` constructors; use a factory or lifecycle hook (`onModuleInit`).
- Wrap multi-step writes in a transaction. Partial writes are bugs waiting to happen.

### Configuration and logging

- All config goes through `ConfigModule` / `ConfigService` with a validated schema.
  `process.env` is read in exactly one place.
- No magic numbers or strings in logic — named constants, or config if environment-varying.
- Use the Nest `Logger` (or the configured structured logger). Never `console.log`.
- Log context and correlation IDs; never log credentials, tokens, or PII.

Example:

this.logger.log(`Created user ${id} in group ${groupId}`);   // ✗ unsearchable later
this.logger.log({ msg: 'User created', userId: id, groupId }); // ✓


### Comments and dead code

- Comments explain *why*, never *what*. DO NOT OVER COMMENT. USE AS LESS AS POSIBLE COMMENTES, ONLY WHEN IT IS ACTUALLY NECESARY.
- Delete commented-out code and unused exports. Git remembers.