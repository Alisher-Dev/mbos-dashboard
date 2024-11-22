import { PartialType } from '@nestjs/mapped-types';
import { CreateServerPaidDto } from './create-server-paid.dto';

export class UpdateServerPaidDto extends PartialType(CreateServerPaidDto) {}
