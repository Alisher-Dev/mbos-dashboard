import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShartnomaDto } from './dto/create-shartnoma.dto';
import { UpdateShartnomaDto } from './dto/update-shartnoma.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shartnoma } from './entities/shartnoma.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { v4 } from 'uuid';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ShartnomaService {
  constructor(
    @InjectRepository(Shartnoma)
    private readonly shartnomeRepo: Repository<Shartnoma>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async create(createShartnomaDto: CreateShartnomaDto) {
    const newShartnoma = this.shartnomeRepo.create(createShartnomaDto);

    newShartnoma.total_price = (
      createShartnomaDto.count * +createShartnomaDto.price
    ).toString();

    const secretId = v4();
    newShartnoma.shartnoma_id = secretId.slice(0, 6);

    const user = await this.userRepo.findOneBy({
      id: +createShartnomaDto.user_id,
    });

    if (!user) {
      throw new NotFoundException('user_id does not exist');
    }

    newShartnoma.user = user;

    await this.shartnomeRepo.save(newShartnoma);

    return new ApiResponse('create shartnome', 201);
  }

  async findAll({ page, limit }: FindAllQuery) {
    const totalItems = await this.shartnomeRepo.count();
    const pagination = new Pagination(totalItems, page, limit);

    const shartnoma = await this.shartnomeRepo.find({
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new ApiResponse(shartnoma, 200, pagination);
  }

  async findOne(id: number) {
    const shartnoma = await this.shartnomeRepo.findOne({
      relations: ['user'],
      where: { id },
    });
    if (!shartnoma) {
      throw new NotFoundException('shartnoma does not exist');
    }
    return new ApiResponse(shartnoma, 200);
  }

  async update(id: number, updateShartnomeDto: UpdateShartnomaDto) {
    const shartnoma = await this.shartnomeRepo.findOneBy({ id });

    if (!shartnoma) {
      throw new NotFoundException('shartnoma does not exist');
    }

    Object.assign(shartnoma, updateShartnomeDto);

    if (updateShartnomeDto.count || updateShartnomeDto.price) {
      shartnoma.total_price = (
        (updateShartnomeDto.count || shartnoma.count) *
        (+updateShartnomeDto.price || +shartnoma.price)
      ).toString();
    }

    if (!!updateShartnomeDto.user_id) {
      const user = await this.userRepo.findOneBy({
        id: +updateShartnomeDto.user_id,
      });

      if (!user) {
        throw new NotFoundException('user_id does not exist');
      }

      shartnoma.user = user;
    }

    await this.shartnomeRepo.save(shartnoma);
    return new ApiResponse(`shartnoma updated`, 201);
  }

  async remove(id: number) {
    const shartnoma = await this.shartnomeRepo.findOneBy({ id });
    if (!shartnoma) {
      throw new NotFoundException('shartnoma does not exist');
    }
    await this.shartnomeRepo.delete(id);
    return new ApiResponse(`remove shartnoma`);
  }
}
