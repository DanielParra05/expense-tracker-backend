import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  USER_EMAIL_MAX_LENGTH,
  USER_NAME_MAX_LENGTH,
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from '../../users/dto/user-field.constants';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(USER_NAME_MAX_LENGTH)
  readonly firstName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(USER_NAME_MAX_LENGTH)
  readonly lastName?: string | null;

  @IsEmail()
  @MaxLength(USER_EMAIL_MAX_LENGTH)
  readonly email!: string;

  @IsString()
  @MinLength(USER_PASSWORD_MIN_LENGTH)
  @MaxLength(USER_PASSWORD_MAX_LENGTH)
  readonly password!: string;

  @IsOptional()
  @IsUUID()
  readonly groupId?: string;
}
