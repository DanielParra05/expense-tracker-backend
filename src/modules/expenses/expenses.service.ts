import { Injectable, Logger } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { ExpenseNotFoundError } from './domain/errors';
import type {
  Expense,
  ExpenseChanges,
  ExpenseMonthQuery,
  NewExpense,
} from './domain/expenses.types';
import { ExpensesRepository } from './expenses.repository';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);

  constructor(
    private readonly expensesRepository: ExpensesRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(newExpense: NewExpense): Promise<Expense> {
    await this.assertCategoryBelongsToGroup(
      newExpense.groupId,
      newExpense.categoryId,
    );

    const expense = await this.expensesRepository.create(newExpense);

    this.logger.log({
      msg: 'Expense created',
      expenseId: expense.id,
      groupId: expense.groupId,
    });
    return expense;
  }

  findAllInMonth(query: ExpenseMonthQuery): Promise<Expense[]> {
    return this.expensesRepository.findAllInMonth(query);
  }

  async findById(groupId: string, id: string): Promise<Expense> {
    const expense = await this.expensesRepository.findById(groupId, id);
    if (expense === null) {
      throw new ExpenseNotFoundError(id);
    }
    return expense;
  }

  async update(
    groupId: string,
    id: string,
    changes: ExpenseChanges,
  ): Promise<Expense> {
    await this.findById(groupId, id);
    await this.assertCategoryBelongsToGroup(groupId, changes.categoryId);

    const expense = await this.expensesRepository.update(groupId, id, changes);

    this.logger.log({ msg: 'Expense updated', expenseId: id, groupId });
    return expense;
  }

  async delete(groupId: string, id: string): Promise<void> {
    await this.findById(groupId, id);
    await this.expensesRepository.delete(groupId, id);

    this.logger.log({ msg: 'Expense deleted', expenseId: id, groupId });
  }

  private async assertCategoryBelongsToGroup(
    groupId: string,
    categoryId: string | null | undefined,
  ): Promise<void> {
    if (typeof categoryId === 'string') {
      await this.categoriesService.assertExists(groupId, categoryId);
    }
  }
}
