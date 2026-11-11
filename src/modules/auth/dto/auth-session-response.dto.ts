import type { UserResponseDto } from '../../users/dto/user-response.dto';

export type AuthSessionResponseDto = {
  readonly accessToken: string;
  readonly tokenType: 'Bearer';
  readonly expiresIn: number;
  readonly user: UserResponseDto;
};
