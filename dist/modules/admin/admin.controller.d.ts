import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { IRequest } from 'src/helpers/type';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    create(createAdminDto: CreateAdminDto): Promise<import("../../helpers/apiRespons").ApiResponse>;
    Login(createAdminDto: CreateAdminDto): Promise<import("../../helpers/apiRespons").ApiResponse>;
    Me(req: IRequest): Promise<import("../../helpers/apiRespons").ApiResponse>;
    GetAdmin(param: {
        id: number;
    }): Promise<import("../../helpers/apiRespons").ApiResponse>;
    update(updateAdminDto: UpdateAdminDto): Promise<import("../../helpers/apiRespons").ApiResponse>;
    remove(req: IRequest): Promise<import("../../helpers/apiRespons").ApiResponse>;
}
