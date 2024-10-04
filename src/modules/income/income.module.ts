import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income])],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
