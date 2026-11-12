export type ExpenseResponseDto = {
  readonly id: string;
  readonly categoryId: string | null;
  readonly name: string;
  readonly valueCents: number;
  readonly date: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};
