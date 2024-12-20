import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMonthlyFeeDto } from './dto/create-monthly_fee.dto';
import { UpdateMonthlyFeeDto } from './dto/update-monthly_fee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { Cron } from '@nestjs/schedule';
import { Brackets, Repository } from 'typeorm';
import { MonthlyFee } from './entities/monthly_fee.entity';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { EnumShartnoma, EnumShartnomaPaid } from 'src/helpers/enum';
import { BalanceHistory } from '../balance_history/entities/balance_history.entity';

@Injectable()
export class MonthlyFeeService {
  constructor(
    @InjectRepository(Shartnoma)
    private readonly shartnomaRepo: Repository<Shartnoma>,

    @InjectRepository(MonthlyFee)
    private readonly monthlyFeeRepo: Repository<MonthlyFee>,

    @InjectRepository(BalanceHistory)
    private readonly balancHistoryRepo: Repository<BalanceHistory>,
  ) {}

  async create(monthlyFeeDto: CreateMonthlyFeeDto, userId: number) {
    const newMonthlyFee = this.monthlyFeeRepo.create(monthlyFeeDto);

    newMonthlyFee.whoCreated = userId.toString();
    newMonthlyFee.date = new Date(monthlyFeeDto.date);

    const shartnoma = await this.shartnomaRepo.findOne({
      where: { id: monthlyFeeDto.shartnoma_id },
    });

    if (!shartnoma) {
      throw new NotFoundException('shartnoma not found');
    }

    if (newMonthlyFee.amount <= newMonthlyFee.paid) {
      newMonthlyFee.purchase_status = EnumShartnomaPaid.paid;
    }

    newMonthlyFee.shartnoma = shartnoma;

    await this.monthlyFeeRepo.save(newMonthlyFee);
    return new ApiResponse('monthlyFee created', 201);
  }

  async findAll({ page, limit, search, isPaid }: FindAllQuery) {
    const query = this.monthlyFeeRepo
      .createQueryBuilder('monthly_fee')
      .where('monthly_fee.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere(
        new Brackets((qb) => {
          qb.where('CAST(commit AS TEXT) LIKE :search', {
            search: `%${search || ''}%`,
          })
            .orWhere('CAST(paid AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(date AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(amount AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            });
        }),
      )
      .take(limit)
      .skip(((page - 1) * limit) | 0);

    if (!!isPaid) {
      query.andWhere('monthly_fee.purchase_status = :isPaid', {
        isPaid: EnumShartnomaPaid[isPaid],
      });
    }

    const [monthlyFee, totalItems] = await query.getManyAndCount();

    const pagination = new Pagination(totalItems, page, limit);
    return new ApiResponse(monthlyFee, 200, pagination);
  }

  @Cron('0 8 * * *') // Запускается каждый день в 8:00
  async updateOrCreateMonthlyFees() {
    const today = new Date();

    if (today.getDate() >= 28) {
      const allShartnoma = await this.shartnomaRepo.find({
        where: { isDeleted: 0, shartnoma_turi: EnumShartnoma.subscription_fee },
        relations: ['monthlyFee', 'service'],
      });

      await Promise.all(
        allShartnoma.map(async (shartnoma) => {
          try {
            // Проверка срока действия shartnoma
            if (
              shartnoma.shartnoma_muddati &&
              !isNaN(new Date(shartnoma.shartnoma_muddati).getTime()) &&
              new Date(shartnoma.shartnoma_muddati) < today
            ) {
              console.log(
                `Срок действия shartnoma с id = ${shartnoma.id} истек.`,
              );
              return;
            }

            // Подготовка следующего месяца
            const nextMonth = new Date(today);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            nextMonth.setDate(1); // Первое число следующего месяца

            const nextMonthKey = nextMonth.toISOString().slice(0, 7);
            const existingMonthlyFee = shartnoma.monthlyFee.find(
              (fee) =>
                new Date(fee.date).toISOString().slice(0, 7) === nextMonthKey,
            );

            if (!existingMonthlyFee) {
              const servicePrice = parseFloat(
                shartnoma.service.price.toString() || '0',
              );
              const count = parseInt(shartnoma.count.toString() || '0', 10);
              const amount = Math.floor(servicePrice * count) || 0;

              const newMonthlyFee = this.monthlyFeeRepo.create({
                date: nextMonth,
                shartnoma: shartnoma,
                amount: amount,
              });

              if (shartnoma.purchase_status !== EnumShartnomaPaid.no_paid) {
                await this.shartnomaRepo.save({
                  ...shartnoma,
                  purchase_status: EnumShartnomaPaid.no_paid,
                });
              }

              await this.monthlyFeeRepo.save(newMonthlyFee);
              console.log(
                `Создан новый monthlyFee для shartnoma с id = ${shartnoma.id}`,
              );
            } else {
              console.log(
                `Запись monthlyFee за следующий месяц уже существует для shartnoma с id = ${shartnoma.id}`,
              );
            }
          } catch (error) {
            console.error(
              `Ошибка при обработке shartnoma с id = ${shartnoma.id}:`,
              error,
            );
          }
        }),
      );
    } else {
      console.log('Запрос не выполняется, так как сегодня меньше 28 числа.');
    }
  }

  async update(
    id: number,
    updateMonthlyFeeDto: UpdateMonthlyFeeDto,
    userId: number,
  ) {
    const monthlyFee = await this.monthlyFeeRepo.findOne({
      where: { id, isDeleted: 0 },
      relations: { shartnoma: { user: true, service: true } },
    });

    if (!monthlyFee) {
      throw new NotFoundException('monthlyFee not found');
    }

    monthlyFee.whoUpdated = userId.toString();

    Object.assign(monthlyFee, updateMonthlyFeeDto);

    if (updateMonthlyFeeDto.paid && updateMonthlyFeeDto.date) {
      const newBalancHistory = {
        amount: updateMonthlyFeeDto.paid,
        date: updateMonthlyFeeDto.date,
        monthly_fee: monthlyFee,
        user: monthlyFee.shartnoma.user,
        purchase_status: EnumShartnomaPaid.no_paid,
        whoCreated: userId.toString(),
        commit: `To’lov ${monthlyFee.shartnoma?.service?.title || `monthlyFee = ${monthlyFee.id}`} uchun ${new Date().toLocaleDateString()} o’zgartirilgandan kegin balansdan yechildi`,
      };

      if (!newBalancHistory) {
        throw new NotFoundException('BalancHistory not found');
      }

      await this.balancHistoryRepo.save(newBalancHistory);
    }
    if (monthlyFee.amount <= monthlyFee.paid) {
      monthlyFee.purchase_status = EnumShartnomaPaid.paid;
    }

    await this.monthlyFeeRepo.save(monthlyFee);
    return new ApiResponse('monthlyFee yangilandi', 201);
  }

  async remove(id: number) {
    const monthlyFee = await this.monthlyFeeRepo.findOneBy({ id });

    if (!monthlyFee) {
      throw new NotFoundException('monthlyFee mavjud emas');
    }

    await this.monthlyFeeRepo.save({ ...monthlyFee, isDeleted: 1 });
    return new ApiResponse("monthlyFee o'chirildi");
  }
}
