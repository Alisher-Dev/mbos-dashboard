import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Like, Raw, Repository } from 'typeorm';
import { Income } from '../income/entities/income.entity';
import { EnumIncamIsPaid, EnumShartnomaPaid } from 'src/helpers/enum';
import { ApiResponse } from 'src/helpers/apiRespons';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { Service } from '../service/entities/service.entity';
import { MonthlyFee } from '../monthly_fee/entities/monthly_fee.entity';
import { IYears } from './dto/query.dto';

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

    @InjectRepository(MonthlyFee)
    private readonly monthRepo: Repository<MonthlyFee>,
  ) {}

  async find({ year = new Date().getFullYear().toString() }: IYears) {
    const today = new Date();

    const usersCount = await this.userRepo.count({
      where: {
        isDeleted: 0,
        created_at: Raw((alias) => `EXTRACT(YEAR FROM ${alias}) = :year`, {
          year,
        }),
      },
    });

    const income = await this.incomeRepo
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.is_paid = :isPaid', { isPaid: EnumIncamIsPaid.paid })
      .andWhere('EXTRACT(YEAR FROM income.date) = :year', { year })
      .andWhere('income.isDeleted = :isDeleted', { isDeleted: 0 })
      .getRawOne();

    const confirm = await this.incomeRepo
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.is_paid = :isPaid', {
        isPaid: EnumIncamIsPaid.no_paid,
      })
      .andWhere('EXTRACT(YEAR FROM income.date) = :year', { year })
      .andWhere('income.isDeleted = :isDeleted', { isDeleted: 0 })
      .getRawOne();

    const month = await this.monthRepo.find({
      where: {
        isDeleted: 0,
        purchase_status: EnumShartnomaPaid.no_paid,
        date: Raw((alias) => `EXTRACT(YEAR FROM ${alias}) = :year`, { year }),
      },
    });

    const activeMonth = await this.incomeRepo
      .createQueryBuilder('income')
      .select(
        `
    SUM(CASE WHEN income.is_paid = :paid THEN income.amount ELSE 0 END) AS income,
    SUM(CASE WHEN income.is_paid = :noPaid THEN income.amount ELSE 0 END) AS confirm
  `,
      )
      .where('income.isDeleted = :delete', { delete: 0 })
      .andWhere('EXTRACT(YEAR FROM income.date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM income.date) = :month', {
        month: today.getMonth() + 1,
      })
      .setParameters({
        paid: EnumIncamIsPaid.paid,
        noPaid: EnumIncamIsPaid.no_paid,
      })
      .getRawOne();

    const duty = month.reduce((acc, el) => (acc += +el.amount - +el.paid), 0);

    const recentContract = await this.shartnomaRepo.find({
      relations: ['user'],
      where: {
        user: { isDeleted: 0 },
        service: { isDeleted: 0 },
        isDeleted: 0,
        enabled: 0,
        sana: Raw((alias) => `EXTRACT(YEAR FROM ${alias}) = :year`, {
          year,
        }),
      },
    });

    return new ApiResponse({
      usersCount,
      income: income?.total || 0,
      confirm: confirm?.total || 0,
      duty,
      contractCount: recentContract.length,
      activeMonth,
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

    const confirm = await this.incomeRepo
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.is_paid = :isPaid', {
        isPaid: EnumIncamIsPaid.confirm_payment,
      })
      .andWhere('income.isDeleted = :isDeleted', { isDeleted: 0 })
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
      confirm,
    });
  }

  async findStatstik({ year = new Date().getFullYear().toString() }: IYears) {
    // Генерируем список всех месяцев (с 1 по 12)
    const allMonths = Array.from(
      { length: 12 },
      (_, i) => `${year}-${(i + 1).toString().padStart(2, '0')}`,
    );

    // Собираем данные по каждому месяцу
    const result = await Promise.all(
      allMonths.map(async (key) => {
        const [y, m] = key.split('-');
        const yearNum = +y;
        const monthNum = +m;

        // Получаем данные по доходам и расходам для месяца
        const incomeData = await this.incomeRepo
          .createQueryBuilder('income')
          .select([
            `SUM(CASE WHEN income.is_paid = :paid THEN income.amount ELSE 0 END) as tushum`,
            `SUM(CASE WHEN income.is_paid = :no_paid THEN income.amount ELSE 0 END) as chikim`,
          ])
          .where('income.isDeleted = :isDeleted', { isDeleted: 0 })
          .andWhere('EXTRACT(YEAR FROM income.date) = :year', { year: yearNum })
          .andWhere('EXTRACT(MONTH FROM income.date) = :month', {
            month: monthNum,
          })
          .setParameters({
            paid: EnumIncamIsPaid.paid,
            no_paid: EnumIncamIsPaid.no_paid,
          })
          .getRawOne();

        const tushum = +incomeData?.tushum || 0;
        const chikim = +incomeData?.chikim || 0;

        // Рассчитываем долг для месяца (если есть связанные данные)
        const relatedMonths = await this.monthRepo.find({
          where: {
            isDeleted: 0,
            date: Raw(
              (alias) =>
                `EXTRACT(YEAR FROM ${alias}) = :year AND EXTRACT(MONTH FROM ${alias}) = :month`,
              { year: yearNum, month: monthNum },
            ),
          },
        });

        const duty = relatedMonths.reduce(
          (acc, el) => acc + (+el.amount - +el.paid),
          0,
        );

        return {
          date: key,
          tushum,
          chikim,
          duty,
        };
      }),
    );

    return new ApiResponse(result);
  }

  async findYearlyForecast() {
    // Находим все уникальные года
    const years = (
      await this.incomeRepo.find({ where: { isDeleted: 0 } })
    ).reduce((acc, el) => {
      const year = new Date(el.date).getFullYear();
      if (!acc.includes(year)) {
        acc.push(year);
      }
      return acc;
    }, []);

    // Получаем данные для каждого года
    return await Promise.all(
      years.map(async (year) => {
        const incomeData = await this.incomeRepo
          .createQueryBuilder('income')
          .select([
            `SUM(CASE WHEN income.is_paid = :paid THEN income.amount ELSE 0 END) as tushum`,
            `SUM(CASE WHEN income.is_paid = :no_paid THEN income.amount ELSE 0 END) as chikim`,
          ])
          .setParameters({
            paid: EnumIncamIsPaid.paid,
            no_paid: EnumIncamIsPaid.no_paid,
          })
          .where('income.isDeleted = :isDeleted', { isDeleted: 0 })
          .andWhere('EXTRACT(YEAR FROM income.date) = :year', { year })
          .getRawOne();

        // Возвращаем только year, tushum и chikim
        return {
          year,
          tushum: incomeData?.tushum || 0,
          chikim: incomeData?.chikim || 0,
        };
      }),
    );
  }

  async findStatistikOnlyIncome({
    year = new Date().getFullYear().toString(),
  }: IYears) {
    const data = await this.monthRepo
      .createQueryBuilder('month')
      .select([
        `TO_CHAR(month.date, 'MM') AS month`,
        `SUM(month.amount) AS amount`,
      ])
      .where('month.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere(`EXTRACT(YEAR FROM month.date) = :year`, { year: +year })
      .groupBy(`TO_CHAR(month.date, 'MM')`)
      .orderBy(`month`, 'ASC')
      .getRawMany();

    const result = data.map((item) => ({
      date: item.month,
      duty: +item.amount,
    }));

    return new ApiResponse(result);
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
