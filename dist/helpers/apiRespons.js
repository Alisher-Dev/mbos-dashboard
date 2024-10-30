"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(data, status, pagination) {
        this.data = data;
        this.status = status || 200;
        this.pagination = pagination || null;
        this.date = new Date();
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=apiRespons.js.map