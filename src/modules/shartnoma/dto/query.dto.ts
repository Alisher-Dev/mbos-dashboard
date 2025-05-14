import { IsOptional, IsString } from 'class-validator';

export class IShartnomaQueryDto {
  @IsString()
  @IsOptional()
  orderForMonth: 'ASC' | 'DESC';
}
