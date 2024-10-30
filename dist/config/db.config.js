"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const env_config_1 = require("./env.config");
const user_entity_1 = require("../modules/user/entities/user.entity");
const shartnoma_entity_1 = require("../modules/shartnoma/entities/shartnoma.entity");
const income_entity_1 = require("../modules/income/entities/income.entity");
const admin_entity_1 = require("../modules/admin/entities/admin.entity");
const service_entity_1 = require("../modules/service/entities/service.entity");
const monthly_fee_entity_1 = require("../modules/monthly_fee/entities/monthly_fee.entity");
exports.dbConfig = {
    type: 'postgres',
    host: env_config_1.envConfig.database.host,
    port: env_config_1.envConfig.database.port,
    username: env_config_1.envConfig.database.user,
    password: env_config_1.envConfig.database.password,
    database: env_config_1.envConfig.database.name,
    entities: [user_entity_1.User, shartnoma_entity_1.Shartnoma, income_entity_1.Income, admin_entity_1.Admin, service_entity_1.Service, monthly_fee_entity_1.MonthlyFee],
    synchronize: true,
};
//# sourceMappingURL=db.config.js.map