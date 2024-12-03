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

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  servicePaid_id: number;
}
