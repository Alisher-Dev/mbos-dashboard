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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const income_entity_1 = require("../income/entities/income.entity");
const enum_1 = require("../../helpers/enum");
const apiRespons_1 = require("../../helpers/apiRespons");
const shartnoma_entity_1 = require("../shartnoma/entities/shartnoma.entity");
const service_entity_1 = require("../service/entities/service.entity");
let DashboardService = class DashboardService {
    constructor(userRepo, incomeRepo, shartnomaRepo, serviceRepo) {
        this.userRepo = userRepo;
        this.incomeRepo = incomeRepo;
        this.shartnomaRepo = shartnomaRepo;
        this.serviceRepo = serviceRepo;
    }
    async find() {
        const usersCount = await this.userRepo.count({ where: { isDeleted: 0 } });
        const income = await this.incomeRepo
            .createQueryBuilder('income')
            .select('SUM(income.amount)', 'total')
            .where('income.is_paid = :isPaid', { isPaid: enum_1.EnumIncamIsPaid.paid })
            .andWhere('income.isDeleted = :isDeleted', { isDeleted: 0 })
            .getRawOne();
        const confirm = await this.incomeRepo
            .createQueryBuilder('income')
            .select('SUM(income.amount)', 'total')
            .where('income.is_paid = :isPaid', {
            isPaid: enum_1.EnumIncamIsPaid.confirm_payment,
        })
            .andWhere('income.isDeleted = :isDeleted', { isDeleted: 0 })
            .getRawOne();
        const expend = await this.incomeRepo
            .createQueryBuilder('income')
            .select('SUM(income.amount)', 'total')
            .where('income.is_paid = :isPaid', { isPaid: enum_1.EnumIncamIsPaid.no_paid })
            .andWhere('income.isDeleted = :isDeleted', { isDeleted: 0 })
            .getRawOne();
        const recentContract = await this.shartnomaRepo.find({
            relations: ['user', 'service'],
            where: {
                user: { isDeleted: 0 },
                service: { isDeleted: 0 },
                isDeleted: 0,
            },
        });
        return new apiRespons_1.ApiResponse({
            usersCount,
            income: income?.total || 0,
            expend: expend?.total || 0,
            confirm: confirm?.total || 0,
            recentContract: recentContract.slice(0, 5),
        });
    }
    async findIncome() {
        const cash = await this.incomeRepo
            .createQueryBuilder('tushum')
            .select('SUM(tushum.amount)', 'total')
            .where('tushum.is_paid = :paid', { paid: enum_1.EnumIncamIsPaid.paid })
            .andWhere('tushum.payment_method = :method', { method: 'cash' })
            .andWhere('tushum.isDeleted = :isDeleted', { isDeleted: 0 })
            .getRawOne();
        const translation = await this.incomeRepo
            .createQueryBuilder('tushum')
            .select('SUM(tushum.amount)', 'total')
            .where('tushum.is_paid = :paid', { paid: enum_1.EnumIncamIsPaid.paid })
            .andWhere('tushum.payment_method = :method', { method: 'translation' })
            .andWhere('tushum.isDeleted = :isDeleted', { isDeleted: 0 })
            .getRawOne();
        const online = await this.incomeRepo
            .createQueryBuilder('tushum')
            .select('SUM(tushum.amount)', 'total')
            .where('tushum.is_paid = :paid', { paid: enum_1.EnumIncamIsPaid.paid })
            .andWhere('tushum.payment_method = :method', { method: 'online' })
            .andWhere('tushum.isDeleted = :isDeleted', { isDeleted: 0 })
            .getRawOne();
        const otherTushum = await this.incomeRepo
            .createQueryBuilder('tushum')
            .select('SUM(tushum.amount)', 'total')
            .where('tushum.is_paid = :paid', { paid: enum_1.EnumIncamIsPaid.paid })
            .andWhere('tushum.payment_method = :method', { method: 'other' })
            .andWhere('tushum.isDeleted = :isDeleted', { isDeleted: 0 })
            .getRawOne();
        const salary = await this.incomeRepo
            .createQueryBuilder('chikim')
            .select('SUM(chikim.amount)', 'total')
            .where('chikim.is_paid = :paid', { paid: enum_1.EnumIncamIsPaid.no_paid })
            .andWhere('chikim.payment_method = :method', { method: 'salary' })
            .andWhere('chikim.isDeleted = :isDeleted', { isDeleted: 0 })
            .getRawOne();
        const delivery = await this.incomeRepo
            .createQueryBuilder('chikim')
            .select('SUM(chikim.amount)', 'total')
            .where('chikim.is_paid = :paid', { paid: enum_1.EnumIncamIsPaid.no_paid })
            .andWhere('chikim.payment_method = :method', { method: 'delivery' })
            .andWhere('chikim.isDeleted = :isDeleted', { isDeleted: 0 })
            .getRawOne();
        const otherChikim = await this.incomeRepo
            .createQueryBuilder('chikim')
            .select('SUM(chikim.amount)', 'total')
            .where('chikim.is_paid = :paid', { paid: enum_1.EnumIncamIsPaid.no_paid })
            .andWhere('chikim.payment_method = :method', { method: 'other' })
            .andWhere('chikim.isDeleted = :isDeleted', { isDeleted: 0 })
            .getRawOne();
        const confirm = await this.incomeRepo
            .createQueryBuilder('income')
            .select('SUM(income.amount)', 'total')
            .where('income.is_paid = :isPaid', {
            isPaid: enum_1.EnumIncamIsPaid.confirm_payment,
        })
            .andWhere('income.isDeleted = :isDeleted', { isDeleted: 0 })
            .getRawOne();
        return new apiRespons_1.ApiResponse({
            tushum: {
                cash: cash.total || 0,
                translation: translation.total || 0,
                online: online.total || 0,
                other: otherTushum.total || 0,
            },
            chikim: {
                salary: salary.total || 0,
                delivery: delivery.total || 0,
                other: otherChikim.total || 0,
            },
            confirm,
        });
    }
    async findStatstik() {
        const stats = await this.incomeRepo
            .createQueryBuilder('income')
            .select("TO_CHAR(income.created_at, 'YYYY-MM')", 'date')
            .addSelect('SUM(CASE WHEN income.is_paid = :paid THEN income.amount ELSE 0 END)', 'tushum')
            .addSelect('SUM(CASE WHEN income.is_paid = :no_paid THEN income.amount ELSE 0 END)', 'chikim')
            .setParameters({
            paid: enum_1.EnumIncamIsPaid.paid,
            no_paid: enum_1.EnumIncamIsPaid.no_paid,
        })
            .where('income.isDeleted = :isDeleted', { isDeleted: 0 })
            .groupBy("TO_CHAR(income.created_at, 'YYYY-MM')")
            .orderBy("TO_CHAR(income.created_at, 'YYYY-MM')", 'ASC')
            .getRawMany();
        return new apiRespons_1.ApiResponse(stats);
    }
    async findServiceDash(id) {
        const servicesTugallangan = await this.serviceRepo
            .createQueryBuilder('service')
            .leftJoinAndSelect('service.shartnoma', 'shartnoma')
            .where('service.id = :id', { id })
            .andWhere('shartnoma.purchase_status = :purchase_status', {
            purchase_status: enum_1.EnumShartnomaPaid.paid,
        })
            .andWhere('service.isDeleted = :isDeleted', { isDeleted: 0 })
            .getOne();
        const servicesJarayondagi = await this.serviceRepo
            .createQueryBuilder('service')
            .leftJoinAndSelect('service.shartnoma', 'shartnoma')
            .where('service.id = :id', { id })
            .andWhere('shartnoma.purchase_status = :purchase_status', {
            purchase_status: enum_1.EnumShartnomaPaid.no_paid,
        })
            .andWhere('service.isDeleted = :isDeleted', { isDeleted: 0 })
            .getOne();
        const tugallanganCount = servicesTugallangan?.shartnoma?.reduce((total, shartnoma) => (total += shartnoma?.count), 0);
        const jarayondagiCount = servicesJarayondagi?.shartnoma?.reduce((total, shartnoma) => (total += shartnoma?.count), 0);
        const umumiyTushum = servicesTugallangan?.shartnoma
            ?.map((el) => el.count * servicesTugallangan.price)
            ?.reduce((total, amount) => total + amount, 0);
        const umumiyTushumCount = servicesTugallangan?.shartnoma
            ?.map((el) => el.count)
            ?.reduce((total, amount) => total + amount, 0);
        return new apiRespons_1.ApiResponse({
            tugallangan: servicesTugallangan?.shartnoma,
            tugallanganCount,
            jarayondagi: servicesJarayondagi?.shartnoma,
            jarayondagiCount,
            umumiyTushum,
            umumiyTushumCount,
        });
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(income_entity_1.Income)),
    __param(2, (0, typeorm_1.InjectRepository)(shartnoma_entity_1.Shartnoma)),
    __param(3, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map