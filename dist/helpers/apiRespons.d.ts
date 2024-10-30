import { Pagination } from './pagination';
export declare class ApiResponse {
    data: any;
    status: number;
    pagination?: Pagination;
    date: Date;
    constructor(data: any, status?: number, pagination?: Pagination);
}
