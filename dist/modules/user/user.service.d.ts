import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ApiResponse } from 'src/helpers/apiRespons';
import { FindAllQuery } from 'src/helpers/type';
export declare class UserService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    create(createUserDto: CreateUserDto, userId: number): Promise<ApiResponse>;
    findAll({ page, limit, search }: FindAllQuery): Promise<ApiResponse>;
    findOne(id: number): Promise<ApiResponse>;
    update(id: number, updateUserDto: UpdateUserDto, userId: number): Promise<ApiResponse>;
    remove(id: number): Promise<ApiResponse>;
}
