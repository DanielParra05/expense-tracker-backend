import {
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CALENDAR_DATE_PATTERN } from '../../../shared/dates/calendar-date.constants';
import {
  MAX_VALUE_CENTS,
  MIN_VALUE_CENTS,
} from '../../../shared/money/money.constants';
import { INCOME_NAME_MAX_LENGTH } from './income-field.constants';

export class UpdateIncomeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(INCOME_NAME_MAX_LENGTH)
  readonly name?: string;

  @IsOptional()
  @IsInt()
  @Min(MIN_VALUE_CENTS)
  @Max(MAX_VALUE_CENTS)
  readonly valueCents?: number;

  @IsOptional()
  @Matches(CALENDAR_DATE_PATTERN)
  @IsISO8601({ strict: true })
  readonly date?: string;
}
