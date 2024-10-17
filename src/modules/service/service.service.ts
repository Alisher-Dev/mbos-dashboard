import { Injectable, NotFoundException, Search } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery, IPayload } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { Service } from './entities/service.entity';
import { EnumServiceType } from 'src/helpers/enum';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto, userId: number) {
    const newService = this.serviceRepo.create(createServiceDto);

    newService.whoCreated = userId.toString();
    await this.serviceRepo.save(newService);

    return new ApiResponse('service yaratildi', 201);
  }

  async findAll({ page, limit, search, type }: FindAllQuery) {
    const totalItems = await this.serviceRepo.count({
      where: {
        isDeleted: 0,
        ...(search && { title: Like(`%${search}%`) }),
        ...(type !== EnumServiceType.other && {
          serviceType: type || EnumServiceType.service,
        }),
      },
    });

    const pagination = new Pagination(totalItems, page, limit);

    const service = await this.serviceRepo.find({
      relations: ['shartnoma'],
      where: {
        isDeleted: 0,
        ...(search && { title: Like(`%${search}%`) }),
        ...(type !== EnumServiceType.other && {
          serviceType: type || EnumServiceType.service,
        }),
      },
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new ApiResponse(service, 200, pagination);
  }

  async findOne(id: number) {
    const service = await this.serviceRepo.findOne({
      relations: ['shartnoma'],
      where: { id, isDeleted: 0 },
    });
    if (!service) {
      throw new NotFoundException('service mavjud emas');
    }
    return new ApiResponse(service, 200);
  }

  async update(id: number, updateServiceDto: UpdateServiceDto, userId: number) {
    const service = await this.serviceRepo.findOne({
      where: { id, isDeleted: 0 },
      relations: ['shartnoma'],
    });

    service.whoUpdated = userId.toString();

    if (!service && service.isDeleted) {
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
    await this.serviceRepo.save({ ...service, isDeleted: 1 });
    return new ApiResponse(`service o'chirildi`);
  }
}
