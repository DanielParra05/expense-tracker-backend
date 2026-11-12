import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CATEGORY_NAME_MAX_LENGTH } from './category-field.constants';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(CATEGORY_NAME_MAX_LENGTH)
  readonly name!: string;
}
