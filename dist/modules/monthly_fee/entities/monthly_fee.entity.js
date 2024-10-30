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
exports.MonthlyFee = void 0;
const root_entity_1 = require("../../../helpers/root.entity");
const shartnoma_entity_1 = require("../../shartnoma/entities/shartnoma.entity");
const typeorm_1 = require("typeorm");
let MonthlyFee = class MonthlyFee extends root_entity_1.RootEntity {
};
exports.MonthlyFee = MonthlyFee;
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric' }),
    __metadata("design:type", Number)
], MonthlyFee.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], MonthlyFee.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MonthlyFee.prototype, "paid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shartnoma_entity_1.Shartnoma, (shartnoma) => shartnoma.monthlyFee),
    __metadata("design:type", shartnoma_entity_1.Shartnoma)
], MonthlyFee.prototype, "shartnoma", void 0);
exports.MonthlyFee = MonthlyFee = __decorate([
    (0, typeorm_1.Entity)()
], MonthlyFee);
//# sourceMappingURL=monthly_fee.entity.js.map