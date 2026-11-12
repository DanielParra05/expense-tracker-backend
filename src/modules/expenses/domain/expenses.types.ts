import type { CalendarMonth } from '../../../shared/dates/calendar-month';

export type Expense = {
  readonly id: string;
  readonly groupId: string;
  readonly categoryId: string | null;
  readonly name: string;
  readonly valueCents: number;
  readonly date: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export type NewExpense = {
  readonly groupId: string;
  readonly categoryId: string | null;
  readonly name: string;
  readonly valueCents: number;
  readonly date: string;
};

export type ExpenseChanges = {
  readonly categoryId?: string | null;
  readonly name?: string;
  readonly valueCents?: number;
  readonly date?: string;
};

export type ExpenseMonthQuery = {
  readonly groupId: string;
  readonly month: CalendarMonth;
};
