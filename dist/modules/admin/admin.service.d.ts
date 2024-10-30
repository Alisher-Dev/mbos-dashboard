import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
export declare class AdminService {
    private readonly adminRepo;
    constructor(adminRepo: Repository<Admin>);
    create(createAdminDto: CreateAdminDto): Promise<ApiResponse>;
    Login(body: CreateAdminDto): Promise<ApiResponse>;
    Me(id: number): Promise<ApiResponse>;
    GetAdmin(id: number): Promise<ApiResponse>;
    update(body: UpdateAdminDto): Promise<ApiResponse>;
    remove(id: number): Promise<ApiResponse>;
}
