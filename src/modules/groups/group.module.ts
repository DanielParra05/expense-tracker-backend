import { Module } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';

@Module({
  providers: [GroupService, GroupRepository],
  exports: [GroupService],
})
export class GroupModule {}
