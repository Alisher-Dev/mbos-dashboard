import { Request } from 'express';

export interface FindAllQuery {
  page?: number;
  limit?: number;
}

export interface IPayload {
  userId: number;
}

export interface IRequest extends Request {
  userId: number;
}
