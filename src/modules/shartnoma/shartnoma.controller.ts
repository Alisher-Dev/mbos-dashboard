import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ShartnomaService } from './shartnoma.service';
import { CreateShartnomaDto } from './dto/create-shartnoma.dto';
import { UpdateShartnomaDto } from './dto/update-shartnoma.dto';
import { ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { FindAllQuery } from 'src/helpers/type';
import { AuthGuard } from 'src/helpers/authGuard';

@Controller('shartnoma')
@ApiTags('shartnoma')
export class ShartnomaController {
  constructor(private readonly shartnomaService: ShartnomaService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createShartnomaDto: CreateShartnomaDto) {
    return this.shartnomaService.create(createShartnomaDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query: FindAllQuery) {
    return this.shartnomaService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.shartnomaService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateShartnomaDto: UpdateShartnomaDto,
  ) {
    return this.shartnomaService.update(+id, updateShartnomaDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.shartnomaService.remove(+id);
  }
}
