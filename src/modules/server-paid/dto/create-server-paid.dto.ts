import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsNumber, IsString } from 'class-validator';

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

  @IsString()
  @ApiProperty()
  ads: string;

  @IsNumber()
  @ApiProperty()
  status: number;
}
