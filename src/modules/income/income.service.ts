import {
  Injectable,
  NotFoundException,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { Repository } from 'typeorm';
import { CreateIncomeDto } from './dto/create-income.dto';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { EnumIncamIsPaid, EnumIncamTpeTranslation } from 'src/helpers/enum';
import { User } from '../user/entities/user.entity';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createIncomeDto: CreateIncomeDto) {
    const newIncome = this.incomeRepo.create(createIncomeDto);
    newIncome.date = new Date(createIncomeDto.date);
    if (
      createIncomeDto.is_paid === EnumIncamIsPaid.paid &&
      (createIncomeDto.payment_method === EnumIncamTpeTranslation.salary ||
        createIncomeDto.payment_method === EnumIncamTpeTranslation.delivery)
    ) {
      throw new BadGatewayException("unaka income yarata o'lmaysiz");
    }
    if (
      createIncomeDto.is_paid === EnumIncamIsPaid.no_paid &&
      (createIncomeDto.payment_method === EnumIncamTpeTranslation.cash ||
        createIncomeDto.payment_method === EnumIncamTpeTranslation.online ||
        createIncomeDto.payment_method === EnumIncamTpeTranslation.translation)
    ) {
      throw new BadGatewayException("unaka income yarata o'lmaysiz");
    }
    const user = await this.userRepo.findOneBy({ id: createIncomeDto.user_id });
    if (!user) {
      throw new NotFoundException('foydalanuvchi topilmadi');
    }
    newIncome.user = user;

    await this.incomeRepo.save(newIncome);
    return new ApiResponse('Income created', 201);
  }

  async findAll({ page, limit }: FindAllQuery) {
    const totalItems = await this.incomeRepo.count();
    const pagination = new Pagination(totalItems, page, limit);
    const incomes = await this.incomeRepo.find({
      skip: pagination.offset,
      take: pagination.limit,
    });
    return new ApiResponse(incomes, 200, pagination);
  }

  async update(id: number, updateIncomeDto: Partial<CreateIncomeDto>) {
    const income = await this.incomeRepo.findOneBy({ id });

    if (!income) {
      throw new NotFoundException('income mavjud emas');
    }
    if (
      updateIncomeDto.is_paid === EnumIncamIsPaid.paid &&
      (updateIncomeDto.payment_method === EnumIncamTpeTranslation.salary ||
        updateIncomeDto.payment_method === EnumIncamTpeTranslation.delivery)
    ) {
      throw new BadGatewayException("income o'zgartira o'lmaysiz");
    }
    if (
      updateIncomeDto.is_paid === EnumIncamIsPaid.no_paid &&
      (updateIncomeDto.payment_method === EnumIncamTpeTranslation.cash ||
        updateIncomeDto.payment_method === EnumIncamTpeTranslation.online ||
        updateIncomeDto.payment_method === EnumIncamTpeTranslation.translation)
    ) {
      throw new BadGatewayException("income o'zgartira o'lmaysiz");
    }

    const user = await this.userRepo.findOneBy({ id: updateIncomeDto.user_id });
    if (!user) {
      throw new NotFoundException('foydalanuvchi topilmadi');
    }
    income.user = user;

    Object.assign(income, updateIncomeDto);
    await this.incomeRepo.save(income);
    return new ApiResponse('Income yangilandi', 201);
  }

  async remove(id: number) {
    const income = await this.incomeRepo.findOneBy({ id });

    if (!income) {
      throw new NotFoundException('Income mavjud emas');
    }

    await this.incomeRepo.delete(id);
    return new ApiResponse("Income o'chirildi");
  }
}
