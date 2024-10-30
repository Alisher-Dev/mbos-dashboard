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
exports.ShartnomaController = void 0;
const common_1 = require("@nestjs/common");
const shartnoma_service_1 = require("./shartnoma.service");
const create_shartnoma_dto_1 = require("./dto/create-shartnoma.dto");
const update_shartnoma_dto_1 = require("./dto/update-shartnoma.dto");
const swagger_1 = require("@nestjs/swagger");
const authGuard_1 = require("../../helpers/authGuard");
let ShartnomaController = class ShartnomaController {
    constructor(shartnomaService) {
        this.shartnomaService = shartnomaService;
    }
    create(createShartnomaDto, req) {
        return this.shartnomaService.create(createShartnomaDto, req.userId);
    }
    findAll(query) {
        return this.shartnomaService.findAll(query);
    }
    findOne(id) {
        return this.shartnomaService.findOne(+id);
    }
    update(id, updateShartnomaDto, req) {
        return this.shartnomaService.update(+id, updateShartnomaDto, req.userId);
    }
    remove(id) {
        return this.shartnomaService.remove(+id);
    }
};
exports.ShartnomaController = ShartnomaController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_shartnoma_dto_1.CreateShartnomaDto, Object]),
    __metadata("design:returntype", void 0)
], ShartnomaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShartnomaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShartnomaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_shartnoma_dto_1.UpdateShartnomaDto, Object]),
    __metadata("design:returntype", void 0)
], ShartnomaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(authGuard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShartnomaController.prototype, "remove", null);
exports.ShartnomaController = ShartnomaController = __decorate([
    (0, common_1.Controller)('shartnoma'),
    (0, swagger_1.ApiTags)('shartnoma'),
    (0, swagger_1.ApiBearerAuth)('accessToken'),
    __metadata("design:paramtypes", [shartnoma_service_1.ShartnomaService])
], ShartnomaController);
//# sourceMappingURL=shartnoma.controller.js.map