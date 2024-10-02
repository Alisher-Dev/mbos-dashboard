export class Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  offset: number;

  constructor(
    totalItems: number,
    page?: number | string,
    limit?: number | string,
  ) {
    this.page = Number(page) || 1;
    this.limit = Number(limit) || 15;
    this.totalItems = totalItems;
    this.offset = (this.page - 1) * this.limit;
    this.totalPages = Math.ceil(this.totalItems / this.limit);
  }
}
