import { Module } from '@nestjs/common';
import { MonthlyFeeService } from './monthly_fee.service';
import { MonthlyFeeController } from './monthly_fee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { MonthlyFee } from './entities/monthly_fee.entity';
import { Income } from '../income/entities/income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shartnoma, MonthlyFee, Income])],
  controllers: [MonthlyFeeController],
  providers: [MonthlyFeeService],
})
export class MonthlyFeeModule {}
