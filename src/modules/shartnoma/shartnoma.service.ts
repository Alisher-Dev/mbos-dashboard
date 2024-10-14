import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShartnomaDto } from './dto/create-shartnoma.dto';
import { UpdateShartnomaDto } from './dto/update-shartnoma.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shartnoma } from './entities/shartnoma.entity';
import { Like, Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { v4 } from 'uuid';
import { User } from '../user/entities/user.entity';
import { EnumShartnomaPaid } from 'src/helpers/enum';
import { CreateIncomeDto } from '../income/dto/create-income.dto';
import { Income } from '../income/entities/income.entity';

@Injectable()
export class ShartnomaService {
  constructor(
    @InjectRepository(Shartnoma)
    private readonly shartnomeRepo: Repository<Shartnoma>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,
  ) {}

  async create(createShartnomaDto: CreateShartnomaDto) {
    const newShartnoma = this.shartnomeRepo.create(createShartnomaDto);

    const secretId = v4();
    newShartnoma.shartnoma_id = secretId.slice(0, 6);

    const user = await this.userRepo.findOneBy({
      id: +createShartnomaDto.user_id,
    });

    if (!user) {
      throw new NotFoundException('user_id mavjud emas');
    }

    newShartnoma.user = user;

    const { price, advancePayment, count } = createShartnomaDto;
    newShartnoma.remainingPayment = price * count - (advancePayment || 0);
    newShartnoma.purchase_status =
      advancePayment && advancePayment >= price * count
        ? EnumShartnomaPaid.paid
        : EnumShartnomaPaid.no_paid;

    const newIncome = {
      amount: createShartnomaDto.advancePayment || 0,
      payment_method: createShartnomaDto.paymentMethod as unknown,
      is_paid: 'paid',
      date: new Date(),
      user: user,
    };

    const income = await this.incomeRepo.save(newIncome as any);

    newShartnoma.income = [income];

    await this.shartnomeRepo.save(newShartnoma);

    return new ApiResponse('shartnoma yarating', 201);
  }

  async findAll({ page, limit, search }: FindAllQuery) {
    const totalItems = await this.shartnomeRepo.count();
    const pagination = new Pagination(totalItems, page, limit);

    const whereClause = search ? { service: Like(`%${search}%`) } : {};

    const shartnoma = await this.shartnomeRepo.find({
      relations: ['user', 'income'],
      where: whereClause,
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new ApiResponse(shartnoma, 200, pagination);
  }

  async findOne(id: number) {
    const shartnoma = await this.shartnomeRepo.findOne({
      relations: ['user', 'income'],
      where: { id },
    });
    if (!shartnoma) {
      throw new NotFoundException('shartnoma mavjud emas');
    }
    return new ApiResponse(shartnoma, 200);
  }

  async update(id: number, updateShartnomeDto: UpdateShartnomaDto) {
    const shartnoma = await this.shartnomeRepo.findOne({
      where: { id },
      relations: ['income'],
    });

    if (!shartnoma) {
      throw new NotFoundException('shartnoma mavjud emas');
    }

    Object.assign(shartnoma, updateShartnomeDto);

    if (!!updateShartnomeDto.user_id) {
      const user = await this.userRepo.findOneBy({
        id: +updateShartnomeDto.user_id,
      });

      if (!user) {
        throw new NotFoundException('user_id mavjud emas');
      }

      shartnoma.user = user;
    }

    if (updateShartnomeDto.advancePayment) {
      shartnoma.remainingPayment =
        shartnoma.price * shartnoma.count - updateShartnomeDto.advancePayment;

      shartnoma.purchase_status =
        shartnoma.remainingPayment <= 0
          ? EnumShartnomaPaid.paid
          : EnumShartnomaPaid.no_paid;
    }

    if (updateShartnomeDto.advancePayment && updateShartnomeDto.paymentMethod) {
      const newIncome = {
        amount: updateShartnomeDto.advancePayment || 0,
        payment_method: updateShartnomeDto.paymentMethod as unknown,
        is_paid: 'paid',
        date: new Date(),
      };

      const income = await this.incomeRepo.save(newIncome as CreateIncomeDto);

      shartnoma.income = [...shartnoma.income, income];
    }

    await this.shartnomeRepo.save(shartnoma);
    return new ApiResponse(`shartnoma o'gartirildi`, 201);
  }

  async remove(id: number) {
    const shartnoma = await this.shartnomeRepo.findOneBy({ id });
    if (!shartnoma) {
      throw new NotFoundException('shartnoma mavjud emas');
    }
    await this.shartnomeRepo.delete(id);
    return new ApiResponse(`shartnoma o'chirildi`);
  }
}
