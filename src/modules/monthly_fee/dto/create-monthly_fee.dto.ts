import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EnumShartnomaPaid } from 'src/helpers/enum';

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

  @IsString()
  @IsOptional()
  @ApiProperty()
  commit: string;

  @IsNumber()
  @ApiProperty()
  shartnoma_id: number;

  @ApiProperty()
  @IsEnum({ enum: EnumShartnomaPaid })
  purchase_status: EnumShartnomaPaid;

  @IsString()
  @ApiProperty()
  update_date: string;
}
