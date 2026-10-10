import { LOG_LEVELS, type LogLevel } from '@nestjs/common';

export type Env = {
  readonly APP_PORT: number;
  readonly DATABASE_URL: string;
  readonly LOG_LEVEL: LogLevel;
};

const DEFAULT_APP_PORT = 3000;
const DEFAULT_LOG_LEVEL: LogLevel = 'log';
const MIN_PORT = 1;
const MAX_PORT = 65535;
const POSTGRES_PROTOCOLS = ['postgres:', 'postgresql:'] as const;

type ParseSuccess<T> = { readonly ok: true; readonly value: T };
type ParseFailure = { readonly ok: false; readonly error: string };
type ParseResult<T> = ParseSuccess<T> | ParseFailure;

export function validateEnv(raw: Record<string, unknown>): Env {
  const appPort = parseAppPort(raw.APP_PORT);
  const databaseUrl = parseDatabaseUrl(raw.DATABASE_URL);
  const logLevel = parseLogLevel(raw.LOG_LEVEL);

  if (!appPort.ok || !databaseUrl.ok || !logLevel.ok) {
    const errors = [appPort, databaseUrl, logLevel]
      .filter((result): result is ParseFailure => !result.ok)
      .map((failure) => failure.error);

    throw new Error(
      `Invalid environment configuration:\n  - ${errors.join('\n  - ')}`,
    );
  }

  return {
    APP_PORT: appPort.value,
    DATABASE_URL: databaseUrl.value,
    LOG_LEVEL: logLevel.value,
  };
}

function parseAppPort(raw: unknown): ParseResult<number> {
  if (raw === undefined || raw === '') {
    return { ok: true, value: DEFAULT_APP_PORT };
  }

  if (typeof raw !== 'string') {
    return { ok: false, error: 'APP_PORT must be a string' };
  }

  const port = Number(raw);
  if (!Number.isInteger(port) || port < MIN_PORT || port > MAX_PORT) {
    return {
      ok: false,
      error: `APP_PORT must be an integer between ${MIN_PORT} and ${MAX_PORT}`,
    };
  }

  return { ok: true, value: port };
}

function parseDatabaseUrl(raw: unknown): ParseResult<string> {
  if (typeof raw !== 'string' || raw === '') {
    return { ok: false, error: 'DATABASE_URL is required' };
  }

  const protocol = readProtocol(raw);
  if (protocol === undefined) {
    return { ok: false, error: 'DATABASE_URL must be a valid URL' };
  }

  if (!POSTGRES_PROTOCOLS.some((allowed) => allowed === protocol)) {
    return {
      ok: false,
      error: `DATABASE_URL must use one of: ${POSTGRES_PROTOCOLS.join(', ')}`,
    };
  }

  return { ok: true, value: raw };
}

function readProtocol(raw: string): string | undefined {
  try {
    return new URL(raw).protocol;
  } catch {
    return undefined;
  }
}

function parseLogLevel(raw: unknown): ParseResult<LogLevel> {
  if (raw === undefined || raw === '') {
    return { ok: true, value: DEFAULT_LOG_LEVEL };
  }

  if (typeof raw !== 'string') {
    return { ok: false, error: 'LOG_LEVEL must be a string' };
  }

  const level = LOG_LEVELS.find((candidate) => candidate === raw);
  if (level === undefined) {
    return {
      ok: false,
      error: `LOG_LEVEL must be one of: ${LOG_LEVELS.join(', ')}`,
    };
  }

  return { ok: true, value: level };
}
