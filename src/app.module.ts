import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { UserModule } from './modules/users/user.module';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    PrismaModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
