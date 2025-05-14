import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Income } from '../income/entities/income.entity';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { Service } from '../service/entities/service.entity';
import { MonthlyFee } from '../monthly_fee/entities/monthly_fee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Income, Shartnoma, Service, MonthlyFee]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
