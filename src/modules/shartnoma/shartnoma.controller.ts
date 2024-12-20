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
import { ShartnomaService } from './shartnoma.service';
import { CreateShartnomaDto } from './dto/create-shartnoma.dto';
import { UpdateShartnomaDto } from './dto/update-shartnoma.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllQuery, IPayload } from 'src/helpers/type';
import { AuthGuard } from 'src/helpers/authGuard';

@Controller('shartnoma')
@ApiTags('shartnoma')
@ApiBearerAuth('accessToken')
export class ShartnomaController {
  constructor(private readonly shartnomaService: ShartnomaService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createShartnomaDto: CreateShartnomaDto, @Req() req: IPayload) {
    return this.shartnomaService.create(createShartnomaDto, req.userId);
  }

  // @Post(':id')
  // @UseGuards(AuthGuard)
  // refreshManthly_fee(@Param() params: FindAllQuery) {
  //   return this.shartnomaService.refreshManthly_fee(params);
  // }

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
    @Req() req: IPayload,
  ) {
    return this.shartnomaService.update(+id, updateShartnomaDto, req.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.shartnomaService.remove(+id);
  }
}
