import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllQuery, IPayload } from 'src/helpers/type';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto, req: IPayload): Promise<import("../../helpers/apiRespons").ApiResponse>;
    findAll(query: FindAllQuery): Promise<import("../../helpers/apiRespons").ApiResponse>;
    findOne(id: string): Promise<import("../../helpers/apiRespons").ApiResponse>;
    update(id: string, updateUserDto: UpdateUserDto, req: IPayload): Promise<import("../../helpers/apiRespons").ApiResponse>;
    remove(id: string): Promise<import("../../helpers/apiRespons").ApiResponse>;
}
