import type { LogLevel } from '@nestjs/common';

export type AppConfig = {
  readonly port: number;
  readonly logLevels: readonly LogLevel[];
};

export type DatabaseConfig = {
  readonly url: string;
};

export type Config = {
  readonly app: AppConfig;
  readonly database: DatabaseConfig;
};
