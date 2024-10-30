import { CreateShartnomaDto } from './dto/create-shartnoma.dto';
import { UpdateShartnomaDto } from './dto/update-shartnoma.dto';
import { Shartnoma } from './entities/shartnoma.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { User } from '../user/entities/user.entity';
import { Income } from '../income/entities/income.entity';
import { Service } from '../service/entities/service.entity';
import { MonthlyFee } from '../monthly_fee/entities/monthly_fee.entity';
export declare class ShartnomaService {
    private readonly shartnomeRepo;
    private readonly userRepo;
    private readonly incomeRepo;
    private readonly serviceRepo;
    private readonly monthlyFeeRepo;
    constructor(shartnomeRepo: Repository<Shartnoma>, userRepo: Repository<User>, incomeRepo: Repository<Income>, serviceRepo: Repository<Service>, monthlyFeeRepo: Repository<MonthlyFee>);
    create(createShartnomaDto: CreateShartnomaDto, userId: number): Promise<ApiResponse>;
    findAll({ page, limit, search, filter }: FindAllQuery): Promise<ApiResponse>;
    findOne(id: number): Promise<ApiResponse>;
    update(id: number, updateShartnomeDto: UpdateShartnomaDto, userId: number): Promise<ApiResponse>;
    remove(id: number): Promise<ApiResponse>;
}
