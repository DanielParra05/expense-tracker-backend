import { ConflictError } from '../../../shared/errors/conflict.error';
import { NotFoundError } from '../../../shared/errors/not-found.error';

export const CategoryErrorCode = {
  NOT_FOUND: 'CATEGORY_NOT_FOUND',
  NAME_TAKEN: 'CATEGORY_NAME_TAKEN',
} as const;

export type CategoryErrorCode =
  (typeof CategoryErrorCode)[keyof typeof CategoryErrorCode];

export class CategoryNotFoundError extends NotFoundError {
  readonly code: CategoryErrorCode = CategoryErrorCode.NOT_FOUND;

  constructor(categoryId: string) {
    super(`Category ${categoryId} was not found`);
  }
}

export class CategoryNameTakenError extends ConflictError {
  readonly code: CategoryErrorCode = CategoryErrorCode.NAME_TAKEN;

  constructor(name: string) {
    super(`Category name ${name} is already taken`);
  }
}
