import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMonthlyFeeDto {
  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsString()
  @ApiProperty()
  date: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  paid: number;

  @IsNumber()
  @ApiProperty()
  shartnoma_id: number;

  @IsString()
  @ApiProperty()
  update_date: string;
}
