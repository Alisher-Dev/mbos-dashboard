import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EnumIncamIsPaid, EnumIncamTpeTranslation } from 'src/helpers/enum';

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
