import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthenticatedRequest } from '../authenticated-request';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { MissingTokenError } from '../domain/errors';
import { AuthService } from '../services/auth.service';

const BEARER_SCHEME = 'Bearer';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = extractBearerToken(request.headers.authorization);
    request.user = await this.authService.authenticate(token);
    return true;
  }

  private isPublic(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    return isPublic === true;
  }
}

function extractBearerToken(header: string | undefined): string {
  const [scheme, token] = header?.split(' ') ?? [];
  if (scheme !== BEARER_SCHEME || token === undefined || token === '') {
    throw new MissingTokenError();
  }
  return token;
}
