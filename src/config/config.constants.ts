import type { LogLevel } from '@nestjs/common';

export const DEFAULT_APP_PORT = 3000;
export const DEFAULT_LOG_LEVEL: LogLevel = 'log';
export const MIN_PORT = 1;
export const MAX_PORT = 65535;
export const MIN_JWT_SECRET_LENGTH = 32;
export const POSTGRES_PROTOCOLS = ['postgres:', 'postgresql:'] as const;
