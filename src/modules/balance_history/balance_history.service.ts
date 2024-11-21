import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBalanceHistoryDto } from './dto/create-balance_history.dto';
import { UpdateBalanceHistoryDto } from './dto/update-balance_history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceHistory } from './entities/balance_history.entity';
import { Brackets, Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { User } from '../user/entities/user.entity';
import { MonthlyFee } from '../monthly_fee/entities/monthly_fee.entity';
import { skip } from 'node:test';

@Injectable()
export class BalanceHistoryService {
  constructor(
    @InjectRepository(BalanceHistory)
    private readonly balance_historyRepo: Repository<BalanceHistory>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(MonthlyFee)
    private readonly monthlyFeeRepo: Repository<MonthlyFee>,
  ) {}

  async create(balance_history: CreateBalanceHistoryDto, userId: number) {
    const newBalanceHistoryRepo =
      this.balance_historyRepo.create(balance_history);

    newBalanceHistoryRepo.user = await this.userRepo.findOne({
      where: { id: balance_history.user_id },
    });

    newBalanceHistoryRepo.monthly_fee = await this.monthlyFeeRepo.findOne({
      where: { id: balance_history.monthly_fee_id },
    });

    newBalanceHistoryRepo.whoCreated = userId.toString();
    await this.balance_historyRepo.save(newBalanceHistoryRepo);

    return new ApiResponse('balance_historyRepo yaratildi', 201);
  }

  async findAll({ page, limit, search }: FindAllQuery) {
    const [balance_history, totalItems] = await this.balance_historyRepo
      .createQueryBuilder('balance_history')
      .where('balance_history.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere(
        new Brackets((qb) => {
          qb.where('CAST(date AS TEXT) LiKE :search', {
            search: `%${search || ''}%`,
          })
            .orWhere('CAST(amount AS TEXT) LiKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(purchase_status AS TEXT) LiKE :search', {
              search: `%${search || ''}%`,
            });
        }),
      )
      .take(limit)
      .skip(((page - 1) * limit) | 0)
      .getManyAndCount();

    const pagination = new Pagination(totalItems, page, limit);
    return new ApiResponse(balance_history, 200, pagination);
  }

  async findOne(id: number) {
    const balance_history = await this.balance_historyRepo
      .createQueryBuilder('balance_history')
      .where('balance_history.id = :id', { id })
      .andWhere('balance_history.isDeleted = :isDeleted', { isDeleted: 0 })
      .leftJoinAndSelect(
        'balance_history.user',
        'user',
        'user.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .leftJoinAndSelect(
        'balance_history.monthly_fee',
        'monthly_fee',
        'monthly_fee.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .getOne();

    if (!balance_history) {
      throw new NotFoundException('balance_history mavjud emas');
    }

    return new ApiResponse(balance_history, 200);
  }

  async update(
    id: number,
    updateBalanceHistoryDto: UpdateBalanceHistoryDto,
    userId: number,
  ) {
    const balance_history = await this.balance_historyRepo.findOne({
      where: { id, isDeleted: 0 },
    });

    if (!balance_history && balance_history.isDeleted) {
      throw new NotFoundException('balance_history mavjud emas');
    }

    Object.assign(balance_history, updateBalanceHistoryDto);

    balance_history.whoUpdated = userId.toString();

    if (!!updateBalanceHistoryDto.user_id) {
      balance_history.user = await this.userRepo.findOne({
        where: { id: updateBalanceHistoryDto.user_id },
      });
    }
    if (!!updateBalanceHistoryDto.monthly_fee_id) {
      balance_history.monthly_fee = await this.monthlyFeeRepo.findOne({
        where: { id: updateBalanceHistoryDto.monthly_fee_id },
      });
    }

    await this.balance_historyRepo.save(balance_history);
    return new ApiResponse(`balance_history o'gartirildi`, 201);
  }

  async remove(id: number) {
    const balance_history = await this.balance_historyRepo.findOneBy({ id });
    if (!balance_history) {
      throw new NotFoundException('balance_history mavjud emas');
    }
    await this.balance_historyRepo.save({ ...balance_history, isDeleted: 1 });
    return new ApiResponse(`balance_history o'chirildi`);
  }
}
