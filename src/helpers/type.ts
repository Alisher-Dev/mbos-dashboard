import { Request } from 'express';
import { EnumServiceType } from './enum';

export interface FindAllQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: EnumServiceType;
}

export interface IPayload {
  userId: number;
}

export interface IRequest extends Request {
  userId: number;
}
