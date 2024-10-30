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
exports.ShartnomaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const shartnoma_entity_1 = require("./entities/shartnoma.entity");
const typeorm_2 = require("typeorm");
const apiRespons_1 = require("../../helpers/apiRespons");
const pagination_1 = require("../../helpers/pagination");
const user_entity_1 = require("../user/entities/user.entity");
const enum_1 = require("../../helpers/enum");
const income_entity_1 = require("../income/entities/income.entity");
const service_entity_1 = require("../service/entities/service.entity");
const monthly_fee_entity_1 = require("../monthly_fee/entities/monthly_fee.entity");
let ShartnomaService = class ShartnomaService {
    constructor(shartnomeRepo, userRepo, incomeRepo, serviceRepo, monthlyFeeRepo) {
        this.shartnomeRepo = shartnomeRepo;
        this.userRepo = userRepo;
        this.incomeRepo = incomeRepo;
        this.serviceRepo = serviceRepo;
        this.monthlyFeeRepo = monthlyFeeRepo;
    }
    async create(createShartnomaDto, userId) {
        const newShartnoma = this.shartnomeRepo.create(createShartnomaDto);
        newShartnoma.whoCreated = userId.toString();
        const user = await this.userRepo.findOneBy({
            id: +createShartnomaDto.user_id,
        });
        if (!user) {
            throw new common_1.NotFoundException('user_id mavjud emas');
        }
        newShartnoma.user = user;
        const shartnomaOld = await this.shartnomeRepo.find({
            order: { id: 'DESC' },
        });
        if (new Date(shartnomaOld[0]?.sana).getFullYear() !== new Date().getFullYear()) {
            newShartnoma.shartnoma_id = 1;
        }
        else {
            newShartnoma.shartnoma_id = shartnomaOld[0].shartnoma_id + 1;
        }
        newShartnoma.shartnoma_nomer = `${new Date(newShartnoma?.sana).getFullYear()}/${user.id}/${shartnomaOld[0]?.shartnoma_id || 1}`;
        const service = await this.serviceRepo.findOneBy({
            id: +createShartnomaDto.service_id,
        });
        if (!service) {
            throw new common_1.NotFoundException('service_id mavjud emas');
        }
        newShartnoma.service = service;
        const { advancePayment, count } = createShartnomaDto;
        newShartnoma.remainingPayment =
            service.price * count - (advancePayment || 0);
        newShartnoma.purchase_status =
            advancePayment && advancePayment >= service.price * count
                ? enum_1.EnumShartnomaPaid.paid
                : enum_1.EnumShartnomaPaid.no_paid;
        if (newShartnoma.shartnoma_turi === enum_1.EnumShartnoma.subscription_fee) {
            const startDate = new Date(createShartnomaDto.texnik_muddati);
            const endDate = new Date();
            const monthlyFees = [];
            const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
            const remainingDays = daysInMonth - startDate.getDate() + 1;
            const initialAmount = (remainingDays / daysInMonth) *
                newShartnoma.service.price *
                newShartnoma.count;
            monthlyFees.push({
                date: startDate,
                shartnoma_id: newShartnoma.id,
                amount: Math.floor(initialAmount),
            });
            let currentMonth = startDate.getMonth() + 2;
            let currentYear = startDate.getFullYear();
            while (currentYear < endDate.getFullYear() ||
                (currentYear === endDate.getFullYear() &&
                    currentMonth <= endDate.getMonth())) {
                const monthlyFeeDate = new Date(currentYear, currentMonth, 1);
                const feeExists = monthlyFees.some((fee) => fee.date.getMonth() === monthlyFeeDate.getMonth() &&
                    fee.date.getFullYear() === monthlyFeeDate.getFullYear());
                if (!feeExists) {
                    const newMonthlyFee = {
                        date: monthlyFeeDate,
                        shartnoma_id: newShartnoma.id,
                        amount: Math.floor(newShartnoma.service.price * newShartnoma.count),
                    };
                    monthlyFees.push(newMonthlyFee);
                }
                currentMonth += 1;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear += 1;
                }
            }
            await this.monthlyFeeRepo.save(monthlyFees);
            newShartnoma.monthlyFee = monthlyFees;
            console.log(newShartnoma.monthlyFee);
        }
        else {
            const newIncome = {
                amount: createShartnomaDto.advancePayment || 0,
                payment_method: createShartnomaDto.paymentMethod ||
                    enum_1.EnumShartnomeTpeTranslation.cash,
                is_paid: 'paid',
                shartnome_id: newShartnoma.id,
                date: new Date(),
                user: user,
                whoCreated: userId.toString(),
            };
            const income = await this.incomeRepo.save(newIncome);
            newShartnoma.income = [income];
        }
        await this.shartnomeRepo.save(newShartnoma);
        return new apiRespons_1.ApiResponse('shartnoma created', 201);
    }
    async findAll({ page, limit, search, filter }) {
        const totalItems = await this.shartnomeRepo.count({
            where: { isDeleted: 0 },
        });
        const pagination = new pagination_1.Pagination(totalItems, page, limit);
        const shartnoma = await this.shartnomeRepo
            .createQueryBuilder('shartnoma')
            .where('shartnoma.isDeleted = :isDeleted', { isDeleted: 0 })
            .leftJoinAndSelect('shartnoma.user', 'user')
            .leftJoinAndSelect('shartnoma.service', 'service', 'service.isDeleted = :isDeleted', { isDeleted: 0 })
            .andWhere(new typeorm_2.Brackets((qb) => {
            qb.where('user.F_I_O LIKE :F_I_O', {
                F_I_O: `%${search || ''}%`,
            }).orWhere('CAST(user.phone AS CHAR) LIKE :phone', {
                phone: `%${search || ''}%`,
            });
        }))
            .orderBy('shartnoma.tolash_sana', filter || 'ASC')
            .take(limit)
            .skip(((page - 1) * limit) | 0)
            .getMany();
        return new apiRespons_1.ApiResponse(shartnoma, 200, pagination);
    }
    async findOne(id) {
        const shartnoma = await this.shartnomeRepo
            .createQueryBuilder('shartnoma')
            .leftJoinAndSelect('shartnoma.income', 'income', 'income.isDeleted = :isDeleted', { isDeleted: 0 })
            .leftJoinAndSelect('shartnoma.service', 'service', 'service.isDeleted = :isDeleted', { isDeleted: 0 })
            .leftJoinAndSelect('shartnoma.user', 'user', 'user.isDeleted = :isDeleted', { isDeleted: 0 })
            .leftJoinAndSelect('shartnoma.monthlyFee', 'monthlyFee', 'monthlyFee.isDeleted = :isDeleted', { isDeleted: 0 })
            .where('shartnoma.id = :id', { id })
            .andWhere('shartnoma.isDeleted = :isDeleted', { isDeleted: 0 })
            .orderBy('monthlyFee.date', 'ASC')
            .getOne();
        if (!shartnoma) {
            throw new common_1.NotFoundException('shartnoma mavjud emas');
        }
        return new apiRespons_1.ApiResponse(shartnoma, 200);
    }
    async update(id, updateShartnomeDto, userId) {
        const shartnoma = await this.shartnomeRepo.findOne({
            where: { id, isDeleted: 0 },
            relations: ['income', 'user', 'service'],
        });
        if (!shartnoma && shartnoma.isDeleted) {
            throw new common_1.NotFoundException('shartnoma mavjud emas');
        }
        Object.assign(shartnoma, updateShartnomeDto);
        if (!!updateShartnomeDto.user_id) {
            const user = await this.userRepo.findOneBy({
                id: +updateShartnomeDto.user_id,
            });
            if (!user) {
                throw new common_1.NotFoundException('user_id mavjud emas');
            }
            shartnoma.user = user;
        }
        if (!!updateShartnomeDto.service_id) {
            const service = await this.serviceRepo.findOneBy({
                id: +updateShartnomeDto.service_id,
            });
            if (!service) {
                throw new common_1.NotFoundException('service_id mavjud emas');
            }
            shartnoma.service = service;
        }
        if (updateShartnomeDto.advancePayment) {
            shartnoma.remainingPayment =
                shartnoma.service.price * shartnoma.count -
                    updateShartnomeDto.advancePayment;
            shartnoma.purchase_status =
                shartnoma.remainingPayment <= 0
                    ? enum_1.EnumShartnomaPaid.paid
                    : enum_1.EnumShartnomaPaid.no_paid;
        }
        if (updateShartnomeDto.advancePayment && updateShartnomeDto.paymentMethod) {
            const newIncome = {
                amount: shartnoma.advancePayment || 0,
                payment_method: shartnoma.paymentMethod,
                is_paid: 'paid',
                date: new Date(),
                user: shartnoma.user,
                shartnoma: shartnoma,
                whoCreated: userId.toString(),
            };
            const income = await this.incomeRepo.save(newIncome);
            shartnoma.income = [...shartnoma.income, income];
        }
        shartnoma.whoUpdated = userId.toString();
        await this.shartnomeRepo.save(shartnoma);
        return new apiRespons_1.ApiResponse(`shartnoma o'gartirildi`, 201);
    }
    async remove(id) {
        const shartnoma = await this.shartnomeRepo.findOneBy({ id });
        if (!shartnoma) {
            throw new common_1.NotFoundException('shartnoma mavjud emas');
        }
        await this.shartnomeRepo.save({ ...shartnoma, isDeleted: 1 });
        return new apiRespons_1.ApiResponse(`shartnoma o'chirildi`);
    }
};
exports.ShartnomaService = ShartnomaService;
exports.ShartnomaService = ShartnomaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shartnoma_entity_1.Shartnoma)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(income_entity_1.Income)),
    __param(3, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __param(4, (0, typeorm_1.InjectRepository)(monthly_fee_entity_1.MonthlyFee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ShartnomaService);
//# sourceMappingURL=shartnoma.service.js.map