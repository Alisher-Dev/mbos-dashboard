import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateIncomeDto {
  @IsNumber()
  @ApiProperty()
  @IsOptional()
  translation_benefit: number;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  cash_benefit: number;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  online_benefit: number;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  benefit: number;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  workers_harm: number;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  harm: number;
}
