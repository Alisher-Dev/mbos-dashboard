import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @ApiProperty()
  user_name: string;

  @ApiProperty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  token: string;
}
