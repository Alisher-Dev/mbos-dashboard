import { Module } from '@nestjs/common';
import { ShartnomaService } from './shartnoma.service';
import { ShartnomaController } from './shartnoma.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shartnoma } from './entities/shartnoma.entity';
import { User } from '../user/entities/user.entity';
import { Income } from '../income/entities/income.entity';
import { Service } from '../service/entities/service.entity';
import { MonthlyFee } from '../monthly_fee/entities/monthly_fee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shartnoma, User, Income, Service, MonthlyFee]),
  ],
  controllers: [ShartnomaController],
  providers: [ShartnomaService],
})
export class ShartnomaModule {}
