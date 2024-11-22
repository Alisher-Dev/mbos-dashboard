import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { Cron } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { FindAllQuery } from 'src/helpers/type';
import { AuthGuard } from 'src/helpers/authGuard';

@Controller('server')
@ApiTags('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createServerDto: CreateServerDto) {
    return this.serverService.create(createServerDto);
  }

  @Get()
  findAll(@Param() param: FindAllQuery) {
    return this.serverService.findAll(param);
  }

  @Cron('0 8 * * *')
  @UseGuards(AuthGuard)
  @Post('/notification')
  notification() {
    return this.serverService.notification();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serverService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServerDto: UpdateServerDto) {
    return this.serverService.update(+id, updateServerDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serverService.remove(+id);
  }
}
