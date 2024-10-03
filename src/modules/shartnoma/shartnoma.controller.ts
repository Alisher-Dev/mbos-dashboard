import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ShartnomaService } from './shartnoma.service';
import { CreateShartnomaDto } from './dto/create-shartnoma.dto';
import { UpdateShartnomaDto } from './dto/update-shartnoma.dto';
import { ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { FindAllQuery } from 'src/helpers/type';

@Controller('shartnoma')
@ApiTags('shartnoma')
export class ShartnomaController {
  constructor(private readonly shartnomaService: ShartnomaService) {}

  @Post()
  create(@Body() createShartnomaDto: CreateShartnomaDto) {
    return this.shartnomaService.create(createShartnomaDto);
  }

  @Get()
  findAll(@Query() query: FindAllQuery) {
    return this.shartnomaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shartnomaService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShartnomaDto: UpdateShartnomaDto,
  ) {
    return this.shartnomaService.update(+id, updateShartnomaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shartnomaService.remove(+id);
  }
}
