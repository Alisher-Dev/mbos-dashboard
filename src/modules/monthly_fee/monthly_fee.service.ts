import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMonthlyFeeDto } from './dto/create-monthly_fee.dto';
import { UpdateMonthlyFeeDto } from './dto/update-monthly_fee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { MonthlyFee } from './entities/monthly_fee.entity';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { EnumShartnoma } from 'src/helpers/enum';

@Injectable()
export class MonthlyFeeService {
  constructor(
    @InjectRepository(Shartnoma)
    private readonly shartnomaRepo: Repository<Shartnoma>,

    @InjectRepository(MonthlyFee)
    private readonly monthlyFeeRepo: Repository<MonthlyFee>,
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

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async updateOrCreateMonthlyFees() {
    const allShartnoma = await this.shartnomaRepo.find({
      where: { isDeleted: 0, shartnoma_turi: EnumShartnoma.one_bay },
      relations: ['monthlyFee'],
    });

    for (const shartnoma of allShartnoma) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const existingMonthlyFee = shartnoma.monthlyFee.find(
        (fee) =>
          new Date(fee.date).getMonth() === currentMonth &&
          new Date(fee.date).getFullYear() === currentYear,
      );

      if (!existingMonthlyFee) {
        const newMonthlyFee = this.monthlyFeeRepo.create({
          date: new Date(),
          shartnoma: shartnoma,
          amount: shartnoma.remainingPayment * shartnoma.count || 0,
        });

        await this.monthlyFeeRepo.save(newMonthlyFee);
        console.log(
          `Создан новый monthlyFee для shartnoma с id = ${shartnoma.id}`,
        );
      } else {
        console.log(
          `Запись monthlyFee за текущий месяц уже существует для shartnoma с id = ${shartnoma.id}`,
        );
      }
    }
  }

  async update(
    id: number,
    updateMonthlyFeeDto: Partial<UpdateMonthlyFeeDto>,
    userId: number,
  ) {
    const monthlyFee = await this.monthlyFeeRepo.findOne({
      where: { id, isDeleted: 0 },
    });

    if (!monthlyFee) {
      throw new NotFoundException('monthlyFee not found');
    }

    monthlyFee.whoUpdated = userId.toString();

    Object.assign(monthlyFee, updateMonthlyFeeDto);

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
