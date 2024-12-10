import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { Cron } from '@nestjs/schedule';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllQuery, IPayload } from 'src/helpers/type';
import { AuthGuard } from 'src/helpers/authGuard';

@Controller('server')
@ApiBearerAuth('accessToken')
@ApiTags('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createServerDto: CreateServerDto, @Req() req: IPayload) {
    return this.serverService.create(createServerDto, req);
  }

  @Get()
  findAll(@Param() param: FindAllQuery) {
    return this.serverService.findAll(param);
  }

  @Cron('0 8 * * *')
  @Post('/notification')
  @UseGuards(AuthGuard)
  notification() {
    return this.serverService.notification();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serverService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServerDto: UpdateServerDto,
    @Req() req: IPayload,
  ) {
    return this.serverService.update(+id, updateServerDto, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serverService.remove(+id);
  }
}
