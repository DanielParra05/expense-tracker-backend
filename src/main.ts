import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { Config } from './config/config.types';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { DomainExceptionFilter } from './shared/filters/domain-exception.filter';
import { PrismaExceptionFilter } from './shared/filters/prisma-exception.filter';
import { validationExceptionFactory } from './shared/validation/validation-exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get<ConfigService<Config, true>>(ConfigService);

  app.useLogger([...configService.get('app.logLevels', { infer: true })]);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaExceptionFilter(),
    new DomainExceptionFilter(),
  );

  app.enableShutdownHooks();

  await app.listen(configService.get('app.port', { infer: true }));
}

void bootstrap();
