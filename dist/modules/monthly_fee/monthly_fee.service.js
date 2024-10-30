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
exports.MonthlyFeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const shartnoma_entity_1 = require("../shartnoma/entities/shartnoma.entity");
const schedule_1 = require("@nestjs/schedule");
const typeorm_2 = require("typeorm");
const monthly_fee_entity_1 = require("./entities/monthly_fee.entity");
const apiRespons_1 = require("../../helpers/apiRespons");
const pagination_1 = require("../../helpers/pagination");
const enum_1 = require("../../helpers/enum");
const income_entity_1 = require("../income/entities/income.entity");
let MonthlyFeeService = class MonthlyFeeService {
    constructor(shartnomaRepo, monthlyFeeRepo, incomeRepo) {
        this.shartnomaRepo = shartnomaRepo;
        this.monthlyFeeRepo = monthlyFeeRepo;
        this.incomeRepo = incomeRepo;
    }
    async create(monthlyFeeDto, userId) {
        const newMonthlyFee = this.monthlyFeeRepo.create(monthlyFeeDto);
        newMonthlyFee.whoCreated = userId.toString();
        newMonthlyFee.date = new Date(monthlyFeeDto.date);
        const shartnoma = await this.shartnomaRepo.findOne({
            where: { id: monthlyFeeDto.shartnoma_id },
        });
        if (!shartnoma) {
            throw new common_1.NotFoundException('shartnoma not found');
        }
        newMonthlyFee.shartnoma = shartnoma;
        await this.monthlyFeeRepo.save(newMonthlyFee);
        return new apiRespons_1.ApiResponse('monthlyFee created', 201);
    }
    async findAll({ page, limit }) {
        const totalItems = await this.monthlyFeeRepo.count({
            where: {
                isDeleted: 0,
            },
        });
        const pagination = new pagination_1.Pagination(totalItems, page, limit);
        const monthlyFee = await this.monthlyFeeRepo.find({
            where: {
                isDeleted: 0,
            },
            skip: pagination.offset,
            take: pagination.limit,
        });
        return new apiRespons_1.ApiResponse(monthlyFee, 200, pagination);
    }
    async updateOrCreateMonthlyFees() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        if (today.getDate() >= 28) {
            const allShartnoma = await this.shartnomaRepo.find({
                where: { isDeleted: 0, shartnoma_turi: enum_1.EnumShartnoma.subscription_fee },
                relations: ['monthlyFee', 'service'],
            });
            for (const shartnoma of allShartnoma) {
                if (shartnoma.shartnoma_muddati &&
                    new Date(shartnoma.shartnoma_muddati) < today) {
                    console.log(`Срок действия shartnoma с id = ${shartnoma.id} истек.`);
                    continue;
                }
                const nextMonth = new Date(currentYear, currentMonth + 1, 1);
                const existingMonthlyFee = shartnoma.monthlyFee.find((fee) => new Date(fee.date).getMonth() === nextMonth.getMonth() &&
                    new Date(fee.date).getFullYear() === nextMonth.getFullYear());
                if (!existingMonthlyFee) {
                    const newMonthlyFee = this.monthlyFeeRepo.create({
                        date: nextMonth,
                        shartnoma: shartnoma,
                        amount: Math.floor(+shartnoma.service.price * +shartnoma.count) || 0,
                    });
                    await this.monthlyFeeRepo.save(newMonthlyFee);
                    console.log(`Создан новый monthlyFee для shartnoma с id = ${shartnoma.id}`);
                }
                else {
                    console.log(`Запись monthlyFee за следующий месяц уже существует для shartnoma с id = ${shartnoma.id}`);
                }
            }
        }
        else {
            console.log('Запрос не выполняется, так как сегодня меньше 28 числа.');
        }
    }
    async update(id, updateMonthlyFeeDto, userId) {
        const monthlyFee = await this.monthlyFeeRepo.findOne({
            where: { id, isDeleted: 0 },
            relations: ['shartnoma'],
        });
        if (!monthlyFee) {
            throw new common_1.NotFoundException('monthlyFee not found');
        }
        monthlyFee.whoUpdated = userId.toString();
        Object.assign(monthlyFee, updateMonthlyFeeDto);
        if (monthlyFee.paid >= monthlyFee.amount) {
            const newIncome = this.incomeRepo.create({
                amount: monthlyFee.paid,
                payment_method: enum_1.EnumIncamTpeTranslation.other,
                is_paid: enum_1.EnumIncamIsPaid.paid,
                shartnoma: monthlyFee.shartnoma,
                date: new Date(),
                user: monthlyFee.shartnoma.user,
            });
            if (!newIncome) {
                throw new common_1.NotFoundException('user not found');
            }
            await this.incomeRepo.save(newIncome);
        }
        await this.monthlyFeeRepo.save(monthlyFee);
        return new apiRespons_1.ApiResponse('monthlyFee yangilandi', 201);
    }
    async remove(id) {
        const monthlyFee = await this.monthlyFeeRepo.findOneBy({ id });
        if (!monthlyFee) {
            throw new common_1.NotFoundException('monthlyFee mavjud emas');
        }
        await this.monthlyFeeRepo.save({ ...monthlyFee, isDeleted: 1 });
        return new apiRespons_1.ApiResponse("monthlyFee o'chirildi");
    }
};
exports.MonthlyFeeService = MonthlyFeeService;
__decorate([
    (0, schedule_1.Cron)('0 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MonthlyFeeService.prototype, "updateOrCreateMonthlyFees", null);
exports.MonthlyFeeService = MonthlyFeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shartnoma_entity_1.Shartnoma)),
    __param(1, (0, typeorm_1.InjectRepository)(monthly_fee_entity_1.MonthlyFee)),
    __param(2, (0, typeorm_1.InjectRepository)(income_entity_1.Income)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MonthlyFeeService);
//# sourceMappingURL=monthly_fee.service.js.map