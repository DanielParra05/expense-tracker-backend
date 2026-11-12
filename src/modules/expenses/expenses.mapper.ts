import {
  parseCalendarMonth,
  toCalendarDate,
} from '../../shared/dates/calendar-dates';
import { decimalToCents } from '../../shared/prisma/decimal-cents';
import type {
  Expense,
  ExpenseChanges,
  ExpenseMonthQuery,
  NewExpense,
} from './domain/expenses.types';
import type { CreateExpenseDto } from './dto/create-expense.dto';
import type { ExpenseResponseDto } from './dto/expense-response.dto';
import type { ListExpensesQueryDto } from './dto/list-expenses-query.dto';
import type { UpdateExpenseDto } from './dto/update-expense.dto';
import type { ExpenseRecord } from './expenses.records';

export const expenseMapper = {
  toDomain(record: ExpenseRecord): Expense {
    return {
      id: record.id,
      groupId: record.groupId,
      categoryId: record.categoryId,
      name: record.name,
      valueCents: decimalToCents(record.value),
      date: toCalendarDate(record.date),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  },

  toResponse(expense: Expense): ExpenseResponseDto {
    return {
      id: expense.id,
      categoryId: expense.categoryId,
      name: expense.name,
      valueCents: expense.valueCents,
      date: expense.date,
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
    };
  },

  fromCreateDto(dto: CreateExpenseDto, groupId: string): NewExpense {
    return {
      groupId,
      categoryId: dto.categoryId ?? null,
      name: dto.name,
      valueCents: dto.valueCents,
      date: dto.date,
    };
  },

  fromUpdateDto(dto: UpdateExpenseDto): ExpenseChanges {
    return {
      categoryId: dto.categoryId,
      name: dto.name,
      valueCents: dto.valueCents,
      date: dto.date,
    };
  },

  fromListQuery(
    query: ListExpensesQueryDto,
    groupId: string,
  ): ExpenseMonthQuery {
    return { groupId, month: parseCalendarMonth(query.month) };
  },
};
