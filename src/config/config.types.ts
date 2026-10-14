import type { LogLevel } from '@nestjs/common';

export type AppConfig = {
  readonly port: number;
  readonly logLevels: readonly LogLevel[];
};

export type DatabaseConfig = {
  readonly url: string;
};

export type AuthConfig = {
  readonly jwtSecret: string;
  readonly jwtExpiresInSeconds: number;
};

export type Config = {
  readonly app: AppConfig;
  readonly database: DatabaseConfig;
  readonly auth: AuthConfig;
};

export type Env = {
  readonly APP_PORT: number;
  readonly DATABASE_URL: string;
  readonly LOG_LEVEL: LogLevel;
  readonly JWT_SECRET: string;
  readonly JWT_EXPIRES_IN_SECONDS: number;
};

export type ParseSuccess<T> = { readonly ok: true; readonly value: T };
export type ParseFailure = { readonly ok: false; readonly error: string };
export type ParseResult<T> = ParseSuccess<T> | ParseFailure;
