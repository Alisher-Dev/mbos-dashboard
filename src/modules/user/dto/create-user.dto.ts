import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  F_I_O: string;

  @ApiProperty()
  @IsNumber()
  phone: number;

  @ApiProperty()
  @IsString()
  adress: string;

  @ApiProperty()
  @IsString()
  INN_number: string;

  @IsOptional()
  @IsString()
  balance: string;
}
