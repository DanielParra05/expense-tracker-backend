import { Injectable } from '@nestjs/common';
import { GroupNotFoundError } from './domain/errors';
import { GroupRepository } from './group.repository';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async assertExists(id: string): Promise<void> {
    const doesExist = await this.groupRepository.exists(id);
    if (!doesExist) {
      throw new GroupNotFoundError(id);
    }
  }
}
