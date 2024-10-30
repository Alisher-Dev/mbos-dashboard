"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const apiRespons_1 = require("../../helpers/apiRespons");
const pagination_1 = require("../../helpers/pagination");
let UserService = class UserService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async create(createUserDto, userId) {
        const existingUser = await this.userRepo.findOne({
            where: { INN_number: createUserDto.INN_number, isDeleted: 0 },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Foydalanuvchi yaratilgan');
        }
        const newUser = this.userRepo.create({
            ...createUserDto,
            whoCreated: userId.toString(),
        });
        await this.userRepo.save(newUser);
        return new apiRespons_1.ApiResponse('Foydalanuvchi yaratish', 201);
    }
    async findAll({ page, limit, search }) {
        const queryBuilder = this.userRepo.createQueryBuilder('user');
        const [users, totalItems] = await queryBuilder
            .where('user.isDeleted = :isDeleted', { isDeleted: 0 })
            .andWhere(new typeorm_2.Brackets((qb) => {
            qb.where('user.INN_number LIKE :search', {
                search: `%${search || ''}%`,
            }).orWhere('CAST(user.phone AS CHAR) LIKE :search', {
                search: `%${search || ''}%`,
            });
        }))
            .take(limit)
            .skip(((page - 1) * limit) | 0)
            .getManyAndCount();
        const pagination = new pagination_1.Pagination(totalItems, page, limit);
        return new apiRespons_1.ApiResponse(users, 200, pagination);
    }
    async findOne(id) {
        const user = await this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.shartnome', 'shartnome', 'shartnome.isDeleted = :isDeleted', { isDeleted: 0 })
            .leftJoinAndSelect('user.income', 'income', 'income.isDeleted = :isDeleted', { isDeleted: 0 })
            .where('user.id = :id', { id })
            .andWhere('user.isDeleted = :isDeleted', { isDeleted: 0 })
            .getOne();
        if (!user) {
            throw new common_1.NotFoundException('foydalanuvchi mavjud emas');
        }
        return new apiRespons_1.ApiResponse(user, 200);
    }
    async update(id, updateUserDto, userId) {
        const user = await this.userRepo.findOneBy({ id, isDeleted: 0 });
        if (!user && user.isDeleted) {
            throw new common_1.NotFoundException('foydalanuvchi mavjud emas');
        }
        user.whoUpdated = userId.toString();
        Object.assign(user, updateUserDto);
        await this.userRepo.save(user);
        return new apiRespons_1.ApiResponse(`foydalanuvchi yangilandi`, 201);
    }
    async remove(id) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException('foydalanuvchi mavjud emas');
        }
        await this.userRepo.save({ ...user, isDeleted: 1 });
        return new apiRespons_1.ApiResponse(`foydalanuvchi o'chirildi`);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map