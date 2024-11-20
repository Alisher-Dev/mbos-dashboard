import {
  Injectable,
  NotFoundException,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { Brackets, Like, Repository } from 'typeorm';
import { CreateIncomeDto } from './dto/create-income.dto';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import {
  EnumIncamIsPaid,
  EnumIncamTpeTranslation,
  EnumShartnomaPaid,
} from 'src/helpers/enum';
import { User } from '../user/entities/user.entity';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { BalanceHistory } from '../balance_history/entities/balance_history.entity';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(BalanceHistory)
    private readonly balanceHistoryRepo: Repository<BalanceHistory>,

    @InjectRepository(Shartnoma)
    private readonly shartnomaRepo: Repository<Shartnoma>,
  ) {}

  async create(createIncomeDto: CreateIncomeDto, userId: number) {
    const newIncome = this.incomeRepo.create(createIncomeDto);
    newIncome.whoCreated = userId.toString();
    newIncome.date = new Date(createIncomeDto.date);

    if (
      createIncomeDto.is_paid === EnumIncamIsPaid.paid &&
      (createIncomeDto.payment_method === EnumIncamTpeTranslation.salary ||
        createIncomeDto.payment_method === EnumIncamTpeTranslation.delivery)
    ) {
      throw new BadGatewayException("unaka income yarata o'lmaysiz");
    } else if (
      createIncomeDto.is_paid === EnumIncamIsPaid.no_paid &&
      (createIncomeDto.payment_method === EnumIncamTpeTranslation.cash ||
        createIncomeDto.payment_method === EnumIncamTpeTranslation.online ||
        createIncomeDto.payment_method === EnumIncamTpeTranslation.translation)
    ) {
      throw new BadGatewayException("unaka income yarata o'lmaysiz");
    } else {
      createIncomeDto.is_paid = EnumIncamIsPaid.confirm_payment;
    }

    const user = await this.userRepo.findOneBy({
      id: createIncomeDto.user_id,
    });
    if (!!createIncomeDto.user_id) {
      if (!user) {
        throw new NotFoundException('foydalanuvchi topilmadi');
      }
      newIncome.user = user;
    }

    if (!!createIncomeDto.shartnoma_id) {
      const shartnoma = await this.shartnomaRepo.findOneBy({
        id: createIncomeDto.shartnoma_id,
      });
      if (!shartnoma) {
        throw new NotFoundException('shartnoma topilmadi');
      }
      newIncome.shartnoma = shartnoma;
    }

    if (
      !!newIncome.amount &&
      newIncome.is_paid === EnumIncamIsPaid.paid &&
      user
    ) {
      user.balance = (+user.balance + +newIncome.amount).toString();
      await this.userRepo.save(user);

      const newBalancHistory = {
        amount: newIncome.amount,
        date: newIncome.date,
        user: user,
        purchase_status: EnumShartnomaPaid.paid,
        commit: `To’lov ${newIncome.shartnoma?.service?.title || 'daromat'} uchun ${new Date().toLocaleDateString()} yaratildi kegin balansga koshildi`,
      };

      await this.balanceHistoryRepo.save(newBalancHistory);
    }

    await this.incomeRepo.save(newIncome);
    return new ApiResponse('Income created', 201);
  }

  async findAll({ page, limit, search, isPaid, filter }: FindAllQuery) {
    const query = this.incomeRepo
      .createQueryBuilder('income')
      .where('income.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere(
        new Brackets((qb) => {
          qb.where('CAST(is_paid AS CHAR) LIKE :search', {
            search: `%${search || ''}%`,
          })
            .orWhere('CAST(payment_method AS CHAR) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(date AS CHAR) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(amount AS CHAR) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(description AS CHAR) LIKE :search', {
              search: `%${search || ''}%`,
            });
        }),
      )
      .leftJoinAndSelect('income.user', 'user')
      .orderBy('income.date', filter || 'ASC')
      .take(limit)
      .skip(((page - 1) * limit) | 0);

    if (!!isPaid) {
      query.andWhere('income.is_paid = :isPaid', {
        isPaid: EnumIncamIsPaid[isPaid],
      });
    }

    const [incomes, totalItems] = await query.getManyAndCount();
    const pagination = new Pagination(totalItems, page, limit);
    return new ApiResponse(incomes, 200, pagination);
  }

  async update(
    id: number,
    updateIncomeDto: Partial<CreateIncomeDto>,
    userId: number,
  ) {
    const income = await this.incomeRepo.findOneBy({ id });

    income.whoUpdated = userId.toString();
    if (!income) {
      throw new NotFoundException('income mavjud emas');
    }
    if (
      updateIncomeDto.is_paid === EnumIncamIsPaid.paid &&
      (updateIncomeDto.payment_method === EnumIncamTpeTranslation.salary ||
        updateIncomeDto.payment_method === EnumIncamTpeTranslation.delivery)
    ) {
      throw new BadGatewayException("income o'zgartira o'lmaysiz");
    } else if (
      updateIncomeDto.is_paid === EnumIncamIsPaid.no_paid &&
      (updateIncomeDto.payment_method === EnumIncamTpeTranslation.cash ||
        updateIncomeDto.payment_method === EnumIncamTpeTranslation.online ||
        updateIncomeDto.payment_method === EnumIncamTpeTranslation.translation)
    ) {
      throw new BadGatewayException("income o'zgartira o'lmaysiz");
    } else {
      updateIncomeDto.is_paid === EnumIncamIsPaid.confirm_payment;
    }

    if (!!updateIncomeDto.user_id) {
      const user = await this.userRepo.findOneBy({
        id: updateIncomeDto.user_id,
      });
      if (!user) {
        throw new NotFoundException('foydalanuvchi topilmadi');
      }
      income.user = user;
    }
    if (!!updateIncomeDto.shartnoma_id) {
      const shartnoma = await this.shartnomaRepo.findOneBy({
        id: updateIncomeDto.shartnoma_id,
      });
      if (!shartnoma) {
        throw new NotFoundException('shartnoma topilmadi');
      }
      income.shartnoma = shartnoma;
    }

    Object.assign(income, updateIncomeDto);
    await this.incomeRepo.save(income);
    return new ApiResponse('Income yangilandi', 201);
  }

  async remove(id: number) {
    const income = await this.incomeRepo.findOneBy({ id });

    if (!income) {
      throw new NotFoundException('Income mavjud emas');
    }

    await this.incomeRepo.save({ ...income, isDeleted: 1 });
    return new ApiResponse("Income o'chirildi");
  }
}
