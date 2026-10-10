import { NotFoundError } from '../../../shared/errors/not-found.error';

export const GroupErrorCode = {
  NOT_FOUND: 'GROUP_NOT_FOUND',
} as const;

export type GroupErrorCode =
  (typeof GroupErrorCode)[keyof typeof GroupErrorCode];

export class GroupNotFoundError extends NotFoundError {
  readonly code: GroupErrorCode = GroupErrorCode.NOT_FOUND;

  constructor(groupId: string) {
    super(`Group ${groupId} was not found`);
  }
}
