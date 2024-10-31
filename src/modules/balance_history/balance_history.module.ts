import { Module } from '@nestjs/common';
import { BalanceHistoryService } from './balance_history.service';
import { BalanceHistoryController } from './balance_history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceHistory } from './entities/balance_history.entity';
import { MonthlyFee } from '../monthly_fee/entities/monthly_fee.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BalanceHistory, MonthlyFee, User])],
  controllers: [BalanceHistoryController],
  providers: [BalanceHistoryService],
})
export class BalanceHistoryModule {}
