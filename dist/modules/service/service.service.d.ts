import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Service } from './entities/service.entity';
export declare class ServiceService {
    private readonly serviceRepo;
    constructor(serviceRepo: Repository<Service>);
    create(createServiceDto: CreateServiceDto, userId: number): Promise<ApiResponse>;
    findAll({ page, limit, search, type }: FindAllQuery): Promise<ApiResponse>;
    findOne(id: number): Promise<ApiResponse>;
    update(id: number, updateServiceDto: UpdateServiceDto, userId: number): Promise<ApiResponse>;
    remove(id: number): Promise<ApiResponse>;
}
