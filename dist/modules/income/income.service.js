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
exports.IncomeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const income_entity_1 = require("./entities/income.entity");
const typeorm_2 = require("typeorm");
const apiRespons_1 = require("../../helpers/apiRespons");
const pagination_1 = require("../../helpers/pagination");
const enum_1 = require("../../helpers/enum");
const user_entity_1 = require("../user/entities/user.entity");
const shartnoma_entity_1 = require("../shartnoma/entities/shartnoma.entity");
let IncomeService = class IncomeService {
    constructor(incomeRepo, userRepo, shartnomaRepo) {
        this.incomeRepo = incomeRepo;
        this.userRepo = userRepo;
        this.shartnomaRepo = shartnomaRepo;
    }
    async create(createIncomeDto, userId) {
        const newIncome = this.incomeRepo.create(createIncomeDto);
        newIncome.whoCreated = userId.toString();
        newIncome.date = new Date(createIncomeDto.date);
        if (createIncomeDto.is_paid === enum_1.EnumIncamIsPaid.paid &&
            (createIncomeDto.payment_method === enum_1.EnumIncamTpeTranslation.salary ||
                createIncomeDto.payment_method === enum_1.EnumIncamTpeTranslation.delivery)) {
            throw new common_1.BadGatewayException("unaka income yarata o'lmaysiz");
        }
        else if (createIncomeDto.is_paid === enum_1.EnumIncamIsPaid.no_paid &&
            (createIncomeDto.payment_method === enum_1.EnumIncamTpeTranslation.cash ||
                createIncomeDto.payment_method === enum_1.EnumIncamTpeTranslation.online ||
                createIncomeDto.payment_method === enum_1.EnumIncamTpeTranslation.translation)) {
            throw new common_1.BadGatewayException("unaka income yarata o'lmaysiz");
        }
        else {
            createIncomeDto.is_paid === enum_1.EnumIncamIsPaid.confirm_payment;
        }
        if (!!createIncomeDto.user_id) {
            const user = await this.userRepo.findOneBy({
                id: createIncomeDto.user_id,
            });
            if (!user) {
                throw new common_1.NotFoundException('foydalanuvchi topilmadi');
            }
            newIncome.user = user;
        }
        if (!!createIncomeDto.shartnoma_id) {
            const shartnoma = await this.shartnomaRepo.findOneBy({
                id: createIncomeDto.shartnoma_id,
            });
            if (!shartnoma) {
                throw new common_1.NotFoundException('shartnoma topilmadi');
            }
            newIncome.shartnoma = shartnoma;
        }
        if (!!newIncome.amount && newIncome.is_paid === enum_1.EnumIncamIsPaid.paid) {
            await this.userRepo.save({
                balance: newIncome.amount.toString(),
            });
        }
        await this.incomeRepo.save(newIncome);
        return new apiRespons_1.ApiResponse('Income created', 201);
    }
    async findAll({ page, limit, search }) {
        const totalItems = await this.incomeRepo.count({
            where: {
                isDeleted: 0,
                ...(search && { user: { F_I_O: (0, typeorm_2.Like)(`%${search}%`) } }),
            },
        });
        const pagination = new pagination_1.Pagination(totalItems, page, limit);
        const incomes = await this.incomeRepo.find({
            where: {
                isDeleted: 0,
                ...(search && { user: { F_I_O: (0, typeorm_2.Like)(`%${search}%`) } }),
            },
            relations: ['user', 'shartnoma'],
            skip: pagination.offset,
            take: pagination.limit,
        });
        return new apiRespons_1.ApiResponse(incomes, 200, pagination);
    }
    async update(id, updateIncomeDto, userId) {
        const income = await this.incomeRepo.findOneBy({ id });
        income.whoUpdated = userId.toString();
        if (!income) {
            throw new common_1.NotFoundException('income mavjud emas');
        }
        if (updateIncomeDto.is_paid === enum_1.EnumIncamIsPaid.paid &&
            (updateIncomeDto.payment_method === enum_1.EnumIncamTpeTranslation.salary ||
                updateIncomeDto.payment_method === enum_1.EnumIncamTpeTranslation.delivery)) {
            throw new common_1.BadGatewayException("income o'zgartira o'lmaysiz");
        }
        else if (updateIncomeDto.is_paid === enum_1.EnumIncamIsPaid.no_paid &&
            (updateIncomeDto.payment_method === enum_1.EnumIncamTpeTranslation.cash ||
                updateIncomeDto.payment_method === enum_1.EnumIncamTpeTranslation.online ||
                updateIncomeDto.payment_method === enum_1.EnumIncamTpeTranslation.translation)) {
            throw new common_1.BadGatewayException("income o'zgartira o'lmaysiz");
        }
        else {
            updateIncomeDto.is_paid === enum_1.EnumIncamIsPaid.confirm_payment;
        }
        if (!!updateIncomeDto.user_id) {
            const user = await this.userRepo.findOneBy({
                id: updateIncomeDto.user_id,
            });
            if (!user) {
                throw new common_1.NotFoundException('foydalanuvchi topilmadi');
            }
            income.user = user;
        }
        if (!!updateIncomeDto.shartnoma_id) {
            const shartnoma = await this.shartnomaRepo.findOneBy({
                id: updateIncomeDto.shartnoma_id,
            });
            if (!shartnoma) {
                throw new common_1.NotFoundException('shartnoma topilmadi');
            }
            income.shartnoma = shartnoma;
        }
        Object.assign(income, updateIncomeDto);
        await this.incomeRepo.save(income);
        return new apiRespons_1.ApiResponse('Income yangilandi', 201);
    }
    async remove(id) {
        const income = await this.incomeRepo.findOneBy({ id });
        if (!income) {
            throw new common_1.NotFoundException('Income mavjud emas');
        }
        await this.incomeRepo.save({ ...income, isDeleted: 1 });
        return new apiRespons_1.ApiResponse("Income o'chirildi");
    }
};
exports.IncomeService = IncomeService;
exports.IncomeService = IncomeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(income_entity_1.Income)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(shartnoma_entity_1.Shartnoma)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], IncomeService);
//# sourceMappingURL=income.service.js.map