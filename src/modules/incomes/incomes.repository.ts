import { Injectable } from '@nestjs/common';
import {
  fromCalendarDate,
  monthBounds,
} from '../../shared/dates/calendar-dates';
import { centsToDecimal } from '../../shared/prisma/decimal-cents';
import { PrismaService } from '../../shared/prisma/prisma.service';
import type {
  Income,
  IncomeChanges,
  IncomeMonthQuery,
  NewIncome,
} from './domain/incomes.types';
import { incomeMapper } from './incomes.mapper';

@Injectable()
export class IncomesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: NewIncome): Promise<Income> {
    const record = await this.prisma.income.create({
      data: {
        groupId: data.groupId,
        name: data.name,
        value: centsToDecimal(data.valueCents),
        date: fromCalendarDate(data.date),
      },
    });
    return incomeMapper.toDomain(record);
  }

  async findAllInMonth({
    groupId,
    month,
  }: IncomeMonthQuery): Promise<Income[]> {
    const { start, nextStart } = monthBounds(month);
    const records = await this.prisma.income.findMany({
      where: { groupId, date: { gte: start, lt: nextStart } },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });
    return records.map((record) => incomeMapper.toDomain(record));
  }

  async findById(groupId: string, id: string): Promise<Income | null> {
    const record = await this.prisma.income.findFirst({
      where: { id, groupId },
    });
    return record === null ? null : incomeMapper.toDomain(record);
  }

  async update(
    groupId: string,
    id: string,
    changes: IncomeChanges,
  ): Promise<Income> {
    const record = await this.prisma.income.update({
      where: { id, groupId },
      data: {
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
    return incomeMapper.toDomain(record);
  }

  async delete(groupId: string, id: string): Promise<void> {
    await this.prisma.income.delete({ where: { id, groupId } });
  }
}
