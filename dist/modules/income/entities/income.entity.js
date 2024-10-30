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
exports.Income = void 0;
const enum_1 = require("../../../helpers/enum");
const root_entity_1 = require("../../../helpers/root.entity");
const shartnoma_entity_1 = require("../../shartnoma/entities/shartnoma.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let Income = class Income extends root_entity_1.RootEntity {
};
exports.Income = Income;
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Income.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Income.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enum_1.EnumIncamIsPaid }),
    __metadata("design:type", String)
], Income.prototype, "is_paid", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enum_1.EnumIncamTpeTranslation,
        default: enum_1.EnumIncamTpeTranslation.cash,
    }),
    __metadata("design:type", String)
], Income.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Income.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shartnoma_entity_1.Shartnoma, (shartnoma) => shartnoma.income, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", shartnoma_entity_1.Shartnoma)
], Income.prototype, "shartnoma", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.income, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Income.prototype, "user", void 0);
exports.Income = Income = __decorate([
    (0, typeorm_1.Entity)()
], Income);
//# sourceMappingURL=income.entity.js.map