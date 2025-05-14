import { IsOptional, IsString } from 'class-validator';

export class IYears {
  @IsString()
  @IsOptional()
  year?: string;
}
