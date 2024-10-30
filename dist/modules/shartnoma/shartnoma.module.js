"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShartnomaModule = void 0;
const common_1 = require("@nestjs/common");
const shartnoma_service_1 = require("./shartnoma.service");
const shartnoma_controller_1 = require("./shartnoma.controller");
const typeorm_1 = require("@nestjs/typeorm");
const shartnoma_entity_1 = require("./entities/shartnoma.entity");
const user_entity_1 = require("../user/entities/user.entity");
const income_entity_1 = require("../income/entities/income.entity");
const service_entity_1 = require("../service/entities/service.entity");
const monthly_fee_entity_1 = require("../monthly_fee/entities/monthly_fee.entity");
let ShartnomaModule = class ShartnomaModule {
};
exports.ShartnomaModule = ShartnomaModule;
exports.ShartnomaModule = ShartnomaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([shartnoma_entity_1.Shartnoma, user_entity_1.User, income_entity_1.Income, service_entity_1.Service, monthly_fee_entity_1.MonthlyFee]),
        ],
        controllers: [shartnoma_controller_1.ShartnomaController],
        providers: [shartnoma_service_1.ShartnomaService],
    })
], ShartnomaModule);
//# sourceMappingURL=shartnoma.module.js.map