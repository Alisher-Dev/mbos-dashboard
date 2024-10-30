"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
class Pagination {
    constructor(totalItems, page, limit) {
        this.page = Number(page) || 1;
        this.limit = Number(limit) || 15;
        this.totalItems = totalItems;
        this.offset = (this.page - 1) * this.limit;
        this.totalPages = Math.ceil(this.totalItems / this.limit);
    }
}
exports.Pagination = Pagination;
//# sourceMappingURL=pagination.js.map