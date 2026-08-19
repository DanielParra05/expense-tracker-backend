export type AppConfig = {
  readonly port: number;
};

export type DatabaseConfig = {
  readonly url: string;
};

export type Config = {
  readonly app: AppConfig;
  readonly database: DatabaseConfig;
};
