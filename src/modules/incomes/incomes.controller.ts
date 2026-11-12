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
import { CreateIncomeDto } from './dto/create-income.dto';
import type { IncomeResponseDto } from './dto/income-response.dto';
import { ListIncomesQueryDto } from './dto/list-incomes-query.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { incomeMapper } from './incomes.mapper';
import { IncomesService } from './incomes.service';

@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateIncomeDto,
  ): Promise<IncomeResponseDto> {
    const income = await this.incomesService.create(
      incomeMapper.fromCreateDto(dto, user.groupId),
    );
    return incomeMapper.toResponse(income);
  }

  @Get()
  async findAllInMonth(
    @CurrentUser() user: User,
    @Query() query: ListIncomesQueryDto,
  ): Promise<IncomeResponseDto[]> {
    const incomes = await this.incomesService.findAllInMonth(
      incomeMapper.fromListQuery(query, user.groupId),
    );
    return incomes.map((income) => incomeMapper.toResponse(income));
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param() { id }: IdParamDto,
  ): Promise<IncomeResponseDto> {
    const income = await this.incomesService.findById(user.groupId, id);
    return incomeMapper.toResponse(income);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: User,
    @Param() { id }: IdParamDto,
    @Body() dto: UpdateIncomeDto,
  ): Promise<IncomeResponseDto> {
    const income = await this.incomesService.update(
      user.groupId,
      id,
      incomeMapper.fromUpdateDto(dto),
    );
    return incomeMapper.toResponse(income);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: User,
    @Param() { id }: IdParamDto,
  ): Promise<void> {
    await this.incomesService.delete(user.groupId, id);
  }
}
