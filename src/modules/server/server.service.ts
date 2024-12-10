import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './entities/server.entity';
import { ApiResponse } from 'src/helpers/apiRespons';
import { Pagination } from 'src/helpers/pagination';
import axios from 'axios';
import { envConfig } from 'src/config/env.config';
import { FindAllQuery, IPayload } from 'src/helpers/type';

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(Server)
    private readonly serverRepo: Repository<Server>,
  ) {}
  async create(createServerDto: CreateServerDto, { userId }: IPayload) {
    const register_id = Number(userId);
    const newServer = this.serverRepo.create({
      ...createServerDto,
      register_id,
    });
    await this.serverRepo.save(newServer);
    return new ApiResponse('server created');
  }

  async notification() {
    const server = await this.serverRepo.find({ where: { isDeleted: 0 } });

    const notifications = server.map(async (el) => {
      const timeDiff = Math.abs(
        new Date().getTime() - new Date(el.date_term).getTime(),
      );
      const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (dayDiff <= 7) {
        const token = envConfig.telegram;
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const chat_id = [86419074]; //5050279125, 7234548633

        const message = `${el.name} serverining muddati ${dayDiff} kun (${el.date_term}) qoldi.
  Tarif: ${el.plan}
  Tarif summasi: ${el.price} so'm
  Mas'ul shaxs: ${el.responsible}`;

        chat_id.map(async (el) => {
          try {
            const response = await axios.post(url, {
              chat_id: el,
              text: message,
            });
            console.log(`Сообщение отправлено: ${response.data.ok}`);
          } catch (error) {
            console.error(
              `Ошибка отправки сообщения: ${error.message}`,
              new Date(),
            );
          }
        });
      } else if (dayDiff <= 0) {
        await this.serverRepo.save({ ...el, status: 0 });
        console.log('server ochdi');
      }
      console.log(`Оставшиеся дни для сервера ${el.name}: ${dayDiff}`);
    });

    await Promise.all(notifications); // Дождаться завершения всех задач
    return server;
  }

  async findAll({ page, limit }: FindAllQuery) {
    const [server, count] = await this.serverRepo
      .createQueryBuilder('server')
      .where('server.isDeleted = :isDeleted', { isDeleted: 0 })
      .take(limit)
      .skip(((page - 1) * limit) | 0)
      .getManyAndCount();

    const pagination = new Pagination(count, page, limit);
    return new ApiResponse(server, 200, pagination);
  }

  async findOne(id: number) {
    const server = await this.serverRepo
      .createQueryBuilder('server')
      .where('server.isDeleted = :isDeleted', { isDeleted: 0 })
      .leftJoinAndSelect(
        'server.serverPaid',
        'serverPaid',
        'serverPaid.isDeleted = :isDeleted',
        { isDeleted: 0 },
      )
      .andWhere('server.id = :id', { id })
      .getOne();

    return new ApiResponse(server);
  }

  async update(
    id: number,
    updateServerDto: UpdateServerDto,
    { userId }: IPayload,
  ) {
    const modify_id = Number(userId);
    const server = await this.serverRepo.update(
      { id, isDeleted: 0 },
      { ...updateServerDto, modify_id },
    );
    if (!server.affected) {
      throw new NotFoundException('server does not exist');
    }

    return new ApiResponse('server updated');
  }

  async remove(id: number) {
    const server = await this.serverRepo.findOneBy({ id });

    if (!server) {
      throw new NotFoundException('server mavjud emas');
    }

    await this.serverRepo.save({ ...server, isDeleted: 1 });
    return new ApiResponse("monthlyFee o'chirildi");
  }
}
