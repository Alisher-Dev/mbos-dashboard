import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  EnumIncamIsPaid,
  EnumIncamTpeTranslation,
  EnumShartnomaPaid,
} from 'src/helpers/enum';

export class CreateIncomeDto {
  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsEnum(EnumIncamTpeTranslation)
  @ApiProperty()
  payment_method: EnumIncamTpeTranslation;

  @IsEnum(EnumIncamIsPaid)
  @ApiProperty()
  is_paid: EnumIncamIsPaid;

  @IsEnum(EnumShartnomaPaid)
  @IsOptional()
  @ApiProperty()
  confirm_payment: EnumShartnomaPaid;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  shartnoma_id: number;

  @IsString()
  @ApiProperty()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  date: Date;

  @IsNumber()
  @ApiProperty()
  user_id: number;
}
