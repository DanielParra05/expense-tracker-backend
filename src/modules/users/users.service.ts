import { Injectable, Logger } from '@nestjs/common';
import { GroupsService } from '../groups/groups.service';
import { EmailAlreadyTakenError, UserNotFoundError } from './domain/errors';
import type { NewUser } from './domain/new-user';
import type { PasswordCredentials } from './domain/password-credentials';
import type { User } from './domain/user';
import type { UserChanges } from './domain/user-changes';
import { UsersRepository } from './users.repository';

type NewUserFields = Omit<NewUser, 'groupId'>;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly groupsService: GroupsService,
  ) {}

  async create(newUser: NewUser): Promise<User> {
    const { groupId, ...fields } = newUser;

    const user =
      groupId === undefined
        ? await this.createWithNewGroup(fields)
        : await this.createInGroup(fields, groupId);

    this.logger.log({
      msg: 'User created',
      userId: user.id,
      groupId: user.groupId,
    });
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

  findPasswordCredentials(email: string): Promise<PasswordCredentials | null> {
    return this.usersRepository.findPasswordCredentials(email);
  }

  async update(id: string, changes: UserChanges): Promise<User> {
    const existing = await this.findById(id);
    const isChangingEmail =
      changes.email !== undefined && changes.email !== existing.email;
    const newGroupId =
      changes.groupId === existing.groupId ? undefined : changes.groupId;

    await Promise.all([
      isChangingEmail && this.assertEmailAvailable(changes.email),
      newGroupId !== undefined && this.groupsService.assertExists(newGroupId),
    ]);

    const user = await this.usersRepository.update(id, {
      firstName: changes.firstName,
      lastName: changes.lastName,
      email: changes.email,
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
    await this.usersRepository.delete(id);

    this.logger.log({ msg: 'User deleted', userId: id });
  }

  private async createWithNewGroup(fields: NewUserFields): Promise<User> {
    await this.assertEmailAvailable(fields.email);
    return this.usersRepository.createWithNewGroup(fields);
  }

  private async createInGroup(
    fields: NewUserFields,
    groupId: string,
  ): Promise<User> {
    await Promise.all([
      this.assertEmailAvailable(fields.email),
      this.groupsService.assertExists(groupId),
    ]);
    return this.usersRepository.createInGroup(fields, groupId);
  }

  // Racy alone; the unique index plus the P2002 mapping is what closes the window.
  private async assertEmailAvailable(email: string): Promise<void> {
    const isTaken = await this.usersRepository.existsByEmail(email);
    if (isTaken) {
      throw new EmailAlreadyTakenError(email);
    }
  }
}
