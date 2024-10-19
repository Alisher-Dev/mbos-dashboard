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
    const newUser = this.userRepo.create(createUserDto);

    const user = await this.userRepo.findOne({
      where: { phone: createUserDto.phone },
    });

    newUser.whoCreated = userId.toString();

    if (!!user) {
      throw new BadRequestException('foydalanuvji yaratilgan');
    }

    await this.userRepo.save(newUser);

    return new ApiResponse('foydalanuvchi yaratish', 201);
  }

  async findAll({ page, limit, search }: FindAllQuery) {
    const queryBuilder = this.userRepo.createQueryBuilder('user');

    const [users, totalItems] = await queryBuilder
      .where('user.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere(
        new Brackets((qb) => {
          qb.where('user.F_I_O LIKE :search', {
            search: `%${search}%`,
          }).orWhere('CAST(user.phone AS CHAR) LIKE :search', {
            search: `%${search}%`,
          });
        }),
      )
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    const pagination = new Pagination(totalItems, page, limit);

    return new ApiResponse(users, 200, pagination);
  }

  async findOne(id: number) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.shartnome',
        'shartnome',
        'shartnome.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .leftJoinAndSelect(
        'user.income',
        'income',
        'income.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .where('user.id = :id', { id })
      .andWhere('user.isDeleted = :isDeleted', { isDeleted: 0 })
      .getOne();

    if (!user) {
      throw new NotFoundException('foydalanuvchi mavjud emas');
    }

    return new ApiResponse(user, 200);
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
