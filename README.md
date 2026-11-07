# Expense Tracker — Backend

REST API for a shared expense tracker. Users belong to a group, and a group's members share its expenses, incomes and categories.

Built with **NestJS 11**, **Prisma 7** (with the `pg` driver adapter) and **PostgreSQL 17**.

## Requirements

- Node.js 20+
- Yarn
- Docker, for the local database

## Getting started

```bash
# 1. Install dependencies (also runs `prisma generate`)
yarn install

# 2. Configure the environment
cp .env.example .env
# then set JWT_SECRET to a random value: openssl rand -base64 48

# 3. Start PostgreSQL
docker compose up -d

# 4. Apply migrations
yarn db:migrate

# 5. Run the API in watch mode
yarn start:dev
```

The API listens on `APP_PORT` (default `3000`).

## Environment variables

All variables are validated at startup. The app refuses to boot and lists every problem it finds.

| Variable                 | Required | Description                                                         |
| ------------------------ | -------- | ------------------------------------------------------------------- |
| `DATABASE_URL`           | yes      | `postgres://` or `postgresql://` connection string                  |
| `JWT_SECRET`             | yes      | At least 32 characters; use a different value per environment       |
| `JWT_EXPIRES_IN_SECONDS` | yes      | Access-token lifetime, a positive integer (e.g. `900`)              |
| `APP_PORT`               | no       | HTTP port, `1`–`65535`; defaults to `3000`                          |
| `LOG_LEVEL`              | no       | `verbose`, `debug`, `log`, `warn`, `error` or `fatal`; defaults to `log` |

Never commit `.env`.

## Scripts

| Command             | What it does                                     |
| ------------------- | ------------------------------------------------ |
| `yarn start:dev`    | Run in watch mode                                |
| `yarn start:debug`  | Run in watch mode with the debugger attached     |
| `yarn build`        | Compile to `dist/`                               |
| `yarn start:prod`   | Run the compiled build                           |
| `yarn lint`         | ESLint, with autofix                             |
| `yarn format`       | Prettier                                         |
| `yarn test`         | Unit tests (Jest)                                |
| `yarn test:e2e`     | End-to-end tests                                 |
| `yarn db:migrate`   | Create and apply a migration in development      |
| `yarn db:deploy`    | Apply pending migrations (CI / production)       |
| `yarn db:studio`    | Open Prisma Studio                               |

## Project structure

```text
src/
├── main.ts            # bootstrap: logger, global ValidationPipe and exception filters
├── app.module.ts
├── config/            # typed configuration and env validation
├── shared/
│   ├── prisma/        # PrismaService (global)
│   ├── errors/        # DomainError base classes and shared error codes
│   ├── filters/       # map exceptions to { code, message } responses
│   └── validation/    # class-validator errors → field error codes
├── generated/prisma/  # Prisma client (generated, not edited)
└── modules/
    ├── users/         # controller → service → repository, with domain/ and dto/
    ├── groups/
    ├── auth/          # in progress
    └── expenses/      # in progress
```

Each module follows the same layering:

- **Controllers** handle HTTP. They map DTOs to domain types through the module's mapper and call services, never repositories.
- **Services** hold the business rules. They accept and return domain types, and they throw domain errors instead of `HttpException`.
- **Repositories** are the only place Prisma is used. They return domain objects, never Prisma models.

The full set of conventions lives in [CLAUDE.md](CLAUDE.md).

## Error responses

Every error has the same shape. The HTTP status line carries the status:

```json
{ "code": "USER_NOT_FOUND", "message": "User 6f1c… was not found" }
```

Validation failures add a `fields` map:

```json
{
  "code": "VALIDATION_FAILED",
  "message": "Request validation failed",
  "fields": { "email": "INVALID_EMAIL" }
}
```

`code` is a stable identifier that clients map to user-facing text. `message` is for developers only.

## Authentication

JWT authentication is being implemented following [docs/jwt-authentication-guide.pdf](docs/jwt-authentication-guide.pdf). Once it's done:

- `POST /auth/register` and `POST /auth/login` are the only public routes.
- Every other route requires an `Authorization: Bearer <token>` header.
