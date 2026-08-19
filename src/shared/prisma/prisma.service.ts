import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import type { Config } from '../../config/config.types';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService<Config, true>) {
    super({
      adapter: new PrismaPg({
        connectionString: configService.get('database.url', { infer: true }),
      }),
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log({ msg: 'Database connection established' });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log({ msg: 'Database connection closed' });
  }
}
