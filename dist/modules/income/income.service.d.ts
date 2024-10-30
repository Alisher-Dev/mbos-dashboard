import { Income } from './entities/income.entity';
import { Repository } from 'typeorm';
import { CreateIncomeDto } from './dto/create-income.dto';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { User } from '../user/entities/user.entity';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
export declare class IncomeService {
    private readonly incomeRepo;
    private readonly userRepo;
    private readonly shartnomaRepo;
    constructor(incomeRepo: Repository<Income>, userRepo: Repository<User>, shartnomaRepo: Repository<Shartnoma>);
    create(createIncomeDto: CreateIncomeDto, userId: number): Promise<ApiResponse>;
    findAll({ page, limit, search }: FindAllQuery): Promise<ApiResponse>;
    update(id: number, updateIncomeDto: Partial<CreateIncomeDto>, userId: number): Promise<ApiResponse>;
    remove(id: number): Promise<ApiResponse>;
}
