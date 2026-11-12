import { Module } from '@nestjs/common';
import { IncomesController } from './incomes.controller';
import { IncomesRepository } from './incomes.repository';
import { IncomesService } from './incomes.service';

@Module({
  controllers: [IncomesController],
  providers: [IncomesService, IncomesRepository],
})
export class IncomesModule {}
