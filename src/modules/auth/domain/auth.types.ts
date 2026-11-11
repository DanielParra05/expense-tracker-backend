import type { User } from '../../users/domain/users.types';

export type Registration = {
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
  readonly password: string;
  readonly groupId?: string;
};

export type PasswordLogin = {
  readonly email: string;
  readonly password: string;
};

export type AccessTokenPayload = {
  readonly sub: string;
};

export type AccessToken = {
  readonly token: string;
  readonly expiresInSeconds: number;
};

export type AuthSession = {
  readonly user: User;
  readonly accessToken: AccessToken;
};
