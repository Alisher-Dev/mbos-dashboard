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
import { ServerPaidService } from './server-paid.service';
import { CreateServerPaidDto } from './dto/create-server-paid.dto';
import { UpdateServerPaidDto } from './dto/update-server-paid.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindAllQuery } from 'src/helpers/type';
import { AuthGuard } from 'src/helpers/authGuard';

@Controller('server-paid')
@ApiTags('server-paid')
export class ServerPaidController {
  constructor(private readonly serverPaidService: ServerPaidService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createServerPaidDto: CreateServerPaidDto) {
    return this.serverPaidService.create(createServerPaidDto);
  }

  @Get()
  findAll(@Param() param: FindAllQuery) {
    return this.serverPaidService.findAll(param);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serverPaidService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateServerPaidDto: UpdateServerPaidDto,
  ) {
    return this.serverPaidService.update(+id, updateServerPaidDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serverPaidService.remove(+id);
  }
}
