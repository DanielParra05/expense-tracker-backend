import type { Request } from 'express';
import type { User } from '../users/domain/users.types';

export type AuthenticatedRequest = Request & {
  user?: User;
};
