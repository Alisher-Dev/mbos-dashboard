import { Pagination } from './pagination';

export class ApiResponse {
  data: any;
  status: number;
  pagination?: Pagination;
  date: Date;

  constructor(data: any, status?: number, pagination?: Pagination) {
    this.data = data;
    this.status = status || 200;
    this.pagination = pagination || null;
    this.date = new Date();
  }
}
