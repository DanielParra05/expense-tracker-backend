import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import type { User } from './domain/user';
import { userMapper } from './user.mapper';

export type CreateUserData = {
  readonly firstName: string;
  readonly lastName: string | null;
  readonly email: string;
};

export type UpdateUserData = {
  readonly firstName?: string;
  readonly lastName?: string | null;
  readonly email?: string;
};

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<User> {
    const record = await this.prisma.user.create({ data });
    return userMapper.toDomain(record);
  }

  async findAll(): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map((record) => userMapper.toDomain(record));
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record === null ? null : userMapper.toDomain(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    return record === null ? null : userMapper.toDomain(record);
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const record = await this.prisma.user.update({ where: { id }, data });
    return userMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
