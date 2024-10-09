import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { Repository } from 'typeorm';
import { CreateIncomeDto } from './dto/create-income.dto';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,
  ) {}

  async create(createIncomeDto: CreateIncomeDto) {
    const newIncome = this.incomeRepo.create(createIncomeDto);
    newIncome.date = new Date();
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
      throw new NotFoundException('Income does not exist');
    }

    Object.assign(income, updateIncomeDto);
    await this.incomeRepo.save(income);
    return new ApiResponse('Income updated', 201);
  }

  async remove(id: number) {
    const income = await this.incomeRepo.findOneBy({ id });

    if (!income) {
      throw new NotFoundException('Income does not exist');
    }

    await this.incomeRepo.delete(id);
    return new ApiResponse('Income removed');
  }
}
