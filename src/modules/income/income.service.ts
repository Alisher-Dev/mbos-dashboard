import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { Repository } from 'typeorm';
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
    const income = await this.incomeRepo.find();

    console.log(income);

    if (!!income.length) {
      throw new BadRequestException('already have this income');
    }

    const newIncome = this.incomeRepo.create(createIncomeDto);

    await this.incomeRepo.save(newIncome);

    return new ApiResponse('create income', 201);
  }

  async findAll({ page, limit }: FindAllQuery) {
    const totalItems = await this.incomeRepo.count();
    const pagination = new Pagination(totalItems, page, limit);

    const income = await this.incomeRepo.find({
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new ApiResponse(income, 200, pagination);
  }

  async update(id: number, updateIncomeDto: UpdateIncomeDto) {
    const income = await this.incomeRepo.findOneBy({ id });

    if (!income) {
      throw new NotFoundException('income does not exist');
    }

    Object.assign(income, updateIncomeDto);

    await this.incomeRepo.save(income);
    return new ApiResponse(`income updated`, 201);
  }

  async remove(id: number) {
    const income = await this.incomeRepo.findOneBy({ id });
    if (!income) {
      throw new NotFoundException('income does not exist');
    }
    await this.incomeRepo.delete(id);
    return new ApiResponse(`remove income`);
  }
}
