import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IdParamDto } from '../../shared/dto/id-param.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '../users/domain/users.types';
import { CreateExpenseDto } from './dto/create-expense.dto';
import type { ExpenseResponseDto } from './dto/expense-response.dto';
import { ListExpensesQueryDto } from './dto/list-expenses-query.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { expenseMapper } from './expenses.mapper';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    const expense = await this.expensesService.create(
      expenseMapper.fromCreateDto(dto, user.groupId),
    );
    return expenseMapper.toResponse(expense);
  }

  @Get()
  async findAllInMonth(
    @CurrentUser() user: User,
    @Query() query: ListExpensesQueryDto,
  ): Promise<ExpenseResponseDto[]> {
    const expenses = await this.expensesService.findAllInMonth(
      expenseMapper.fromListQuery(query, user.groupId),
    );
    return expenses.map((expense) => expenseMapper.toResponse(expense));
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param() { id }: IdParamDto,
  ): Promise<ExpenseResponseDto> {
    const expense = await this.expensesService.findById(user.groupId, id);
    return expenseMapper.toResponse(expense);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: User,
    @Param() { id }: IdParamDto,
    @Body() dto: UpdateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    const expense = await this.expensesService.update(
      user.groupId,
      id,
      expenseMapper.fromUpdateDto(dto),
    );
    return expenseMapper.toResponse(expense);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: User,
    @Param() { id }: IdParamDto,
  ): Promise<void> {
    await this.expensesService.delete(user.groupId, id);
  }
}
