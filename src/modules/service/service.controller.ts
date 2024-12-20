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
  Req,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FindAllQuery, IPayload } from 'src/helpers/type';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/helpers/authGuard';

@Controller('service')
@ApiTags('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createServiceDto: CreateServiceDto, @Req() req: IPayload) {
    return this.serviceService.create(createServiceDto, req.userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query: FindAllQuery) {
    return this.serviceService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Req() req: IPayload,
  ) {
    return this.serviceService.update(+id, updateServiceDto, req.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.serviceService.remove(+id);
  }
}
