import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateBalanceHistoryDto {
  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsString()
  @ApiProperty()
  date: string;

  @IsNumber()
  @ApiProperty()
  user_id: number;

  @IsNumber()
  @ApiProperty()
  monthly_fee_id: number;
}
