import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { User } from '../../users/domain/users.types';
import type { AuthenticatedRequest } from '../authenticated-request';

// A plain Error on purpose: it only happens when a developer puts @CurrentUser()
// on a @Public() route, so it must surface as a 500, not as a client error.
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (request.user === undefined) {
      throw new Error(
        '@CurrentUser() used on a route that is not authenticated',
      );
    }
    return request.user;
  },
);
