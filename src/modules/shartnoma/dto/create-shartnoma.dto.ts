import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  EnumShartnoma,
  EnumShartnomaPaid,
  EnumShartnomeTpeTranslation,
} from 'src/helpers/enum';

export class CreateShartnomaDto {
  @IsDateString()
  @ApiProperty()
  sana: string;

  @IsEnum(EnumShartnoma)
  @IsOptional()
  @ApiProperty()
  shartnoma_turi: EnumShartnoma;

  @IsNumber()
  @ApiProperty()
  count: number;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsEnum(EnumShartnomaPaid)
  @IsOptional()
  @ApiProperty()
  purchase_status: EnumShartnomaPaid;

  @IsEnum(EnumShartnomeTpeTranslation)
  @IsOptional()
  @ApiProperty()
  paymentMethod: EnumShartnomeTpeTranslation;

  @IsString()
  @ApiProperty()
  service: string;

  @IsDateString()
  @ApiProperty()
  shartnoma_muddati: string;

  @IsNumber()
  @ApiProperty()
  user_id: string;

  @IsDateString()
  @ApiProperty()
  @ApiProperty()
  texnik_muddati: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  izoh?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  advancePayment?: number;
}
