import type { Prisma } from '../../generated/prisma/client';

export type IncomeRecord = {
  readonly id: string;
  readonly groupId: string;
  readonly name: string;
  readonly value: Prisma.Decimal;
  readonly date: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
