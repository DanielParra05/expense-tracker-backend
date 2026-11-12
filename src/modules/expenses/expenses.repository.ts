import { Injectable } from '@nestjs/common';
import {
  fromCalendarDate,
  monthBounds,
} from '../../shared/dates/calendar-dates';
import { centsToDecimal } from '../../shared/prisma/decimal-cents';
import { PrismaService } from '../../shared/prisma/prisma.service';
import type {
  Expense,
  ExpenseChanges,
  ExpenseMonthQuery,
  NewExpense,
} from './domain/expenses.types';
import { expenseMapper } from './expenses.mapper';

@Injectable()
export class ExpensesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: NewExpense): Promise<Expense> {
    const record = await this.prisma.expense.create({
      data: {
        groupId: data.groupId,
        categoryId: data.categoryId,
        name: data.name,
        value: centsToDecimal(data.valueCents),
        date: fromCalendarDate(data.date),
      },
    });
    return expenseMapper.toDomain(record);
  }

  async findAllInMonth({
    groupId,
    month,
  }: ExpenseMonthQuery): Promise<Expense[]> {
    const { start, nextStart } = monthBounds(month);
    const records = await this.prisma.expense.findMany({
      where: { groupId, date: { gte: start, lt: nextStart } },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });
    return records.map((record) => expenseMapper.toDomain(record));
  }

  async findById(groupId: string, id: string): Promise<Expense | null> {
    const record = await this.prisma.expense.findFirst({
      where: { id, groupId },
    });
    return record === null ? null : expenseMapper.toDomain(record);
  }

  async update(
    groupId: string,
    id: string,
    changes: ExpenseChanges,
  ): Promise<Expense> {
    const record = await this.prisma.expense.update({
      where: { id, groupId },
      data: {
        categoryId: changes.categoryId,
        name: changes.name,
        value:
          changes.valueCents === undefined
            ? undefined
            : centsToDecimal(changes.valueCents),
        date:
          changes.date === undefined
            ? undefined
            : fromCalendarDate(changes.date),
      },
    });
    return expenseMapper.toDomain(record);
  }

  async delete(groupId: string, id: string): Promise<void> {
    await this.prisma.expense.delete({ where: { id, groupId } });
  }
}
