import { LOG_LEVELS, type LogLevel } from '@nestjs/common';
import type { Config } from './config.types';
import { validateEnv } from './env.validation';

export function configuration(): Config {
  const env = validateEnv(process.env);

  return {
    app: {
      port: env.APP_PORT,
      logLevels: logLevelsFrom(env.LOG_LEVEL),
    },
    database: {
      url: env.DATABASE_URL,
    },
    auth: {
      jwtSecret: env.JWT_SECRET,
      jwtExpiresInSeconds: env.JWT_EXPIRES_IN_SECONDS
    }
  };
}

function logLevelsFrom(level: LogLevel): readonly LogLevel[] {
  return LOG_LEVELS.slice(LOG_LEVELS.indexOf(level));
}
