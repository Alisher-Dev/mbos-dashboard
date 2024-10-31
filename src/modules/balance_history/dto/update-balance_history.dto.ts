import { PartialType } from '@nestjs/swagger';
import { CreateBalanceHistoryDto } from './create-balance_history.dto';

export class UpdateBalanceHistoryDto extends PartialType(CreateBalanceHistoryDto) {}
