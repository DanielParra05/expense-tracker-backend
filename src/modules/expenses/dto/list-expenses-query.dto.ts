import { Matches } from 'class-validator';
import { CALENDAR_MONTH_PATTERN } from '../../../shared/dates/calendar-date.constants';

export class ListExpensesQueryDto {
  @Matches(CALENDAR_MONTH_PATTERN)
  readonly month!: string;
}
