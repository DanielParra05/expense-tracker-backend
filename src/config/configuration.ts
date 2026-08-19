import type { Config } from './config.types';
import { validateEnv } from './env.validation';

export function configuration(): Config {
  const env = validateEnv(process.env);

  return {
    app: {
      port: env.APP_PORT,
    },
    database: {
      url: env.DATABASE_URL,
    },
  };
}
