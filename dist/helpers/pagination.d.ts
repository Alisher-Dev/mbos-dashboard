export declare class Pagination {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    offset: number;
    constructor(totalItems: number, page?: number | string, limit?: number | string);
}
