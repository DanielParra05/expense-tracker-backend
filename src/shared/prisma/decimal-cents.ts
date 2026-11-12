import { Prisma } from '../../generated/prisma/client';

const CENTS_PER_UNIT = 100;

export function decimalToCents(value: Prisma.Decimal): number {
  return value.mul(CENTS_PER_UNIT).toNumber();
}

export function centsToDecimal(cents: number): Prisma.Decimal {
  return new Prisma.Decimal(cents).div(CENTS_PER_UNIT);
}
