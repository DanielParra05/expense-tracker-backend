import { Injectable, Logger } from '@nestjs/common';
import { GroupService } from '../groups/group.service';
import { EmailAlreadyTakenError, UserNotFoundError } from './domain/errors';
import type { User } from './domain/user';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { type CreateUserData, UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly groupService: GroupService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const data = {
      firstName: dto.firstName,
      lastName: dto.lastName ?? null,
      email: dto.email,
    };

    const user =
      dto.groupId === undefined
        ? await this.createWithNewGroup(data)
        : await this.createInGroup(data, dto.groupId);

    this.logger.log({
      msg: 'User created',
      userId: user.id,
      groupId: user.groupId,
    });
    return user;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      throw new UserNotFoundError(id);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const existing = await this.findById(id);
    const isChangingEmail =
      dto.email !== undefined && dto.email !== existing.email;
    const newGroupId =
      dto.groupId === existing.groupId ? undefined : dto.groupId;

    await Promise.all([
      isChangingEmail && this.assertEmailAvailable(dto.email),
      newGroupId !== undefined && this.groupService.assertExists(newGroupId),
    ]);

    const user = await this.userRepository.update(id, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      groupId: newGroupId,
    });

    this.logger.log({
      msg: 'User updated',
      userId: user.id,
      groupId: user.groupId,
    });
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);

    this.logger.log({ msg: 'User deleted', userId: id });
  }

  private async createWithNewGroup(data: CreateUserData): Promise<User> {
    await this.assertEmailAvailable(data.email);
    return this.userRepository.createWithNewGroup(data);
  }

  private async createInGroup(
    data: CreateUserData,
    groupId: string,
  ): Promise<User> {
    await Promise.all([
      this.assertEmailAvailable(data.email),
      this.groupService.assertExists(groupId),
    ]);
    return this.userRepository.createInGroup(data, groupId);
  }

  // Racy alone; the unique index plus the P2002 mapping is what closes the window.
  private async assertEmailAvailable(email: string): Promise<void> {
    const isTaken = await this.userRepository.existsByEmail(email);
    if (isTaken) {
      throw new EmailAlreadyTakenError(email);
    }
  }
}
