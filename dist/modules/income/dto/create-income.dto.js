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
exports.CreateIncomeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enum_1 = require("../../../helpers/enum");
class CreateIncomeDto {
}
exports.CreateIncomeDto = CreateIncomeDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateIncomeDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enum_1.EnumIncamTpeTranslation),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateIncomeDto.prototype, "payment_method", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enum_1.EnumIncamIsPaid),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateIncomeDto.prototype, "is_paid", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateIncomeDto.prototype, "shartnoma_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIncomeDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CreateIncomeDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateIncomeDto.prototype, "user_id", void 0);
//# sourceMappingURL=create-income.dto.js.map