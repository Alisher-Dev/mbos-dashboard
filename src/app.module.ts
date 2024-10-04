import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/db.config';
import { ShartnomaModule } from './modules/shartnoma/shartnoma.module';
import { IncomeModule } from './modules/income/income.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), UserModule, ShartnomaModule, IncomeModule, AdminModule],
})
export class AppModule {}
