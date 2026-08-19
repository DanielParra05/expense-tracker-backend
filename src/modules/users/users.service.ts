import { Injectable, Logger } from '@nestjs/common';
import { EmailAlreadyTakenError, UserNotFoundError } from './domain/errors';
import type { User } from './domain/user';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    await this.assertEmailAvailable(dto.email);

    const user = await this.usersRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName ?? null,
      email: dto.email,
    });

    this.logger.log({ msg: 'User created', userId: user.id });
    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (user === null) {
      throw new UserNotFoundError(id);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const existing = await this.findById(id);

    if (dto.email !== undefined && dto.email !== existing.email) {
      await this.assertEmailAvailable(dto.email);
    }

    const user = await this.usersRepository.update(id, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
    });

    this.logger.log({ msg: 'User updated', userId: user.id });
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.usersRepository.delete(id);

    this.logger.log({ msg: 'User deleted', userId: id });
  }

  // Racy alone; the unique index plus the P2002 mapping is what closes the window.
  private async assertEmailAvailable(email: string): Promise<void> {
    const existing = await this.usersRepository.findByEmail(email);
    if (existing !== null) {
      throw new EmailAlreadyTakenError(email);
    }
  }
}
