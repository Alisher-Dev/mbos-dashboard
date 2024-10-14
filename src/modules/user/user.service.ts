import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
import { Pagination } from 'src/helpers/pagination';
import { FindAllQuery } from 'src/helpers/type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepo.create(createUserDto);

    await this.userRepo.save(newUser);

    return new ApiResponse('foydalanuvchi yaratish', 201);
  }

  async findAll({ page, limit, search }: FindAllQuery) {
    const totalItems = await this.userRepo.count();
    const pagination = new Pagination(totalItems, page, limit);

    const user = await this.userRepo.find({
      where: search.length && { F_I_O: Like(`%${search}%`) },
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new ApiResponse(user, 200, pagination);
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('foydalanuvchi mavjud emas');
    }
    return new ApiResponse(user, 200);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('foydalanuvchi mavjud emas');
    }

    Object.assign(user, updateUserDto);

    await this.userRepo.save(user);
    return new ApiResponse(`foydalanuvchi yangilandi`, 201);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('foydalanuvchi mavjud emas');
    }
    await this.userRepo.delete(id);
    return new ApiResponse(`foydalanuvchi o'chirildi`);
  }
}
