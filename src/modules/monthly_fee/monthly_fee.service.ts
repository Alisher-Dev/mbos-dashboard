import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMonthlyFeeDto } from './dto/create-monthly_fee.dto';
import { UpdateMonthlyFeeDto } from './dto/update-monthly_fee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { Cron } from '@nestjs/schedule';
import { Brackets, Repository } from 'typeorm';
import { MonthlyFee } from './entities/monthly_fee.entity';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { EnumShartnoma, EnumShartnomaPaid } from 'src/helpers/enum';
import { BalanceHistory } from '../balance_history/entities/balance_history.entity';
import axios from 'axios';
import { envConfig } from 'src/config/env.config';

@Injectable()
export class MonthlyFeeService {
  constructor(
    @InjectRepository(Shartnoma)
    private readonly shartnomaRepo: Repository<Shartnoma>,

    @InjectRepository(MonthlyFee)
    private readonly monthlyFeeRepo: Repository<MonthlyFee>,

    @InjectRepository(BalanceHistory)
    private readonly balancHistoryRepo: Repository<BalanceHistory>,
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

    if (newMonthlyFee.amount <= newMonthlyFee.paid) {
      newMonthlyFee.purchase_status = EnumShartnomaPaid.paid;
    }

    newMonthlyFee.shartnoma = shartnoma;

    await this.monthlyFeeRepo.save(newMonthlyFee);
    return new ApiResponse('monthlyFee created', 201);
  }

