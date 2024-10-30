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
exports.Shartnoma = void 0;
const enum_1 = require("../../../helpers/enum");
const root_entity_1 = require("../../../helpers/root.entity");
const income_entity_1 = require("../../income/entities/income.entity");
const monthly_fee_entity_1 = require("../../monthly_fee/entities/monthly_fee.entity");
const service_entity_1 = require("../../service/entities/service.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let Shartnoma = class Shartnoma extends root_entity_1.RootEntity {
};
exports.Shartnoma = Shartnoma;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Shartnoma.prototype, "shartnoma_nomer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Shartnoma.prototype, "shartnoma_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Shartnoma.prototype, "sana", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Shartnoma.prototype, "count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enum_1.EnumShartnoma, default: enum_1.EnumShartnoma.one_bay }),
    __metadata("design:type", String)
], Shartnoma.prototype, "shartnoma_turi", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.EnumShartnomaPaid,
        default: enum_1.EnumShartnomaPaid.no_paid,
    }),
    __metadata("design:type", String)
], Shartnoma.prototype, "purchase_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], Shartnoma.prototype, "advancePayment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], Shartnoma.prototype, "remainingPayment", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.EnumShartnomeTpeTranslation,
        default: enum_1.EnumShartnomeTpeTranslation.cash,
    }),
    __metadata("design:type", String)
], Shartnoma.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Shartnoma.prototype, "shartnoma_muddati", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Shartnoma.prototype, "texnik_muddati", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Shartnoma.prototype, "izoh", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Shartnoma.prototype, "tolash_sana", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.shartnome, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Shartnoma.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => income_entity_1.Income, (income) => income.shartnoma, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Shartnoma.prototype, "income", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => monthly_fee_entity_1.MonthlyFee, (monthlyFee) => monthlyFee.shartnoma, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Shartnoma.prototype, "monthlyFee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_entity_1.Service, (service) => service.shartnoma, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", service_entity_1.Service)
], Shartnoma.prototype, "service", void 0);
exports.Shartnoma = Shartnoma = __decorate([
    (0, typeorm_1.Entity)()
], Shartnoma);
//# sourceMappingURL=shartnoma.entity.js.map