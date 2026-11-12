import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { categoryMapper } from './categories.mapper';
import type {
  Category,
  CategoryChanges,
  NewCategory,
} from './domain/categories.types';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: NewCategory): Promise<Category> {
    const record = await this.prisma.category.create({ data });
    return categoryMapper.toDomain(record);
  }

  async findAll(groupId: string): Promise<Category[]> {
    const records = await this.prisma.category.findMany({
      where: { groupId },
      orderBy: { name: 'asc' },
    });
    return records.map((record) => categoryMapper.toDomain(record));
  }

  async findById(groupId: string, id: string): Promise<Category | null> {
    const record = await this.prisma.category.findFirst({
      where: { id, groupId },
    });
    return record === null ? null : categoryMapper.toDomain(record);
  }

  async existsByName(groupId: string, name: string): Promise<boolean> {
    const count = await this.prisma.category.count({
      where: { groupId, name },
    });
    return count > 0;
  }

  async update(
    groupId: string,
    id: string,
    changes: CategoryChanges,
  ): Promise<Category> {
    const record = await this.prisma.category.update({
      where: { id, groupId },
      data: changes,
    });
    return categoryMapper.toDomain(record);
  }

  async delete(groupId: string, id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id, groupId } });
  }
}
