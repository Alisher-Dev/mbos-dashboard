import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMonthlyFeeDto } from './dto/create-monthly_fee.dto';
import { UpdateMonthlyFeeDto } from './dto/update-monthly_fee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { MonthlyFee } from './entities/monthly_fee.entity';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import {
  EnumIncamIsPaid,
  EnumIncamTpeTranslation,
  EnumShartnoma,
} from 'src/helpers/enum';
import { Income } from '../income/entities/income.entity';
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

    newMonthlyFee.shartnoma = shartnoma;

    await this.monthlyFeeRepo.save(newMonthlyFee);
    return new ApiResponse('monthlyFee created', 201);
  }

  async findAll({ page, limit }: FindAllQuery) {
    const totalItems = await this.monthlyFeeRepo.count({
      where: {
        isDeleted: 0,
      },
    });
    const pagination = new Pagination(totalItems, page, limit);

    const monthlyFee = await this.monthlyFeeRepo.find({
      where: {
        isDeleted: 0,
      },
      skip: pagination.offset,
      take: pagination.limit,
    });
    return new ApiResponse(monthlyFee, 200, pagination);
  }

  @Cron('0 8 * * *') // Запускается каждый день в 8:00
  async updateOrCreateMonthlyFees() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    if (today.getDate() >= 28) {
      // Получаем все shartnoma
      const allShartnoma = await this.shartnomaRepo.find({
        where: { isDeleted: 0, shartnoma_turi: EnumShartnoma.subscription_fee },
        relations: ['monthlyFee', 'service'],
      });

      for (const shartnoma of allShartnoma) {
        // Проверяем, истек ли срок действия shartnoma
        if (
          shartnoma.shartnoma_muddati &&
          new Date(shartnoma.shartnoma_muddati) < today
        ) {
          console.log(`Срок действия shartnoma с id = ${shartnoma.id} истек.`);
          continue; // Пропускаем текущую shartnoma
        }

        // Проверяем, создан ли monthlyFee для следующего месяца
        const nextMonth = new Date(currentYear, currentMonth + 1, 1);
        const existingMonthlyFee = shartnoma.monthlyFee.find(
          (fee) =>
            new Date(fee.date).getMonth() === nextMonth.getMonth() &&
            new Date(fee.date).getFullYear() === nextMonth.getFullYear(),
        );

        if (!existingMonthlyFee) {
          // Если записи нет, создаём новую для следующего месяца
          const newMonthlyFee = this.monthlyFeeRepo.create({
            date: nextMonth, // Устанавливаем дату первого числа следующего месяца
            shartnoma: shartnoma,
            amount:
              Math.floor(+shartnoma.service.price * +shartnoma.count) || 0,
          });

          await this.monthlyFeeRepo.save(newMonthlyFee);
          console.log(
            `Создан новый monthlyFee для shartnoma с id = ${shartnoma.id}`,
          );
        } else {
          console.log(
            `Запись monthlyFee за следующий месяц уже существует для shartnoma с id = ${shartnoma.id}`,
          );
        }
      }
    } else {
      console.log('Запрос не выполняется, так как сегодня меньше 28 числа.');
    }
  }

  async update(
    id: number,
    updateMonthlyFeeDto: Partial<UpdateMonthlyFeeDto>,
    userId: number,
  ) {
    const monthlyFee = await this.monthlyFeeRepo.findOne({
      where: { id, isDeleted: 0 },
      relations: { shartnoma: { user: true } },
    });

    if (!monthlyFee) {
      throw new NotFoundException('monthlyFee not found');
    }

    monthlyFee.whoUpdated = userId.toString();

    Object.assign(monthlyFee, updateMonthlyFeeDto);

    if (updateMonthlyFeeDto.paid || updateMonthlyFeeDto.amount) {
      const newBalancHistory = {
        amount: updateMonthlyFeeDto.paid,
        date: updateMonthlyFeeDto.date,
        monthly_fee: monthlyFee,
        user: monthlyFee.shartnoma.user,
      };

      if (!newBalancHistory) {
        throw new NotFoundException('BalancHistory not found');
      }

      await this.balancHistoryRepo.save(newBalancHistory);
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
