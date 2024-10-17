import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EnumServiceType } from 'src/helpers/enum';

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsEnum(EnumServiceType)
  serviceType: EnumServiceType;

  @IsString()
  @IsOptional()
  dona: string;

  @IsString()
  @IsOptional()
  marta: string;
}
