import {
  parseCalendarMonth,
  toCalendarDate,
} from '../../shared/dates/calendar-dates';
import { decimalToCents } from '../../shared/prisma/decimal-cents';
import type {
  Income,
  IncomeChanges,
  IncomeMonthQuery,
  NewIncome,
} from './domain/incomes.types';
import type { CreateIncomeDto } from './dto/create-income.dto';
import type { IncomeResponseDto } from './dto/income-response.dto';
import type { ListIncomesQueryDto } from './dto/list-incomes-query.dto';
import type { UpdateIncomeDto } from './dto/update-income.dto';
import type { IncomeRecord } from './incomes.records';

export const incomeMapper = {
  toDomain(record: IncomeRecord): Income {
    return {
      id: record.id,
      groupId: record.groupId,
      name: record.name,
      valueCents: decimalToCents(record.value),
      date: toCalendarDate(record.date),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  },

  toResponse(income: Income): IncomeResponseDto {
    return {
      id: income.id,
      name: income.name,
      valueCents: income.valueCents,
      date: income.date,
      createdAt: income.createdAt.toISOString(),
      updatedAt: income.updatedAt.toISOString(),
    };
  },

  fromCreateDto(dto: CreateIncomeDto, groupId: string): NewIncome {
    return {
      groupId,
      name: dto.name,
      valueCents: dto.valueCents,
      date: dto.date,
    };
  },

  fromUpdateDto(dto: UpdateIncomeDto): IncomeChanges {
    return {
      name: dto.name,
      valueCents: dto.valueCents,
      date: dto.date,
    };
  },

  fromListQuery(query: ListIncomesQueryDto, groupId: string): IncomeMonthQuery {
    return { groupId, month: parseCalendarMonth(query.month) };
  },
};
