import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsNumber } from 'class-validator';

export class CreateServerPaidDto {
  @IsNumber()
  @ApiProperty()
  server_id: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @IsDateString()
  @ApiProperty()
  date_term: Date;

  @IsDateString()
  @ApiProperty()
  ads: string;

  @IsNumber()
  @ApiProperty()
  status: number;

  @IsNumber()
  @ApiProperty()
  register_id: number;

  @IsNumber()
  @ApiProperty()
  modify_id: number;
}