  async findAll({ page, limit, search, isPaid }: FindAllQuery) {
    const query = this.monthlyFeeRepo
      .createQueryBuilder('monthly_fee')
      .where('monthly_fee.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere(
        new Brackets((qb) => {
          qb.where('CAST(commit AS TEXT) LIKE :search', {
            search: `%${search || ''}%`,
          })
            .orWhere('CAST(paid AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(date AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(amount AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            });
        }),
      )
      .take(limit)
      .skip(((page - 1) * limit) | 0);

    if (!!isPaid) {
      query.andWhere('monthly_fee.purchase_status = :isPaid', {
        isPaid: EnumShartnomaPaid[isPaid],
      });
    }

    const [monthlyFee, totalItems] = await query.getManyAndCount();

    const pagination = new Pagination(totalItems, page, limit);
    return new ApiResponse(monthlyFee, 200, pagination);
  }

  @Cron('0 8 * * *') // Каждый день в 8:00
  async updateOrCreateMonthlyFees() {
    const today = new Date('2025-05-29');

    const allShartnoma = await this.shartnomaRepo.find({
      where: {
        isDeleted: 0,
        shartnoma_turi: EnumShartnoma.subscription_fee,
      },
      relations: { service: true, monthlyFee: true },
    });

    await Promise.all(
      allShartnoma.map(async (shartnoma) => {
        try {
          if (shartnoma.enabled === 1) {
            console.log(`Shartnoma с id = ${shartnoma.id} отключён.`);
            return;
          }

          if (!shartnoma.sana) {
            console.log(`Нет даты начала (sana) у shartnoma ${shartnoma.id}`);
            return;
          }

          const startDate = new Date(shartnoma.sana);
          const currentDate = new Date(today);
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(1); // текущий месяц (начало)

          // Месяцы, которые уже есть
          const existingMonths = new Set(
            (shartnoma.monthlyFee || []).map((fee) =>
              fee.isDeleted === 0
                ? `${fee.date.getFullYear()}-${fee.date.getMonth() + 1}`
                : '',
            ),
          );

          // Начинаем с первого числа месяца начала
          let current = new Date(startDate);
          current.setDate(1);

          while (
            current.getFullYear() < currentDate.getFullYear() ||
            (current.getFullYear() === currentDate.getFullYear() &&
              current.getMonth() <= currentDate.getMonth())
          ) {
            const key = `${current.getFullYear()}-${current.getMonth() + 1}`;

            if (!existingMonths.has(key)) {
              const newMonthly = this.monthlyFeeRepo.create({
                ...shartnoma.monthlyFee?.[0],
                amount: +shartnoma.service?.price * +shartnoma.count || 0,
                paid: 0,
                isDeleted: 0,
                purchase_status: EnumShartnomaPaid.no_paid,
                id: undefined,
                date: new Date(current),
                shartnoma,
              });

              await this.monthlyFeeRepo.save(newMonthly);
              console.log(
                `✅ Создан monthlyFee за ${current.toISOString().slice(0, 7)} для shartnoma ${shartnoma.id}`,
              );
            } else {
              console.log(
                `⏭️ Уже существует monthlyFee за ${key} для shartnoma ${shartnoma.id}`,
              );
            }

            // Переход к следующему месяцу
            current.setMonth(current.getMonth() + 1);
          }
        } catch (err) {
          console.error(
            `❌ Ошибка при обработке shartnoma ${shartnoma.id}:`,
            err,
          );
        }
      }),
    );
  }

  @Cron('0 8 * * *') // Каждый день в 8:00
  async notification() {
    const month = await this.monthlyFeeRepo.find({
      where: { isDeleted: 0 },
      relations: { shartnoma: { user: true, service: true } },
    });

    month.map((el) => {
      const isUnpaid = el.purchase_status === EnumShartnomaPaid.no_paid;

      // Разница в миллисекундах
      const diffMs = Date.now() - new Date(el.date).getTime();

      // Переводим в дни
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      const messageWarning = `Hayrli kun! ${el.shartnoma.service?.title || 'N/A'} uchun ${Math.abs(diffDays)} kun ichida to'lov qilmasangiz bu xizmat o'chirilishini ma'lum qilamiz. 
Qarzdorlik: ${(+el.amount - +el.paid).toLocaleString()} 
Tel: +998622277676 
mbos.uz
`;

      const messageForbid = `Sizga berilayotgan ${el.shartnoma.service?.title || 'N/A'} to'lovni amalga oshirmaganligingiz uchun ${new Date(el.date).toLocaleDateString('uz-UZ')} sanasidan to'xtatildi. 
Tel: +998622277676 
mbos.uz`;

      if (isUnpaid && diffDays === -5) {
        notificationEskiz(el.shartnoma.user.phone.toString(), messageWarning);
      } else if (isUnpaid && diffDays === 0) {
        notificationEskiz(el.shartnoma.user.phone.toString(), messageForbid);
      }
    });
  }

  async update(
    id: number,
    updateMonthlyFeeDto: UpdateMonthlyFeeDto,
    userId: number,
  ) {
    const monthlyFee = await this.monthlyFeeRepo.findOne({
      where: { id, isDeleted: 0 },
      relations: { shartnoma: { user: true, service: true } },
    });

    if (!monthlyFee) {
      throw new NotFoundException('monthlyFee not found');
    }

    monthlyFee.whoUpdated = userId.toString();

    Object.assign(monthlyFee, updateMonthlyFeeDto);

    if (updateMonthlyFeeDto.paid && updateMonthlyFeeDto.date) {
      const newBalancHistory = {
        amount: updateMonthlyFeeDto.paid,
        date: updateMonthlyFeeDto.date,
        monthly_fee: monthlyFee,
        user: monthlyFee.shartnoma.user,
        purchase_status: EnumShartnomaPaid.no_paid,
        whoCreated: userId.toString(),
        commit: `To’lov ${monthlyFee.shartnoma?.service?.title || `monthlyFee = ${monthlyFee.id}`} uchun ${new Date().toLocaleDateString()} o’zgartirilgandan kegin balansdan yechildi`,
      };

      if (!newBalancHistory) {
        throw new NotFoundException('BalancHistory not found');
      }

      await this.balancHistoryRepo.save(newBalancHistory);
    }
    if (monthlyFee.amount <= monthlyFee.paid) {
      const messageSuccess = `Sizning ${new Date(monthlyFee.date).toLocaleDateString('uz-UZ')} kungi ${monthlyFee.amount.toLocaleString()} UZS(USD) to'lovingiz qabul qilindi. 
Tel: +998622277676 
mbos.uz`;

      notificationEskiz(
        monthlyFee.shartnoma.user.phone.toString(),
        messageSuccess,
      );
      monthlyFee.purchase_status = EnumShartnomaPaid.paid;
    } else {
      monthlyFee.purchase_status = EnumShartnomaPaid.no_paid;
    }

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

export async function notificationEskiz(phone: string, message: string) {
  try {
    // 🔐 Авторизация
    const loginRes = await axios.post(
      'https://notify.eskiz.uz/api/auth/login',
      {
        email: envConfig.eskiz.EMAIL,
        password: envConfig.eskiz.SECRET,
      },
    );

    const token = loginRes.data.data.token;

    // 📤 Отправка SMS
    const smsRes = await axios.post(
      'https://notify.eskiz.uz/api/message/sms/send',
      {
        mobile_phone: phone,
        message: message.trim(),
        from: 'mbos',
        callback_url: '',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('✅ SMS отправлено:', phone);
  } catch (error: any) {
    if (error.response) {
      console.error('❌ Ошибка отправки:', error.response.data);
    } else {
      console.error('❌ Ошибка:', error.message);
    }
  }
}
