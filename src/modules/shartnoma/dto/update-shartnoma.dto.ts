import { PartialType } from '@nestjs/swagger';
import { CreateShartnomaDto } from './create-shartnoma.dto';

export class UpdateShartnomaDto extends PartialType(CreateShartnomaDto) {}
