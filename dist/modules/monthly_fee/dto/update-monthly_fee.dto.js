"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMonthlyFeeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_monthly_fee_dto_1 = require("./create-monthly_fee.dto");
class UpdateMonthlyFeeDto extends (0, swagger_1.PartialType)(create_monthly_fee_dto_1.CreateMonthlyFeeDto) {
}
exports.UpdateMonthlyFeeDto = UpdateMonthlyFeeDto;
//# sourceMappingURL=update-monthly_fee.dto.js.map