import { IsEmail, IsString, MaxLength } from 'class-validator';
import {
  USER_EMAIL_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
} from '../../users/dto/user-field.constants';

// No minimum length here: a short password must fail like any wrong password,
// not with a validation error that tells an attacker something.
export class LoginDto {
  @IsEmail()
  @MaxLength(USER_EMAIL_MAX_LENGTH)
  readonly email!: string;

  @IsString()
  @MaxLength(USER_PASSWORD_MAX_LENGTH)
  readonly password!: string;
}
