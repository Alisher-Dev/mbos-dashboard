import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Income } from '../income/entities/income.entity';
import { EnumIncamIsPaid, EnumShartnomaPaid } from 'src/helpers/enum';
import { ApiResponse } from 'src/helpers/apiRespons';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { Service } from '../service/entities/service.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,

    @InjectRepository(Shartnoma)
    private readonly shartnomaRepo: Repository<Shartnoma>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async find() {
    const usersCount = await this.userRepo.count({ where: { isDeleted: 0 } });

    const income = await this.incomeRepo
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.is_paid = :isPaid', { isPaid: EnumIncamIsPaid.paid })
      .andWhere('income.isDeleted = :isDeleted', { isDeleted: 0 })
      .getRawOne();

    const expend = await this.incomeRepo
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.is_paid = :isPaid', { isPaid: EnumIncamIsPaid.no_paid })
      .andWhere('income.isDeleted = :isDeleted', { isDeleted: 0 })
      .getRawOne();

    const recentContract = await this.shartnomaRepo.find({
      relations: ['user', 'service'],
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
      .andWhere('tushum.isDeleted = :isDeleted', { isDeleted: 0 })
      .getRawOne();

    const translation = await this.incomeRepo
      .createQueryBuilder('tushum')
      .select('SUM(tushum.amount)', 'total')
      .where('tushum.is_paid = :paid', { paid: EnumIncamIsPaid.paid })
      .andWhere('tushum.payment_method = :method', { method: 'translation' })
      .andWhere('tushum.isDeleted = :isDeleted', { isDeleted: 0 })
      .getRawOne();

    const online = await this.incomeRepo
      .createQueryBuilder('tushum')
      .select('SUM(tushum.amount)', 'total')
      .where('tushum.is_paid = :paid', { paid: EnumIncamIsPaid.paid })
      .andWhere('tushum.payment_method = :method', { method: 'online' })
      .andWhere('tushum.isDeleted = :isDeleted', { isDeleted: 0 })
      .getRawOne();

    const otherTushum = await this.incomeRepo
      .createQueryBuilder('tushum')
      .select('SUM(tushum.amount)', 'total')
      .where('tushum.is_paid = :paid', { paid: EnumIncamIsPaid.paid })
      .andWhere('tushum.payment_method = :method', { method: 'other' })
      .andWhere('tushum.isDeleted = :isDeleted', { isDeleted: 0 })
      .getRawOne();

    const salary = await this.incomeRepo
      .createQueryBuilder('chikim')
      .select('SUM(chikim.amount)', 'total')
      .where('chikim.is_paid = :paid', { paid: EnumIncamIsPaid.no_paid })
      .andWhere('chikim.payment_method = :method', { method: 'salary' })
      .andWhere('chikim.isDeleted = :isDeleted', { isDeleted: 0 })
      .getRawOne();

    const delivery = await this.incomeRepo
      .createQueryBuilder('chikim')
      .select('SUM(chikim.amount)', 'total')
      .where('chikim.is_paid = :paid', { paid: EnumIncamIsPaid.no_paid })
      .andWhere('chikim.payment_method = :method', { method: 'delivery' })
      .andWhere('chikim.isDeleted = :isDeleted', { isDeleted: 0 })
      .getRawOne();

    const otherChikim = await this.incomeRepo
      .createQueryBuilder('chikim')
      .select('SUM(chikim.amount)', 'total')
      .where('chikim.is_paid = :paid', { paid: EnumIncamIsPaid.no_paid })
      .andWhere('chikim.payment_method = :method', { method: 'other' })
      .andWhere('chikim.isDeleted = :isDeleted', { isDeleted: 0 })
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
      .select("DATE_FORMAT(income.date, '%Y-%m') AS date")
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
      .groupBy("DATE_FORMAT(income.date, '%Y-%m')")
      .orderBy("DATE_FORMAT(income.date, '%Y-%m')", 'ASC')
      .andWhere('income.isDeleted = :isDeleted', { isDeleted: 0 })
      .getRawMany();

    return new ApiResponse(stats);
  }

  async findServiceDash(id: number) {
    const servicesTugallangan = await this.serviceRepo
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.shartnoma', 'shartnoma')
      .where('service.id = :id', { id })
      .andWhere('shartnoma.purchase_status = :purchase_status', {
        purchase_status: EnumShartnomaPaid.paid,
      })
      .andWhere('service.isDeleted = :isDeleted', { isDeleted: 0 })
      .getOne();

    const servicesJarayondagi = await this.serviceRepo
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.shartnoma', 'shartnoma')
      .where('service.id = :id', { id })
      .andWhere('shartnoma.purchase_status = :purchase_status', {
        purchase_status: EnumShartnomaPaid.no_paid,
      })
      .andWhere('service.isDeleted = :isDeleted', { isDeleted: 0 })
      .getOne();

    const tugallanganCount = servicesTugallangan?.shartnoma?.reduce(
      (total, shartnoma) => (total += shartnoma?.count),
      0,
    );

    const jarayondagiCount = servicesJarayondagi?.shartnoma?.reduce(
      (total, shartnoma) => (total += shartnoma?.count),
      0,
    );

    const umumiyTushum = servicesTugallangan?.shartnoma
      ?.map((el) => el.count * servicesTugallangan.price)
      ?.reduce((total, amount) => total + amount, 0);

    const umumiyTushumCount = servicesTugallangan?.shartnoma
      ?.map((el) => el.count)
      ?.reduce((total, amount) => total + amount, 0);

    return new ApiResponse({
      tugallangan: servicesTugallangan?.shartnoma,
      tugallanganCount,
      jarayondagi: servicesJarayondagi?.shartnoma,
      jarayondagiCount,
      umumiyTushum,
      umumiyTushumCount,
    });
  }
}
