import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import type { NewUser } from './domain/new-user';
import type { PasswordCredentials } from './domain/password-credentials';
import type { User } from './domain/user';
import type { UserChanges } from './domain/user-changes';
import { userMapper } from './users.mapper';

type NewUserFields = Omit<NewUser, 'groupId'>;
type UserFields = Omit<UserChanges, 'groupId'>;

const WITH_GROUP_ID = {
  groupMembership: { select: { groupId: true } },
} satisfies Prisma.UserInclude;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithNewGroup(data: NewUserFields): Promise<User> {
    const record = await this.prisma.user.create({
      data: {
        ...data,
        groupMembership: { create: { group: { create: {} } } },
      },
      include: WITH_GROUP_ID,
    });
    return userMapper.toDomain(record);
  }

  async createInGroup(data: NewUserFields, groupId: string): Promise<User> {
    const record = await this.prisma.user.create({
      data: {
        ...data,
        groupMembership: { create: { group: { connect: { id: groupId } } } },
      },
      include: WITH_GROUP_ID,
    });
    return userMapper.toDomain(record);
  }

  async findAll(): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: WITH_GROUP_ID,
    });
    return records.map((record) => userMapper.toDomain(record));
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { id },
      include: WITH_GROUP_ID,
    });
    return record === null ? null : userMapper.toDomain(record);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }

  async update(id: string, data: UserChanges): Promise<User> {
    const { groupId, ...fields } = data;
    if (groupId !== undefined) {
      return this.updateAndMoveToGroup(id, fields, groupId);
    }

    const record = await this.prisma.user.update({
      where: { id },
      data: fields,
      include: WITH_GROUP_ID,
    });
    return userMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const membership = await tx.groupMember.findUniqueOrThrow({
        where: { userId: id },
      });
      await tx.user.delete({ where: { id } });
      await deleteGroupIfEmpty(tx, membership.groupId);
    });
  }

  private updateAndMoveToGroup(
    id: string,
    fields: UserFields,
    groupId: string,
  ): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      const previousMembership = await tx.groupMember.findUniqueOrThrow({
        where: { userId: id },
      });
      await tx.groupMember.update({
        where: { userId: id },
        data: { groupId },
      });
      const record = await tx.user.update({
        where: { id },
        data: fields,
        include: WITH_GROUP_ID,
      });
      await deleteGroupIfEmpty(tx, previousMembership.groupId);
      return userMapper.toDomain(record);
    });
  }

  async findPasswordCredentials(
    email: string,
  ): Promise<PasswordCredentials | null> {
    const record = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });
    if (record === null || record.passwordHash === null) {
      return null;
    }
    return { userId: record.id, passwordHash: record.passwordHash };
  }
}

async function deleteGroupIfEmpty(
  tx: Prisma.TransactionClient,
  groupId: string,
): Promise<void> {
  await tx.group.deleteMany({ where: { id: groupId, members: { none: {} } } });
}
