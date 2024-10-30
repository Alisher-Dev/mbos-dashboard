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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateShartnomaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enum_1 = require("../../../helpers/enum");
class CreateShartnomaDto {
}
exports.CreateShartnomaDto = CreateShartnomaDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "sana", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "shartnoma_nomer", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "whoCreated", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "whoUpdated", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateShartnomaDto.prototype, "isDeleted", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enum_1.EnumShartnoma),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "shartnoma_turi", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateShartnomaDto.prototype, "count", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enum_1.EnumShartnomaPaid),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "purchase_status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enum_1.EnumShartnomeTpeTranslation),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "service_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "shartnoma_muddati", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "texnik_muddati", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "tolash_sana", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateShartnomaDto.prototype, "izoh", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateShartnomaDto.prototype, "advancePayment", void 0);
//# sourceMappingURL=create-shartnoma.dto.js.map