import { Request } from 'express';
import { EnumServiceType, EnumShartnomaPaid } from './enum';

export interface FindAllQuery {
  page?: number;
  limit?: number;
  search?: string;
  id?: number;
  isPaid?: EnumShartnomaPaid;
  type?: EnumServiceType;
  filter?: 'ASC' | 'DESC';
}

export interface IPayload {
  userId: number;
}

export interface IRequest extends Request {
  userId: number;
}
