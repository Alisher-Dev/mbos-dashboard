import { Request } from 'express';

export interface FindAllQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IPayload {
  userId: number;
}

export interface IRequest extends Request {
  userId: number;
}
