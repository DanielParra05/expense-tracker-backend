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
} from '@nestjs/common';
import { IdParamDto } from '../../shared/dto/id-param.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '../users/domain/users.types';
import { categoryMapper } from './categories.mapper';
import { CategoriesService } from './categories.service';
import type { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.create(
      categoryMapper.fromCreateDto(dto, user.groupId),
    );
    return categoryMapper.toResponse(category);
  }

  @Get()
  async findAll(@CurrentUser() user: User): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesService.findAll(user.groupId);
    return categories.map((category) => categoryMapper.toResponse(category));
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param() { id }: IdParamDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.findById(user.groupId, id);
    return categoryMapper.toResponse(category);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: User,
    @Param() { id }: IdParamDto,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.update(
      user.groupId,
      id,
      categoryMapper.fromUpdateDto(dto),
    );
    return categoryMapper.toResponse(category);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: User,
    @Param() { id }: IdParamDto,
  ): Promise<void> {
    await this.categoriesService.delete(user.groupId, id);
  }
}
