import { NotFoundError } from '../../../shared/errors/not-found.error';

export const IncomeErrorCode = {
  NOT_FOUND: 'INCOME_NOT_FOUND',
} as const;

export type IncomeErrorCode =
  (typeof IncomeErrorCode)[keyof typeof IncomeErrorCode];

export class IncomeNotFoundError extends NotFoundError {
  readonly code: IncomeErrorCode = IncomeErrorCode.NOT_FOUND;

  constructor(incomeId: string) {
    super(`Income ${incomeId} was not found`);
  }
}
