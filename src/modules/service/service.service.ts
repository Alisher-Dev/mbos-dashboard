import { Injectable, NotFoundException, Search } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery, IPayload } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { Service } from './entities/service.entity';

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
    const [service, totalItems] = await this.serviceRepo
      .createQueryBuilder('service')
      .where('service.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere(
        new Brackets((qb) => {
          qb.where('CAST(title AS TEXT) LIKE :search', {
            search: `%${search || ''}%`,
          })
            .orWhere('CAST(price AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            })
            .orWhere('CAST(birliklar AS TEXT) LIKE :search', {
              search: `%${search || ''}%`,
            });
        }),
      )
      .take(limit)
      .skip(((page - 1) * limit) | 0)
      .getManyAndCount();

    const pagination = new Pagination(totalItems, page, limit);
    return new ApiResponse(service, 200, pagination);
  }

  async findOne(id: number) {
    const service = await this.serviceRepo
      .createQueryBuilder('service')
      .where('service.id = :id', { id })
      .andWhere('service.isDeleted = :isDeleted', { isDeleted: 0 })
      .leftJoinAndSelect(
        'service.shartnoma',
        'shartnoma',
        'shartnoma.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .getOne();

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

    if (!service && service.isDeleted) {
      throw new NotFoundException('service mavjud emas');
    }

    Object.assign(service, updateServiceDto);

    service.whoUpdated = userId.toString();
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
