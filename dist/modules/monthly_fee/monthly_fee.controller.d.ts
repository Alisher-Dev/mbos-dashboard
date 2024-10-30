import { MonthlyFeeService } from './monthly_fee.service';
import { CreateMonthlyFeeDto } from './dto/create-monthly_fee.dto';
import { UpdateMonthlyFeeDto } from './dto/update-monthly_fee.dto';
import { FindAllQuery, IPayload } from 'src/helpers/type';
export declare class MonthlyFeeController {
    private readonly monthlyFeeService;
    constructor(monthlyFeeService: MonthlyFeeService);
    create(createMonthlyFeeDto: CreateMonthlyFeeDto, req: IPayload): Promise<import("../../helpers/apiRespons").ApiResponse>;
    Find(): Promise<void>;
    findAll(query: FindAllQuery): Promise<import("../../helpers/apiRespons").ApiResponse>;
    update(id: string, updateMonthlyFeeDto: UpdateMonthlyFeeDto, req: IPayload): Promise<import("../../helpers/apiRespons").ApiResponse>;
    remove(id: string): Promise<import("../../helpers/apiRespons").ApiResponse>;
}
