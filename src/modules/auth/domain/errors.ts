import { UnauthorizedError } from '../../../shared/errors/unauthorized.error';

export const AuthErrorCode = {
  INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

export class InvalidCredentialsError extends UnauthorizedError {
  readonly code: AuthErrorCode = AuthErrorCode.INVALID_CREDENTIALS;

  constructor() {
    super('Email or password is incorrect');
  }
}

export class MissingTokenError extends UnauthorizedError {
  readonly code: AuthErrorCode = AuthErrorCode.TOKEN_MISSING;

  constructor() {
    super('Authorization header with a Bearer token is required');
  }
}

export class InvalidTokenError extends UnauthorizedError {
  readonly code: AuthErrorCode = AuthErrorCode.TOKEN_INVALID;

  constructor() {
    super('Access token is invalid or expired');
  }
}
