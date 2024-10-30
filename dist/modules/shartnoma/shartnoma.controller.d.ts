import { ShartnomaService } from './shartnoma.service';
import { CreateShartnomaDto } from './dto/create-shartnoma.dto';
import { UpdateShartnomaDto } from './dto/update-shartnoma.dto';
import { FindAllQuery, IPayload } from 'src/helpers/type';
export declare class ShartnomaController {
    private readonly shartnomaService;
    constructor(shartnomaService: ShartnomaService);
    create(createShartnomaDto: CreateShartnomaDto, req: IPayload): Promise<import("../../helpers/apiRespons").ApiResponse>;
    findAll(query: FindAllQuery): Promise<import("../../helpers/apiRespons").ApiResponse>;
    findOne(id: string): Promise<import("../../helpers/apiRespons").ApiResponse>;
    update(id: string, updateShartnomaDto: UpdateShartnomaDto, req: IPayload): Promise<import("../../helpers/apiRespons").ApiResponse>;
    remove(id: string): Promise<import("../../helpers/apiRespons").ApiResponse>;
}
