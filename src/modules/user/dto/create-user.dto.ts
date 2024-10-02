import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  F_I_O: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  phone: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  adress: string;
}
