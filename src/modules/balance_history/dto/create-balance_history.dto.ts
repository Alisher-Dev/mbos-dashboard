import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { EnumShartnomaPaid } from 'src/helpers/enum';

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

  @IsEnum(EnumShartnomaPaid)
  @ApiProperty()
  purchase_status: EnumShartnomaPaid;
}
