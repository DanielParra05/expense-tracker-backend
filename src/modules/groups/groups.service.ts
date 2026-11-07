import { Injectable } from '@nestjs/common';
import { GroupNotFoundError } from './domain/errors';
import { GroupsRepository } from './groups.repository';

@Injectable()
export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async assertExists(id: string): Promise<void> {
    const doesExist = await this.groupsRepository.exists(id);
    if (!doesExist) {
      throw new GroupNotFoundError(id);
    }
  }
}
