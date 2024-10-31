import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { User } from '../user/entities/user.entity';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { BalanceHistory } from '../balance_history/entities/balance_history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Income, User, Shartnoma, BalanceHistory]),
  ],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
