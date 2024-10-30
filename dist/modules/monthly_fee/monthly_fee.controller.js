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
exports.MonthlyFeeController = void 0;
const common_1 = require("@nestjs/common");
const monthly_fee_service_1 = require("./monthly_fee.service");
const create_monthly_fee_dto_1 = require("./dto/create-monthly_fee.dto");
const update_monthly_fee_dto_1 = require("./dto/update-monthly_fee.dto");
const authGuard_1 = require("../../helpers/authGuard");
const swagger_1 = require("@nestjs/swagger");
let MonthlyFeeController = class MonthlyFeeController {
    constructor(monthlyFeeService) {
        this.monthlyFeeService = monthlyFeeService;
    }
    create(createMonthlyFeeDto, req) {
        return this.monthlyFeeService.create(createMonthlyFeeDto, req.userId);
    }
    Find() {
        return this.monthlyFeeService.updateOrCreateMonthlyFees();
    }
    findAll(query) {
        return this.monthlyFeeService.findAll(query);
    }
    update(id, updateMonthlyFeeDto, req) {
        return this.monthlyFeeService.update(+id, updateMonthlyFeeDto, req.userId);
    }
    remove(id) {
        return this.monthlyFeeService.remove(+id);
    }
};
exports.MonthlyFeeController = MonthlyFeeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_monthly_fee_dto_1.CreateMonthlyFeeDto, Object]),
    __metadata("design:returntype", void 0)
], MonthlyFeeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MonthlyFeeController.prototype, "Find", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MonthlyFeeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_monthly_fee_dto_1.UpdateMonthlyFeeDto, Object]),
    __metadata("design:returntype", void 0)
], MonthlyFeeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MonthlyFeeController.prototype, "remove", null);
exports.MonthlyFeeController = MonthlyFeeController = __decorate([
    (0, common_1.Controller)('monthly-fee'),
    (0, swagger_1.ApiTags)('monthly-fee'),
    __metadata("design:paramtypes", [monthly_fee_service_1.MonthlyFeeService])
], MonthlyFeeController);
//# sourceMappingURL=monthly_fee.controller.js.map