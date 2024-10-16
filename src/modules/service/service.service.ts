import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { Service } from './entities/service.entity';
import { EnumServiceType } from 'src/helpers/enum';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const newService = this.serviceRepo.create(createServiceDto);

    await this.serviceRepo.save(newService);

    return new ApiResponse('service yaratildi', 201);
  }

  async findAll({ page, limit, search, type }: FindAllQuery) {
    const totalItems = await this.serviceRepo.count();
    const pagination = new Pagination(totalItems, page, limit);

    const whereClause = [
      {
        title: Like(`%${search}%`),
      },
    ];

    const service = await this.serviceRepo.find({
      relations: ['shartnoma'],
      where: whereClause &&
        type !== EnumServiceType.other && {
          serviceType: type || EnumServiceType.service,
        },
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new ApiResponse(service, 200, pagination);
  }

  async findOne(id: number) {
    const service = await this.serviceRepo.findOne({
      relations: ['shartnoma'],
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('service mavjud emas');
    }
    return new ApiResponse(service, 200);
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['shartnoma'],
    });

    if (!service) {
      throw new NotFoundException('service mavjud emas');
    }

    Object.assign(service, updateServiceDto);

    await this.serviceRepo.save(service);
    return new ApiResponse(`service o'gartirildi`, 201);
  }

  async remove(id: number) {
    const service = await this.serviceRepo.findOneBy({ id });
    if (!service) {
      throw new NotFoundException('service mavjud emas');
    }
    await this.serviceRepo.delete(id);
    return new ApiResponse(`service o'chirildi`);
  }
}
