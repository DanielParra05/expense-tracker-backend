import type { CalendarMonth } from './calendar-month';

const CALENDAR_DATE_LENGTH = 10;

export function toCalendarDate(date: Date): string {
  return date.toISOString().slice(0, CALENDAR_DATE_LENGTH);
}

export function fromCalendarDate(calendarDate: string): Date {
  return new Date(`${calendarDate}T00:00:00.000Z`);
}

export function parseCalendarMonth(calendarMonth: string): CalendarMonth {
  const [year, month] = calendarMonth.split('-').map(Number);
  return { year, month };
}

export function monthBounds({ year, month }: CalendarMonth): {
  readonly start: Date;
  readonly nextStart: Date;
} {
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    nextStart: new Date(Date.UTC(year, month, 1)),
  };
}
