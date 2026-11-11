import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import type { Config } from '../../config/config.types';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AccessTokenSignerService } from './services/access-token-signer.service';
import { AuthService } from './services/auth.service';
import { PasswordHasherService } from './services/password-hasher.service';

// Pinned on both sign and verify so a token using another algorithm
// (including `none`) is never accepted.
const JWT_ALGORITHM = 'HS256';
const AUTH_THROTTLE_TTL_MS = 60_000;
const AUTH_THROTTLE_LIMIT = 10;

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config, true>) => ({
        secret: configService.get('auth.jwtSecret', { infer: true }),
        signOptions: {
          algorithm: JWT_ALGORITHM,
          expiresIn: configService.get('auth.jwtExpiresInSeconds', {
            infer: true,
          }),
        },
        verifyOptions: { algorithms: [JWT_ALGORITHM] },
      }),
    }),
    ThrottlerModule.forRoot([
      { ttl: AUTH_THROTTLE_TTL_MS, limit: AUTH_THROTTLE_LIMIT },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordHasherService,
    AccessTokenSignerService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AuthModule {}
