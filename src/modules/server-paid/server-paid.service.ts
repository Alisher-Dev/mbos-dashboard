import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServerPaidDto } from './dto/create-server-paid.dto';
import { UpdateServerPaidDto } from './dto/update-server-paid.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServerPaid } from './entities/server-paid.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery, IPayload } from 'src/helpers/type';
import { Pagination } from 'src/helpers/pagination';
import { Server } from '../server/entities/server.entity';

@Injectable()
export class ServerPaidService {
  constructor(
    @InjectRepository(ServerPaid)
    private readonly serverPaidRepo: Repository<ServerPaid>,

    @InjectRepository(Server)
    private readonly serverRepo: Repository<Server>,
  ) {}
  async create(createServerDto: CreateServerPaidDto, { userId }: IPayload) {
    const newServerPaid = this.serverPaidRepo.create(createServerDto);
    const server = await this.serverRepo.findOneBy({
      id: createServerDto.server_id,
      isDeleted: 0,
    });

    if (!server) {
      throw new NotFoundException('server does not exist');
    }

    const register_id = Number(userId);

    newServerPaid.server = server;

    await this.serverPaidRepo.save({ ...newServerPaid, register_id });
    await this.serverRepo.save({
      ...server,
      date_term: newServerPaid.date_term,
    });
    return new ApiResponse('server-paid created');
  }

  async findAll({ page, limit }: FindAllQuery) {
    const [serverPaid, count] = await this.serverPaidRepo
      .createQueryBuilder('serverPaid')
      .where('server.isDeleted = :isDeleted', { isDeleted: 0 })
      .take(limit)
      .skip(((page - 1) * limit) | 0)
      .getManyAndCount();

    const pagination = new Pagination(count, page, limit);
    return new ApiResponse(serverPaid, 200, pagination);
  }

  async findOne(id: number) {
    const serverPaid = await this.serverPaidRepo
      .createQueryBuilder('serverPaid')
      .where('server.isDeleted = :isDeleted', { isDeleted: 0 })
      .andWhere('serverPaid.id = :id', { id })
      .getOne();

    return new ApiResponse(serverPaid);
  }

  async update(
    id: number,
    updateServerDto: UpdateServerPaidDto,
    { userId }: IPayload,
  ) {
    const serverPaid = await this.serverPaidRepo.findOneBy({
      id,
      isDeleted: 0,
    });
    const modify_id = Number(userId);

    if (!serverPaid) {
      throw new NotFoundException('serverPaid does not exist');
    }

    if (!!updateServerDto.server_id) {
      const server = await this.serverRepo.findOneBy({
        id: updateServerDto.server_id,
        isDeleted: 0,
      });
      if (!server) {
        throw new NotFoundException('server does not exist');
      }
      serverPaid.server = server;
    }

    await this.serverPaidRepo.save({ ...serverPaid, modify_id });

    return new ApiResponse('serverPaid updated');
  }

  async remove(id: number) {
    const serverPaid = await this.serverPaidRepo.findOneBy({ id });

    if (!serverPaid) {
      throw new NotFoundException('serverPaid mavjud emas');
    }

    await this.serverPaidRepo.save({ ...serverPaid, isDeleted: 1 });
    return new ApiResponse("monthlyFee o'chirildi");
  }
}
