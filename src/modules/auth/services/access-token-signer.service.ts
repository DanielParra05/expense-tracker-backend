import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AccessTokenPayload } from '../domain/auth.types';
import { InvalidTokenError } from '../domain/errors';

@Injectable()
export class AccessTokenSignerService {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: AccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verify(token: string): Promise<AccessTokenPayload> {
    try {
      return await this.jwtService.verifyAsync<AccessTokenPayload>(token);
    } catch {
      // Expired, malformed and wrongly signed tokens all get the same answer.
      throw new InvalidTokenError();
    }
  }
}
