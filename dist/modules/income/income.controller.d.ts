import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { FindAllQuery, IPayload } from 'src/helpers/type';
export declare class IncomeController {
    private readonly incomeService;
    constructor(incomeService: IncomeService);
    create(createIncomeDto: CreateIncomeDto, req: IPayload): Promise<import("../../helpers/apiRespons").ApiResponse>;
    findAll(query: FindAllQuery): Promise<import("../../helpers/apiRespons").ApiResponse>;
    update(id: string, updateIncomeDto: UpdateIncomeDto, req: IPayload): Promise<import("../../helpers/apiRespons").ApiResponse>;
    remove(id: string): Promise<import("../../helpers/apiRespons").ApiResponse>;
}
