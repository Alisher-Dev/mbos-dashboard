import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShartnomaDto } from './dto/create-shartnoma.dto';
import { UpdateShartnomaDto } from './dto/update-shartnoma.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shartnoma } from './entities/shartnoma.entity';
import { Like, Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { User } from '../user/entities/user.entity';
import { EnumShartnomaPaid } from 'src/helpers/enum';
import { Income } from '../income/entities/income.entity';
import { Service } from '../service/entities/service.entity';

@Injectable()
export class ShartnomaService {
  constructor(
    @InjectRepository(Shartnoma)
    private readonly shartnomeRepo: Repository<Shartnoma>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async create(createShartnomaDto: CreateShartnomaDto) {
    const newShartnoma = this.shartnomeRepo.create(createShartnomaDto);

    const user = await this.userRepo.findOneBy({
      id: +createShartnomaDto.user_id,
    });
    if (!user) {
      throw new NotFoundException('user_id mavjud emas');
    }
    newShartnoma.user = user;

    const shartnomaOld = await this.shartnomeRepo.find({
      order: { id: 'DESC' },
    });
    if (
      new Date(shartnomaOld[0]?.sana).getFullYear() !== new Date().getFullYear()
    ) {
      newShartnoma.shartnoma_id = 1;
    } else {
      newShartnoma.shartnoma_id = shartnomaOld[0].shartnoma_id + 1;
    }

    newShartnoma.shartnoma_nomer = `${new Date(newShartnoma?.sana).getFullYear()}/${user.id}/${shartnomaOld[0]?.shartnoma_id}`;

    const service = await this.serviceRepo.findOneBy({
      id: +createShartnomaDto.service_id,
    });
    if (!service) {
      throw new NotFoundException('service_id mavjud emas');
    }
    newShartnoma.service = service;

    const { advancePayment, count } = createShartnomaDto;
    newShartnoma.remainingPayment =
      service.price * count - (advancePayment || 0);
    newShartnoma.purchase_status =
      advancePayment && advancePayment >= service.price * count
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

    const shartnoma = await this.shartnomeRepo.find({
      relations: ['user', 'income', 'service'],
      where: {
        isDeleted: 0,
        ...(search && { user: { F_I_O: Like(`%${search}%`) } }),
      },
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new ApiResponse(shartnoma, 200, pagination);
  }

  async findOne(id: number) {
    const shartnoma = await this.shartnomeRepo.findOne({
      relations: ['user', 'income', 'service'],
      where: { id, isDeleted: 0 },
    });
    if (!shartnoma) {
      throw new NotFoundException('shartnoma mavjud emas');
    }
    return new ApiResponse(shartnoma, 200);
  }

  async update(id: number, updateShartnomeDto: UpdateShartnomaDto) {
    const shartnoma = await this.shartnomeRepo.findOne({
      where: { id, isDeleted: 0 },
      relations: ['income', 'user', 'service'],
    });

    if (!shartnoma && shartnoma.isDeleted) {
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

    if (!!updateShartnomeDto.service_id) {
      const service = await this.serviceRepo.findOneBy({
        id: +updateShartnomeDto.service_id,
      });
      if (!service) {
        throw new NotFoundException('service_id mavjud emas');
      }
      shartnoma.service = service;
    }

    if (updateShartnomeDto.advancePayment) {
      shartnoma.remainingPayment =
        shartnoma.service.price * shartnoma.count -
        updateShartnomeDto.advancePayment;

      shartnoma.purchase_status =
        shartnoma.remainingPayment <= 0
          ? EnumShartnomaPaid.paid
          : EnumShartnomaPaid.no_paid;
    }

    if (updateShartnomeDto.advancePayment && updateShartnomeDto.paymentMethod) {
      const newIncome = {
        amount: shartnoma.advancePayment || 0,
        payment_method: shartnoma.paymentMethod as unknown,
        is_paid: 'paid',
        date: new Date(),
        user: shartnoma.user,
        shartnoma: shartnoma,
      };

      const income = await this.incomeRepo.save(newIncome as any);

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
    await this.shartnomeRepo.save({ ...shartnoma, isDeleted: 1 });
    return new ApiResponse(`shartnoma o'chirildi`);
  }
}
