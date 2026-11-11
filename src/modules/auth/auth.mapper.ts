import { userMapper } from '../users/users.mapper';
import type {
  AuthSession,
  PasswordLogin,
  Registration,
} from './domain/auth.types';
import type { AuthSessionResponseDto } from './dto/auth-session-response.dto';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

export const authMapper = {
  fromRegisterDto(dto: RegisterDto): Registration {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName ?? null,
      email: dto.email,
      password: dto.password,
      groupId: dto.groupId,
    };
  },

  fromLoginDto(dto: LoginDto): PasswordLogin {
    return { email: dto.email, password: dto.password };
  },

  toResponse(session: AuthSession): AuthSessionResponseDto {
    return {
      accessToken: session.accessToken.token,
      tokenType: 'Bearer',
      expiresIn: session.accessToken.expiresInSeconds,
      user: userMapper.toResponse(session.user),
    };
  },
};
