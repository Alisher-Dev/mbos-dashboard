import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Income } from '../income/entities/income.entity';
import { EnumIncamIsPaid } from 'src/helpers/enum';
import { ApiResponse } from 'src/helpers/apiRespons';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,
  ) {}

  async find() {
    const usersCount = await this.userRepo.count();

    const income = await this.incomeRepo
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.is_paid = :isPaid', { isPaid: EnumIncamIsPaid.paid })
      .getRawOne();

    const expend = await this.incomeRepo
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.is_paid = :isPaid', { isPaid: EnumIncamIsPaid.no_paid })
      .getRawOne();

    const recentContract = await this.incomeRepo.find();

    return new ApiResponse({
      usersCount,
      income: income?.total || 0,
      expend: expend?.total || 0,
      recentContract: recentContract.slice(0, 5),
    });
  }
}
