import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor() {}

  hash(password: string): Promise<string> {
    return hash(password);
  }

  verify(password: string, passwordHash: string): Promise<boolean> {
    return verify(passwordHash, password);
  }
}
