import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Income } from '../income/entities/income.entity';
import { ApiResponse } from 'src/helpers/apiRespons';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { Service } from '../service/entities/service.entity';
export declare class DashboardService {
    private readonly userRepo;
    private readonly incomeRepo;
    private readonly shartnomaRepo;
    private readonly serviceRepo;
    constructor(userRepo: Repository<User>, incomeRepo: Repository<Income>, shartnomaRepo: Repository<Shartnoma>, serviceRepo: Repository<Service>);
    find(): Promise<ApiResponse>;
    findIncome(): Promise<ApiResponse>;
    findStatstik(): Promise<ApiResponse>;
    findServiceDash(id: number): Promise<ApiResponse>;
}
