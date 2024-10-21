import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShartnomaDto } from './dto/create-shartnoma.dto';
import { UpdateShartnomaDto } from './dto/update-shartnoma.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shartnoma } from './entities/shartnoma.entity';
import { Brackets, Like, Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { User } from '../user/entities/user.entity';
import {
  EnumServiceType,
  EnumShartnomaPaid,
  EnumShartnomeTpeTranslation,
} from 'src/helpers/enum';
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

  async create(createShartnomaDto: CreateShartnomaDto, userId: number) {
    const newShartnoma = this.shartnomeRepo.create(createShartnomaDto);

    const user = await this.userRepo.findOneBy({
      id: +createShartnomaDto.user_id,
    });

    newShartnoma.whoCreated = userId.toString();

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

    newShartnoma.shartnoma_nomer = `${new Date(newShartnoma?.sana).getFullYear()}/${user.id}/${shartnomaOld[0]?.shartnoma_id || 1}`;

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
      payment_method:
        createShartnomaDto.paymentMethod ||
        (EnumShartnomeTpeTranslation.cash as EnumShartnomeTpeTranslation),
      is_paid: 'paid',
      shartnome_id: newShartnoma.id,
      date: new Date(),
      user: user,
      whoCreated: userId.toString(),
    };

    const income = await this.incomeRepo.save(newIncome as any);

    newShartnoma.income = [income];

    await this.shartnomeRepo.save(newShartnoma);

    return new ApiResponse('shartnoma yarating', 201);
  }

  async findAll({ page, limit, search, filter }: FindAllQuery) {
    const totalItems = await this.shartnomeRepo.count({
      where: { isDeleted: 0 },
    });

    const pagination = new Pagination(totalItems, page, limit);

    const shartnoma = await this.shartnomeRepo
      .createQueryBuilder('shartnoma')
      .where('shartnoma.isDeleted = :isDeleted', { isDeleted: 0 })
      .leftJoinAndSelect('shartnoma.user', 'user')
      .leftJoinAndSelect(
        'shartnoma.service',
        'service',
        'service.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('user.F_I_O LIKE :F_I_O', {
            F_I_O: `%${search}%`,
          }).orWhere('CAST(user.phone AS CHAR) LIKE :phone', {
            phone: `%${search}%`,
          });
        }),
      )
      .orderBy('shartnoma.tolash_sana', filter || 'ASC')
      .take(limit)
      .skip((page - 1) * limit)
      .getMany();

    return new ApiResponse(shartnoma, 200, pagination);
  }

  async findOne(id: number) {
    const shartnoma = await this.shartnomeRepo
      .createQueryBuilder('shartnoma')
      .leftJoinAndSelect(
        'shartnoma.income',
        'income',
        'income.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .leftJoinAndSelect(
        'shartnoma.service',
        'service',
        'service.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .leftJoinAndSelect(
        'shartnoma.user',
        'user',
        'user.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .where('shartnoma.id = :id', { id })
      .andWhere('shartnoma.isDeleted = :isDeleted', { isDeleted: 0 })
      .getOne();

    if (!shartnoma) {
      throw new NotFoundException('shartnoma mavjud emas');
    }

    return new ApiResponse(shartnoma, 200);
  }

  async update(
    id: number,
    updateShartnomeDto: UpdateShartnomaDto,
    userId: number,
  ) {
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
        whoCreated: userId.toString(),
      };

      const income = await this.incomeRepo.save(newIncome as any);

      shartnoma.income = [...shartnoma.income, income];
    }

    shartnoma.whoUpdated = userId.toString();

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
