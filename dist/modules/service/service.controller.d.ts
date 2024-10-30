import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FindAllQuery, IPayload } from 'src/helpers/type';
export declare class ServiceController {
    private readonly serviceService;
    constructor(serviceService: ServiceService);
    create(createServiceDto: CreateServiceDto, req: IPayload): Promise<import("../../helpers/apiRespons").ApiResponse>;
    findAll(query: FindAllQuery): Promise<import("../../helpers/apiRespons").ApiResponse>;
    findOne(id: string): Promise<import("../../helpers/apiRespons").ApiResponse>;
    update(id: string, updateServiceDto: UpdateServiceDto, req: IPayload): Promise<import("../../helpers/apiRespons").ApiResponse>;
    remove(id: string): Promise<import("../../helpers/apiRespons").ApiResponse>;
}
