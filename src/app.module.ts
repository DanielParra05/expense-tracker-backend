import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { IncomesModule } from './modules/incomes/incomes.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ExpensesModule,
    IncomesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
