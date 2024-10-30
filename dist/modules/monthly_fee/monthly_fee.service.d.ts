import { CreateMonthlyFeeDto } from './dto/create-monthly_fee.dto';
import { UpdateMonthlyFeeDto } from './dto/update-monthly_fee.dto';
import { Shartnoma } from '../shartnoma/entities/shartnoma.entity';
import { Repository } from 'typeorm';
import { MonthlyFee } from './entities/monthly_fee.entity';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
import { Income } from '../income/entities/income.entity';
export declare class MonthlyFeeService {
    private readonly shartnomaRepo;
    private readonly monthlyFeeRepo;
    private readonly incomeRepo;
    constructor(shartnomaRepo: Repository<Shartnoma>, monthlyFeeRepo: Repository<MonthlyFee>, incomeRepo: Repository<Income>);
    create(monthlyFeeDto: CreateMonthlyFeeDto, userId: number): Promise<ApiResponse>;
    findAll({ page, limit }: FindAllQuery): Promise<ApiResponse>;
    updateOrCreateMonthlyFees(): Promise<void>;
    update(id: number, updateMonthlyFeeDto: Partial<UpdateMonthlyFeeDto>, userId: number): Promise<ApiResponse>;
    remove(id: number): Promise<ApiResponse>;
}
