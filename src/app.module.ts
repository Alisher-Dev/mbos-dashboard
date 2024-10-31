import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/db.config';
import { UserModule } from './modules/user/user.module';
import { ShartnomaModule } from './modules/shartnoma/shartnoma.module';
import { IncomeModule } from './modules/income/income.module';
import { AdminModule } from './modules/admin/admin.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ServiceModule } from './modules/service/service.module';
import { MonthlyFeeModule } from './modules/monthly_fee/monthly_fee.module';
import { BalanceHistoryModule } from './modules/balance_history/balance_history.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    ScheduleModule.forRoot(),
    UserModule,
    ShartnomaModule,
    IncomeModule,
    AdminModule,
    DashboardModule,
    ServiceModule,
    MonthlyFeeModule,
    BalanceHistoryModule,
  ],
})
export class AppModule {}
