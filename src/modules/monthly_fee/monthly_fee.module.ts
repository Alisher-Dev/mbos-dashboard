import { Module } from '@nestjs/common';
import { MonthlyFeeService } from './monthly_fee.service';
import { MonthlyFeeController } from './monthly_fee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { MonthlyFee } from './entities/monthly_fee.entity';
import { BalanceHistory } from '../balance_history/entities/balance_history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shartnoma, MonthlyFee, BalanceHistory])],
  controllers: [MonthlyFeeController],
  providers: [MonthlyFeeService],
})
export class MonthlyFeeModule {}
