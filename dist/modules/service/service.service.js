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
exports.ServiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const apiRespons_1 = require("../../helpers/apiRespons");
const pagination_1 = require("../../helpers/pagination");
const service_entity_1 = require("./entities/service.entity");
const enum_1 = require("../../helpers/enum");
let ServiceService = class ServiceService {
    constructor(serviceRepo) {
        this.serviceRepo = serviceRepo;
    }
    async create(createServiceDto, userId) {
        const newService = this.serviceRepo.create(createServiceDto);
        newService.whoCreated = userId.toString();
        await this.serviceRepo.save(newService);
        return new apiRespons_1.ApiResponse('service yaratildi', 201);
    }
    async findAll({ page, limit, search, type }) {
        const totalItems = await this.serviceRepo.count({
            where: {
                isDeleted: 0,
                ...(search && { title: (0, typeorm_2.Like)(`%${search}%`) }),
                ...(type !== enum_1.EnumServiceType.other && {
                    serviceType: type || enum_1.EnumServiceType.service,
                }),
            },
        });
        const pagination = new pagination_1.Pagination(totalItems, page, limit);
        const service = await this.serviceRepo.find({
            where: {
                isDeleted: 0,
                ...(search && { title: (0, typeorm_2.Like)(`%${search}%`) }),
                ...(type !== enum_1.EnumServiceType.other && {
                    serviceType: type || enum_1.EnumServiceType.service,
                }),
            },
            skip: pagination.offset,
            take: pagination.limit,
        });
        return new apiRespons_1.ApiResponse(service, 200, pagination);
    }
    async findOne(id) {
        const service = await this.serviceRepo
            .createQueryBuilder('service')
            .where('service.id = :id', { id })
            .andWhere('service.isDeleted = :isDeleted', { isDeleted: 0 })
            .leftJoinAndSelect('service.shartnoma', 'shartnoma', 'shartnoma.isDeleted = :isDeleted', { isDeleted: 0 })
            .getOne();
        if (!service) {
            throw new common_1.NotFoundException('service mavjud emas');
        }
        return new apiRespons_1.ApiResponse(service, 200);
    }
    async update(id, updateServiceDto, userId) {
        const service = await this.serviceRepo.findOne({
            where: { id, isDeleted: 0 },
            relations: ['shartnoma'],
        });
        if (!service && service.isDeleted) {
            throw new common_1.NotFoundException('service mavjud emas');
        }
        Object.assign(service, updateServiceDto);
        service.whoUpdated = userId.toString();
        await this.serviceRepo.save(service);
        return new apiRespons_1.ApiResponse(`service o'gartirildi`, 201);
    }
    async remove(id) {
        const service = await this.serviceRepo.findOneBy({ id });
        if (!service) {
            throw new common_1.NotFoundException('service mavjud emas');
        }
        await this.serviceRepo.save({ ...service, isDeleted: 1 });
        return new apiRespons_1.ApiResponse(`service o'chirildi`);
    }
};
exports.ServiceService = ServiceService;
exports.ServiceService = ServiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServiceService);
//# sourceMappingURL=service.service.js.map