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
  EnumShartnomaTpeTranslation,
} from 'src/helpers/enum';

export class CreateShartnomaDto {
  @IsDateString()
  @ApiProperty()
  sana: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  shartnoma_nomer: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  whoCreated: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  whoUpdated: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  isDeleted: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  enabled: 0 | 1;

  @IsEnum(EnumShartnoma)
  @IsOptional()
  @ApiProperty()
  shartnoma_turi: EnumShartnoma;

  @IsNumber()
  @ApiProperty()
  count: number;

  @IsEnum(EnumShartnomaPaid)
  @IsOptional()
  @ApiProperty()
  purchase_status: EnumShartnomaPaid;

  @IsEnum(EnumShartnomaTpeTranslation)
  @ApiProperty()
  paymentMethod: EnumShartnomaTpeTranslation;

  @IsNumber()
  @ApiProperty()
  service_id: string;

  @IsDateString()
  @ApiProperty()
  shartnoma_muddati: string;

  @IsNumber()
  @ApiProperty()
  user_id: string;

  @IsDateString()
  @ApiProperty()
  texnik_muddati: string;

  @IsDateString()
  @ApiProperty()
  tolash_sana: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  izoh?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  advancePayment?: number;
}
