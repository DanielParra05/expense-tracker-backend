import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import {
  USER_EMAIL_MAX_LENGTH,
  USER_NAME_MAX_LENGTH,
} from './user-field.constants';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(USER_NAME_MAX_LENGTH)
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(USER_NAME_MAX_LENGTH)
  readonly lastName?: string | null;

  @IsOptional()
  @IsEmail()
  @MaxLength(USER_EMAIL_MAX_LENGTH)
  readonly email?: string;

  @IsOptional()
  @IsUUID()
  readonly groupId?: string;
}
