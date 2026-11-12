import type { CalendarMonth } from '../../../shared/dates/calendar-month';

export type Income = {
  readonly id: string;
  readonly groupId: string;
  readonly name: string;
  readonly valueCents: number;
  readonly date: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type NewIncome = {
  readonly groupId: string;
  readonly name: string;
  readonly valueCents: number;
  readonly date: string;
};

export type IncomeChanges = {
  readonly name?: string;
  readonly valueCents?: number;
  readonly date?: string;
};

export type IncomeMonthQuery = {
  readonly groupId: string;
  readonly month: CalendarMonth;
};
