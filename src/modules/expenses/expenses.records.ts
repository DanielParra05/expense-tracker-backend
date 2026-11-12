import type { Prisma } from '../../generated/prisma/client';

export type ExpenseRecord = {
  readonly id: string;
  readonly groupId: string;
  readonly categoryId: string | null;
  readonly name: string;
  readonly value: Prisma.Decimal;
  readonly date: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
