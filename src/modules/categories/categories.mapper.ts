import type { CategoryRecord } from './categories.records';
import type {
  Category,
  CategoryChanges,
  NewCategory,
} from './domain/categories.types';
import type { CategoryResponseDto } from './dto/category-response.dto';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

export const categoryMapper = {
  toDomain(record: CategoryRecord): Category {
    return {
      id: record.id,
      groupId: record.groupId,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  },

  toResponse(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  },

  fromCreateDto(dto: CreateCategoryDto, groupId: string): NewCategory {
    return { groupId, name: dto.name };
  },

  fromUpdateDto(dto: UpdateCategoryDto): CategoryChanges {
    return { name: dto.name };
  },
};
