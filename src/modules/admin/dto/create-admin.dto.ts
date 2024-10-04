import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  user_name: string;

  @ApiProperty()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  token: string;
}
