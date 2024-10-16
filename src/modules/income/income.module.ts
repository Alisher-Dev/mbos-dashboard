import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { User } from '../user/entities/user.entity';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income, User, Shartnoma])],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
