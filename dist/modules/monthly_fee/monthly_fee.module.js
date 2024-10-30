"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyFeeModule = void 0;
const common_1 = require("@nestjs/common");
const monthly_fee_service_1 = require("./monthly_fee.service");
const monthly_fee_controller_1 = require("./monthly_fee.controller");
const typeorm_1 = require("@nestjs/typeorm");
const shartnoma_entity_1 = require("../shartnoma/entities/shartnoma.entity");
const monthly_fee_entity_1 = require("./entities/monthly_fee.entity");
const income_entity_1 = require("../income/entities/income.entity");
let MonthlyFeeModule = class MonthlyFeeModule {
};
exports.MonthlyFeeModule = MonthlyFeeModule;
exports.MonthlyFeeModule = MonthlyFeeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([shartnoma_entity_1.Shartnoma, monthly_fee_entity_1.MonthlyFee, income_entity_1.Income])],
        controllers: [monthly_fee_controller_1.MonthlyFeeController],
        providers: [monthly_fee_service_1.MonthlyFeeService],
    })
], MonthlyFeeModule);
//# sourceMappingURL=monthly_fee.module.js.map