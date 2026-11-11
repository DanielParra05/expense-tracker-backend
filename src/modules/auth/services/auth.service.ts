import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Config } from '../../../config/config.types';
import { UserNotFoundError } from '../../users/domain/errors';
import type { User } from '../../users/domain/users.types';
import { UsersService } from '../../users/users.service';
import type {
  AuthSession,
  PasswordLogin,
  Registration,
} from '../domain/auth.types';
import { InvalidCredentialsError, InvalidTokenError } from '../domain/errors';
import { AccessTokenSignerService } from './access-token-signer.service';
import { PasswordHasherService } from './password-hasher.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly passwordHasherService: PasswordHasherService,
    private readonly accessTokenSignerService: AccessTokenSignerService,
    private readonly configService: ConfigService<Config, true>,
  ) {}

  async register(registration: Registration): Promise<AuthSession> {
    const { password, ...profile } = registration;
    const user = await this.usersService.create({
      ...profile,
      passwordHash: await this.passwordHasherService.hash(password),
    });

    this.logger.log({
      msg: 'User registered',
      userId: user.id,
      method: 'password',
    });
    return this.startSession(user);
  }

  async login(attempt: PasswordLogin): Promise<AuthSession> {
    const userId = await this.verifyCredentials(attempt);
    const user = await this.usersService.findById(userId);

    this.logger.log({ msg: 'User logged in', userId, method: 'password' });
    return this.startSession(user);
  }

  async authenticate(token: string): Promise<User> {
    const payload = await this.accessTokenSignerService.verify(token);
    return this.findTokenOwner(payload.sub);
  }

  private async startSession(user: User): Promise<AuthSession> {
    const token = await this.accessTokenSignerService.sign({ sub: user.id });
    return {
      user,
      accessToken: {
        token,
        expiresInSeconds: this.configService.get('auth.jwtExpiresInSeconds', {
          infer: true,
        }),
      },
    };
  }

  private async verifyCredentials(attempt: PasswordLogin): Promise<string> {
    const credentials = await this.usersService.findPasswordCredentials(
      attempt.email,
    );
    if (credentials === null) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordHasherService.verify(
      credentials.passwordHash,
      attempt.password,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }
    return credentials.userId;
  }

  private async findTokenOwner(userId: string): Promise<User> {
    try {
      return await this.usersService.findById(userId);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new InvalidTokenError();
      }
      throw error;
    }
  }
}
