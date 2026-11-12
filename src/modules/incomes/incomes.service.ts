import { Injectable, Logger } from '@nestjs/common';
import { IncomeNotFoundError } from './domain/errors';
import type {
  Income,
  IncomeChanges,
  IncomeMonthQuery,
  NewIncome,
} from './domain/incomes.types';
import { IncomesRepository } from './incomes.repository';

@Injectable()
export class IncomesService {
  private readonly logger = new Logger(IncomesService.name);

  constructor(private readonly incomesRepository: IncomesRepository) {}

  async create(newIncome: NewIncome): Promise<Income> {
    const income = await this.incomesRepository.create(newIncome);

    this.logger.log({
      msg: 'Income created',
      incomeId: income.id,
      groupId: income.groupId,
    });
    return income;
  }

  findAllInMonth(query: IncomeMonthQuery): Promise<Income[]> {
    return this.incomesRepository.findAllInMonth(query);
  }

  async findById(groupId: string, id: string): Promise<Income> {
    const income = await this.incomesRepository.findById(groupId, id);
    if (income === null) {
      throw new IncomeNotFoundError(id);
    }
    return income;
  }

  async update(
    groupId: string,
    id: string,
    changes: IncomeChanges,
  ): Promise<Income> {
    await this.findById(groupId, id);

    const income = await this.incomesRepository.update(groupId, id, changes);

    this.logger.log({ msg: 'Income updated', incomeId: id, groupId });
    return income;
  }

  async delete(groupId: string, id: string): Promise<void> {
    await this.findById(groupId, id);
    await this.incomesRepository.delete(groupId, id);

    this.logger.log({ msg: 'Income deleted', incomeId: id, groupId });
  }
}
