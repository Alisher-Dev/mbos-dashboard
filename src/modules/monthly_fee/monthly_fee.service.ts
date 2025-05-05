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

  @Cron('0 8 * * *') // Каждый день в 8:00
  async updateOrCreateMonthlyFees() {
    const today = new Date('2025-05-29');

    const allShartnoma = await this.shartnomaRepo.find({
      where: {
        isDeleted: 0,
        shartnoma_turi: EnumShartnoma.subscription_fee,
      },
      relations: ['monthlyFee', 'service'],
    });

    await Promise.all(
      allShartnoma.map(async (shartnoma) => {
        try {
          if (shartnoma.enabled === 1) {
            console.log(`Shartnoma с id = ${shartnoma.id} отключён.`);
            return;
          }

          if (!shartnoma.sana) {
            console.log(`Нет даты начала (sana) у shartnoma ${shartnoma.id}`);
            return;
          }

          const startDate = new Date(shartnoma.sana);
          const currentDate = new Date(today);
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(1); // текущий месяц (начало)

          // Месяцы, которые уже есть
          const existingMonths = new Set(
            (shartnoma.monthlyFee || []).map(
              (fee) => `${fee.date.getFullYear()}-${fee.date.getMonth() + 1}`,
            ),
          );

          // Начинаем с первого числа месяца начала
          let current = new Date(startDate);
          current.setDate(1);

          while (
            current.getFullYear() < currentDate.getFullYear() ||
            (current.getFullYear() === currentDate.getFullYear() &&
              current.getMonth() <= currentDate.getMonth())
          ) {
            const key = `${current.getFullYear()}-${current.getMonth() + 1}`;

            if (!existingMonths.has(key)) {
              const newMonthly = this.monthlyFeeRepo.create({
                amount: shartnoma.service?.price || 0,
                ...shartnoma.monthlyFee?.[0],
                id: undefined,
                date: new Date(current),
                shartnoma,
              });

              await this.monthlyFeeRepo.save(newMonthly);
              console.log(
                `✅ Создан monthlyFee за ${current.toISOString().slice(0, 7)} для shartnoma ${shartnoma.id}`,
              );
            } else {
              console.log(
                `⏭️ Уже существует monthlyFee за ${key} для shartnoma ${shartnoma.id}`,
              );
            }

            // Переход к следующему месяцу
            current.setMonth(current.getMonth() + 1);
          }
        } catch (err) {
          console.error(
            `❌ Ошибка при обработке shartnoma ${shartnoma.id}:`,
            err,
          );
        }
      }),
    );
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
