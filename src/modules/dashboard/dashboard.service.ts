import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Income } from '../income/entities/income.entity';
import { EnumIncamIsPaid } from 'src/helpers/enum';
import { ApiResponse } from 'src/helpers/apiRespons';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,

    @InjectRepository(Shartnoma)
    private readonly shartnomaRepo: Repository<Shartnoma>,
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

    const recentContract = await this.shartnomaRepo.find({
      relations: ['user'],
    });

    return new ApiResponse({
      usersCount,
      income: income?.total || 0,
      expend: expend?.total || 0,
      recentContract: recentContract.slice(0, 5),
    });
  }

  async findIncome() {
    const cash = await this.incomeRepo
      .createQueryBuilder('tushum')
      .select('SUM(tushum.amount)', 'total')
      .where('tushum.is_paid = :paid', { paid: EnumIncamIsPaid.paid })
      .andWhere('tushum.payment_method = :method', { method: 'cash' })
      .getRawOne();

    const translation = await this.incomeRepo
      .createQueryBuilder('tushum')
      .select('SUM(tushum.amount)', 'total')
      .where('tushum.is_paid = :paid', { paid: EnumIncamIsPaid.paid })
      .andWhere('tushum.payment_method = :method', { method: 'translation' })
      .getRawOne();

    const online = await this.incomeRepo
      .createQueryBuilder('tushum')
      .select('SUM(tushum.amount)', 'total')
      .where('tushum.is_paid = :paid', { paid: EnumIncamIsPaid.paid })
      .andWhere('tushum.payment_method = :method', { method: 'online' })
      .getRawOne();

    const otherTushum = await this.incomeRepo
      .createQueryBuilder('tushum')
      .select('SUM(tushum.amount)', 'total')
      .where('tushum.is_paid = :paid', { paid: EnumIncamIsPaid.paid })
      .andWhere('tushum.payment_method = :method', { method: 'other' })
      .getRawOne();

    const salary = await this.incomeRepo
      .createQueryBuilder('chikim')
      .select('SUM(chikim.amount)', 'total')
      .where('chikim.is_paid = :paid', { paid: EnumIncamIsPaid.no_paid })
      .andWhere('chikim.payment_method = :method', { method: 'salary' })
      .getRawOne();

    const delivery = await this.incomeRepo
      .createQueryBuilder('chikim')
      .select('SUM(chikim.amount)', 'total')
      .where('chikim.is_paid = :paid', { paid: EnumIncamIsPaid.no_paid })
      .andWhere('chikim.payment_method = :method', { method: 'delivery' })
      .getRawOne();

    const otherChikim = await this.incomeRepo
      .createQueryBuilder('chikim')
      .select('SUM(chikim.amount)', 'total')
      .where('chikim.is_paid = :paid', { paid: EnumIncamIsPaid.no_paid })
      .andWhere('chikim.payment_method = :method', { method: 'other' })
      .getRawOne();

    return new ApiResponse({
      tushum: {
        cash: cash.total || 0,
        translation: translation.total || 0,
        online: online.total || 0,
        other: otherTushum.total || 0,
      },
      chikim: {
        salary: salary.total || 0,
        delivery: delivery.total || 0,
        other: otherChikim.total || 0,
      },
    });
  }

  async findStatstik() {
    const stats = await this.incomeRepo
      .createQueryBuilder('income')
      .select("DATE_FORMAT(income.date, '%Y-%m') AS date") // Format date as YYYY-MM
      .addSelect(
        'SUM(CASE WHEN income.is_paid = :paid THEN income.amount ELSE 0 END)',
        'tushum',
      )
      .addSelect(
        'SUM(CASE WHEN income.is_paid = :no_paid THEN income.amount ELSE 0 END)',
        'chikim',
      )
      .setParameters({
        paid: EnumIncamIsPaid.paid,
        no_paid: EnumIncamIsPaid.no_paid,
      })
      .groupBy("DATE_FORMAT(income.date, '%Y-%m')") // Group by formatted date
      .orderBy("DATE_FORMAT(income.date, '%Y-%m')", 'ASC') // Optional: Order by date
      .getRawMany(); // Use getRawMany to get raw results

    return new ApiResponse(stats);
  }
}
