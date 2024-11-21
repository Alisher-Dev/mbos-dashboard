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
  EnumIncamIsPaid,
  EnumServiceType,
  EnumShartnoma,
  EnumShartnomaPaid,
  EnumShartnomaTpeTranslation,
} from 'src/helpers/enum';
import { Income } from '../income/entities/income.entity';
import { Service } from '../service/entities/service.entity';
import { MonthlyFee } from '../monthly_fee/entities/monthly_fee.entity';
import e from 'express';

@Injectable()
export class ShartnomaService {
  constructor(
    @InjectRepository(Shartnoma)
    private readonly shartnomaRepo: Repository<Shartnoma>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Income)
    private readonly incomeRepo: Repository<Income>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(MonthlyFee)
    private readonly monthlyFeeRepo: Repository<MonthlyFee>,
  ) {}

  async create(createShartnomaDto: CreateShartnomaDto, userId: number) {
    const newShartnoma = this.shartnomaRepo.create(createShartnomaDto);

    newShartnoma.whoCreated = userId.toString();

    const user = await this.userRepo.findOneBy({
      id: +createShartnomaDto.user_id,
      isDeleted: 0,
    });

    if (!user) {
      throw new NotFoundException('user_id mavjud emas');
    }
    newShartnoma.user = user;

    const shartnomaOld = await this.shartnomaRepo.find({
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
      isDeleted: 0,
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

    if (newShartnoma.shartnoma_turi === EnumShartnoma.subscription_fee) {
      const startDate = new Date(createShartnomaDto.texnik_muddati);
      const endDate = new Date();
      const monthlyFees = [];

      // Рассчитываем первую запись с частичным месяцем
      const daysInMonth = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0,
      ).getDate();
      const remainingDays = daysInMonth - startDate.getDate() + 1;
      const initialAmount =
        (remainingDays / daysInMonth) *
        newShartnoma.service.price *
        newShartnoma.count;

      monthlyFees.push({
        date: startDate,
        shartnoma_id: newShartnoma.id,
        amount: Math.floor(initialAmount),
        commit: `To’lov ${newShartnoma.service?.title} ${new Date().toLocaleDateString()} oydagi oylik tolov`,
      });

      let currentMonth = startDate.getMonth() + 1; // Правильный индекс месяца
      let currentYear = startDate.getFullYear();

      while (
        currentYear < endDate.getFullYear() ||
        (currentYear === endDate.getFullYear() &&
          currentMonth <= endDate.getMonth())
      ) {
        const monthlyFeeDate = new Date(currentYear, currentMonth, 1); // Устанавливаем на 1-е число месяца

        // Проверяем на дубли
        const feeExists = monthlyFees.some(
          (fee) =>
            fee.date.getMonth() === monthlyFeeDate.getMonth() &&
            fee.date.getFullYear() === monthlyFeeDate.getFullYear(),
        );

        if (!feeExists) {
          const newMonthlyFee = {
            date: monthlyFeeDate,
            shartnoma_id: newShartnoma.id,
            amount: Math.floor(newShartnoma.service.price * newShartnoma.count),
            commit: `To’lov ${newShartnoma.service?.title} ${new Date().toLocaleDateString()} oydagi oylik tolov`,
          };
          monthlyFees.push(newMonthlyFee);
        }

        currentMonth += 1;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear += 1;
        }
      }

      await this.monthlyFeeRepo.save(monthlyFees);
      newShartnoma.monthlyFee = monthlyFees;
      console.log(newShartnoma.monthlyFee);
    } else {
      const newIncome = {
        amount: createShartnomaDto.advancePayment || 0,
        payment_method:
          createShartnomaDto.paymentMethod ||
          (EnumShartnomaTpeTranslation.cash as EnumShartnomaTpeTranslation),
        is_paid: 'paid',
        shartnoma_id: newShartnoma.id,
        date: new Date(),
        user: user,
        whoCreated: userId.toString(),
        description: `xizmat ${newShartnoma.service?.title} ${new Date().toLocaleDateString()} oydagi tolov yaratildi`,
      };
      const income = await this.incomeRepo.save(newIncome as any);
      newShartnoma.income = [income];
    }

    await this.shartnomaRepo.save(newShartnoma);

    return new ApiResponse('shartnoma created', 201);
  }

  async findAll({ page, limit, search, filter, isPaid }: FindAllQuery) {
    const query = this.shartnomaRepo
      .createQueryBuilder('shartnoma')
      .where('shartnoma.isDeleted = :isDeleted', { isDeleted: 0 })
      .leftJoinAndSelect(
        'shartnoma.user',
        'user',
        'user.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .leftJoinAndSelect(
        'shartnoma.service',
        'service',
        'service.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('CAST(user.INN_number AS TEXT) LIKE :search', {
            search: `%${search || ''}%`,
          })
            .orWhere('CAST(user.phone AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(user.F_I_O AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(user.adress AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(shartnoma_nomer AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(shartnoma_muddati AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(texnik_muddati AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(izoh AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(sana AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(tolash_sana AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(service.title AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(service.price AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            });
        }),
      )
      .orderBy('shartnoma.tolash_sana', filter || 'ASC')
      .take(limit)
      .skip(((page - 1) * limit) | 0);

    if (!!isPaid) {
      query.andWhere('shartnoma.purchase_status = :isPaid', {
        isPaid:
          isPaid === 'paid'
            ? EnumShartnomaPaid.paid
            : EnumShartnomaPaid.no_paid,
      });
    }

    const [shartnoma, totalItems] = await query.getManyAndCount();
    const pagination = new Pagination(totalItems, page, limit);
    return new ApiResponse(shartnoma, 200, pagination);
  }

  async findOne(id: number) {
    const shartnoma = await this.shartnomaRepo
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
      .leftJoinAndSelect(
        'shartnoma.monthlyFee',
        'monthlyFee',
        'monthlyFee.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .leftJoinAndSelect(
        'monthlyFee.balance_history',
        'balance_history',
        'balance_history.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .where('shartnoma.id = :id', { id })
      .andWhere('shartnoma.isDeleted = :isDeleted', { isDeleted: 0 })
      .orderBy('monthlyFee.date', 'ASC')
      .getOne();

    if (!shartnoma) {
      throw new NotFoundException('shartnoma mavjud emas');
    }
    if (shartnoma.shartnoma_turi === EnumShartnoma.subscription_fee) {
      let isPaids = 0;
      shartnoma.monthlyFee.map((el) => {
        if (el.amount > el.paid) {
          isPaids += 1;
        }
      });
      if (!!isPaids) {
        await this.shartnomaRepo.update(
          { id: shartnoma.id },
          { purchase_status: EnumShartnomaPaid.paid },
        );
      }
    }
    return new ApiResponse(shartnoma, 200);
  }

  async update(
    id: number,
    updateShartnomaDto: UpdateShartnomaDto,
    userId: number,
  ) {
    const shartnoma = await this.shartnomaRepo.findOne({
      where: { id, isDeleted: 0, enabled: 0 },
      relations: ['income', 'user', 'service'],
    });

    if (!shartnoma) {
      throw new NotFoundException('shartnoma mavjud emas');
    }

    Object.assign(shartnoma, updateShartnomaDto);

    if (!!updateShartnomaDto.user_id) {
      const user = await this.userRepo.findOneBy({
        id: +updateShartnomaDto.user_id,
      });
      if (!user) {
        throw new NotFoundException('user_id mavjud emas');
      }
      shartnoma.user = user;
    }

    if (!!updateShartnomaDto.service_id) {
      const service = await this.serviceRepo.findOneBy({
        id: +updateShartnomaDto.service_id,
      });
      if (!service) {
        throw new NotFoundException('service_id mavjud emas');
      }
      shartnoma.service = service;
    }

    if (updateShartnomaDto.advancePayment) {
      shartnoma.remainingPayment =
        shartnoma.service.price * shartnoma.count -
        updateShartnomaDto.advancePayment;

      shartnoma.purchase_status =
        shartnoma.remainingPayment <= 0
          ? EnumShartnomaPaid.paid
          : EnumShartnomaPaid.no_paid;
    }

    if (updateShartnomaDto.advancePayment && updateShartnomaDto.paymentMethod) {
      const newIncome = {
        amount: shartnoma.advancePayment || 0,
        payment_method: shartnoma.paymentMethod as unknown,
        is_paid: 'paid',
        date: new Date(),
        user: shartnoma.user,
        shartnoma: shartnoma,
        whoCreated: userId.toString(),
        description: `xizmat ${shartnoma.service?.title} ${new Date().toLocaleDateString()} oydagi tolov ozgartirildi`,
      };

      const income = await this.incomeRepo.save(newIncome as any);

      shartnoma.income = [...shartnoma.income, income];
    }

    shartnoma.whoUpdated = userId.toString();

    await this.shartnomaRepo.save(shartnoma);
    return new ApiResponse(`shartnoma o'gartirildi`, 201);
  }

  async refreshManthly_fee({ id }: FindAllQuery) {
    const shartnoma = await this.shartnomaRepo.findOne({
      where: { id, isDeleted: 0, enabled: 0 },
      relations: ['service', 'monthlyFee'],
    });

    if (!shartnoma) {
      throw new NotFoundException('shartnoma mavjud emas');
    }

    if (!shartnoma.service) {
      throw new NotFoundException('service shartnomadagi mavjud emas');
    }

    // Удаляем старые записи
    await this.monthlyFeeRepo.update(
      { shartnoma: { id } },
      { isDeleted: 1, commit: 'monthly_feeni kayta ishlashda yangilandi' },
    );

    if (shartnoma.shartnoma_turi === EnumShartnoma.subscription_fee) {
      const startDate = new Date(shartnoma.texnik_muddati);
      const endDate = new Date();
      const monthlyFees = [];

      // Первая запись с частичным месяцем
      const daysInMonth = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0,
      ).getDate();
      const remainingDays = daysInMonth - startDate.getDate() + 1;
      const initialAmount =
        (remainingDays / daysInMonth) *
        shartnoma.service.price *
        shartnoma.count;

      monthlyFees.push({
        date: startDate,
        shartnoma: shartnoma,
        amount: Math.floor(initialAmount),
        commit: `To’lov ${shartnoma.service?.title} ${new Date().toLocaleDateString()} oydagi oylik tolov`,
      });

      // Полные месяцы
      let currentDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        1,
      );

      while (currentDate <= endDate) {
        monthlyFees.push({
          date: new Date(currentDate),
          shartnoma: shartnoma,
          amount: Math.floor(shartnoma.service.price * shartnoma.count),
          commit: `To’lov ${shartnoma.service?.title} ${currentDate.toLocaleDateString()} oydagi oylik tolov`,
        });

        currentDate.setMonth(currentDate.getMonth() + 1); // Переход к следующему месяцу
      }

      await this.monthlyFeeRepo.save(monthlyFees);
      shartnoma.monthlyFee = monthlyFees;
      console.log(shartnoma.monthlyFee);
    }

    return new ApiResponse('shartnomani monthly_fee kayta ishlandi');
  }

  async remove(id: number) {
    const shartnoma = await this.shartnomaRepo.findOneBy({
      id,
      isDeleted: 0,
      enabled: 0,
    });
    if (!shartnoma) {
      throw new NotFoundException('shartnoma mavjud emas');
    }
    await this.shartnomaRepo.save({ ...shartnoma, isDeleted: 1 });
    return new ApiResponse(`shartnoma o'chirildi`);
  }
}
