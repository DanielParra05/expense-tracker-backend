import { NotFoundError } from '../../../shared/errors/not-found.error';

export const ExpenseErrorCode = {
  NOT_FOUND: 'EXPENSE_NOT_FOUND',
} as const;

export type ExpenseErrorCode =
  (typeof ExpenseErrorCode)[keyof typeof ExpenseErrorCode];

export class ExpenseNotFoundError extends NotFoundError {
  readonly code: ExpenseErrorCode = ExpenseErrorCode.NOT_FOUND;

  constructor(expenseId: string) {
    super(`Expense ${expenseId} was not found`);
  }
}
