import { ConflictError } from '../../../shared/errors/conflict.error';
import { NotFoundError } from '../../../shared/errors/not-found.error';

export const UserErrorCode = {
  NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_TAKEN: 'USER_EMAIL_TAKEN',
} as const;

export type UserErrorCode = (typeof UserErrorCode)[keyof typeof UserErrorCode];

export class UserNotFoundError extends NotFoundError {
  readonly code: UserErrorCode = UserErrorCode.NOT_FOUND;

  constructor(userId: string) {
    super(`User ${userId} was not found`);
  }
}

export class EmailAlreadyTakenError extends ConflictError {
  readonly code: UserErrorCode = UserErrorCode.EMAIL_TAKEN;

  constructor(email: string) {
    super(`Email ${email} is already taken`);
  }
}
