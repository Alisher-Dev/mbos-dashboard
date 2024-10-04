import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EnumShartnoma, EnumShartnomaPaid } from 'src/helpers/enum';

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

  @IsString()
  @ApiProperty()
  price: string;

  @IsEnum(EnumShartnomaPaid)
  @ApiProperty()
  @IsOptional()
  purchase_status: EnumShartnomaPaid;

  @IsString()
  @ApiProperty()
  service: string;

  @IsDateString()
  @ApiProperty()
  shartnoma_muddati: string;

  @IsString()
  @ApiProperty()
  user_id: string;

  @IsDateString()
  @ApiProperty()
  texnik_muddati: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  izoh: string;
}
