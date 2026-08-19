import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import type { Config } from './config/config.types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get<ConfigService<Config, true>>(ConfigService);

  app.enableShutdownHooks();

  await app.listen(configService.get('app.port', { infer: true }));
}

void bootstrap();
