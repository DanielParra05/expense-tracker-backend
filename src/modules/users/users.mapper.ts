import type { User, UserChanges } from './domain/users.types';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { UserResponseDto } from './dto/user-response.dto';
import type { UserRecord } from './users.records';

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

  fromUpdateDto(dto: UpdateUserDto): UserChanges {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      groupId: dto.groupId,
    };
  },
};
