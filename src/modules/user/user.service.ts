import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Brackets, Like, Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
import { Pagination } from 'src/helpers/pagination';
import { FindAllQuery } from 'src/helpers/type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto, userId: number) {
    const existingUser = await this.userRepo.findOne({
      where: { INN_number: createUserDto.INN_number, isDeleted: 0 },
    });

    if (existingUser) {
      throw new BadRequestException('Foydalanuvchi yaratilgan');
    }

    const newUser = this.userRepo.create({
      ...createUserDto,
      whoCreated: userId.toString(),
    });

    await this.userRepo.save(newUser);

    return new ApiResponse('Foydalanuvchi yaratish', 201);
  }

  async findAll({ page = 1, limit = 10, search = '' }: FindAllQuery) {
    const [users, totalItems] = await this.userRepo
      .createQueryBuilder('user')
      .where('user.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere(
        new Brackets((qb) => {
          qb.where('CAST(user.INN_number AS CHAR) LIKE :search', {
            search: `%${search || ''}%`,
          })
            .orWhere('CAST(user.phone AS CHAR) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(user.adress AS CHAR) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(user.F_I_O AS CHAR) LIKE :search', {
              search: `%${search || ''}%`,
            });
        }),
      )
      .take(limit)
      .skip(((page - 1) * limit) | 0)
      .getManyAndCount();

    const pagination = new Pagination(totalItems, page, limit);

    return new ApiResponse(users, 200, pagination);
  }

  async findOne(id: number) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.shartnoma',
        'shartnoma',
        'shartnoma.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .leftJoinAndSelect(
        'shartnoma.service',
        'service',
        'service.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .leftJoinAndSelect(
        'user.income', // Связываем таблицу income
        'income',
        'income.isDeleted = :isDeleted', // Условие только для не удаленных записей
        { isDeleted: 0 },
      )
      .leftJoinAndSelect(
        'user.balance_history',
        'balance_history',
        'balance_history.isDeleted = :isDeleted', // Условие только для не удаленных записей
        { isDeleted: 0 },
      )
      .where('user.id = :id', { id }) // Условие для поиска пользователя по id
      .andWhere('user.isDeleted = :isDeleted', { isDeleted: 0 }) // Условие для пользователя, который не удален
      .getOne(); // Получаем одну запись

    if (!user) {
      throw new NotFoundException('foydalanuvchi mavjud emas'); // Исключение, если пользователь не найден
    }

    return new ApiResponse(user, 200); // Возвращаем данные пользователя с кодом 200
  }

  async update(id: number, updateUserDto: UpdateUserDto, userId: number) {
    const user = await this.userRepo.findOneBy({ id, isDeleted: 0 });

    if (!user && user.isDeleted) {
      throw new NotFoundException('foydalanuvchi mavjud emas');
    }

    user.whoUpdated = userId.toString();

    Object.assign(user, updateUserDto);

    await this.userRepo.save(user);
    return new ApiResponse(`foydalanuvchi yangilandi`, 201);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('foydalanuvchi mavjud emas');
    }
    await this.userRepo.save({ ...user, isDeleted: 1 });
    return new ApiResponse(`foydalanuvchi o'chirildi`);
  }
}
