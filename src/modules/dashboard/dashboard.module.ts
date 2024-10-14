import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Income } from '../income/entities/income.entity';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Income, Shartnoma])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
