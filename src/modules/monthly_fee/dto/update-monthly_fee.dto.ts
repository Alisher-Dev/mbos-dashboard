import { PartialType } from '@nestjs/swagger';
import { CreateMonthlyFeeDto } from './create-monthly_fee.dto';

export class UpdateMonthlyFeeDto extends PartialType(CreateMonthlyFeeDto) {}
