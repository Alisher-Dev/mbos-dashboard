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

    const [income, incomeCount] = await this.incomeRepo.findAndCount({
      where: { is_paid: EnumIncamIsPaid.paid },
    });

    const [expend, expendCount] = await this.incomeRepo.findAndCount({
      where: { is_paid: EnumIncamIsPaid.no_paid },
    });

    return new ApiResponse({ usersCount, incomeCount, expendCount });
  }
}
