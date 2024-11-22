import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateServerDto {
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsString()
  plan: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsDateString()
  date_term: Date;

  @ApiProperty()
  @IsString()
  responsible: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  status: number;

  @ApiProperty()
  @IsNumber()
  register_id: number;

  @IsNumber()
  @ApiProperty()
  modify_id: number;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  servicePaid_id: number;
}
