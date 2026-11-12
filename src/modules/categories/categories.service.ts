import { Injectable, Logger } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CategoryNameTakenError, CategoryNotFoundError } from './domain/errors';
import type {
  Category,
  CategoryChanges,
  NewCategory,
} from './domain/categories.types';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(newCategory: NewCategory): Promise<Category> {
    await this.assertNameAvailable(newCategory.groupId, newCategory.name);

    const category = await this.categoriesRepository.create(newCategory);

    this.logger.log({
      msg: 'Category created',
      categoryId: category.id,
      groupId: category.groupId,
    });
    return category;
  }

  findAll(groupId: string): Promise<Category[]> {
    return this.categoriesRepository.findAll(groupId);
  }

  async findById(groupId: string, id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(groupId, id);
    if (category === null) {
      throw new CategoryNotFoundError(id);
    }
    return category;
  }

  async assertExists(groupId: string, id: string): Promise<void> {
    await this.findById(groupId, id);
  }

  async update(
    groupId: string,
    id: string,
    changes: CategoryChanges,
  ): Promise<Category> {
    const existing = await this.findById(groupId, id);
    if (changes.name !== undefined && changes.name !== existing.name) {
      await this.assertNameAvailable(groupId, changes.name);
    }

    const category = await this.categoriesRepository.update(
      groupId,
      id,
      changes,
    );

    this.logger.log({ msg: 'Category updated', categoryId: id, groupId });
    return category;
  }

  async delete(groupId: string, id: string): Promise<void> {
    await this.findById(groupId, id);
    await this.categoriesRepository.delete(groupId, id);

    this.logger.log({ msg: 'Category deleted', categoryId: id, groupId });
  }

  // Racy alone; the unique index plus the P2002 mapping is what closes the window.
  private async assertNameAvailable(
    groupId: string,
    name: string,
  ): Promise<void> {
    const isTaken = await this.categoriesRepository.existsByName(groupId, name);
    if (isTaken) {
      throw new CategoryNameTakenError(name);
    }
  }
}
