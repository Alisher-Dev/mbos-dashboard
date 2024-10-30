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
exports.ServiceController = void 0;
const common_1 = require("@nestjs/common");
const service_service_1 = require("./service.service");
const create_service_dto_1 = require("./dto/create-service.dto");
const update_service_dto_1 = require("./dto/update-service.dto");
const swagger_1 = require("@nestjs/swagger");
const authGuard_1 = require("../../helpers/authGuard");
let ServiceController = class ServiceController {
    constructor(serviceService) {
        this.serviceService = serviceService;
    }
    create(createServiceDto, req) {
        return this.serviceService.create(createServiceDto, req.userId);
    }
    findAll(query) {
        return this.serviceService.findAll(query);
    }
    findOne(id) {
        return this.serviceService.findOne(+id);
    }
    update(id, updateServiceDto, req) {
        return this.serviceService.update(+id, updateServiceDto, req.userId);
    }
    remove(id) {
        return this.serviceService.remove(+id);
    }
};
exports.ServiceController = ServiceController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_dto_1.CreateServiceDto, Object]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_dto_1.UpdateServiceDto, Object]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "remove", null);
exports.ServiceController = ServiceController = __decorate([
    (0, common_1.Controller)('service'),
    (0, swagger_1.ApiTags)('service'),
    __metadata("design:paramtypes", [service_service_1.ServiceService])
], ServiceController);
//# sourceMappingURL=service.controller.js.map