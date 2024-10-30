"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const dashboard_controller_1 = require("./dashboard.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const income_entity_1 = require("../income/entities/income.entity");
const shartnoma_entity_1 = require("../shartnoma/entities/shartnoma.entity");
const service_entity_1 = require("../service/entities/service.entity");
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, income_entity_1.Income, shartnoma_entity_1.Shartnoma, service_entity_1.Service])],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService],
    })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map