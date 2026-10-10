import type { User } from './domain/user';
import type { UserResponseDto } from './dto/user-response.dto';

type UserRecord = {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly groupMembership: { readonly groupId: string } | null;
};

export const userMapper = {
  toDomain(record: UserRecord): User {
    if (record.groupMembership === null) {
      throw new Error(`User ${record.id} has no group membership`);
    }

    return {
      id: record.id,
      groupId: record.groupMembership.groupId,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  },

  toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      groupId: user.groupId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  },
};
