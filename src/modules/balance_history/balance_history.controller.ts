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
  Query,
} from '@nestjs/common';
import { BalanceHistoryService } from './balance_history.service';
import { CreateBalanceHistoryDto } from './dto/create-balance_history.dto';
import { UpdateBalanceHistoryDto } from './dto/update-balance_history.dto';
import { AuthGuard } from 'src/helpers/authGuard';
import { FindAllQuery, IPayload } from 'src/helpers/type';
import { ApiTags } from '@nestjs/swagger';

@Controller('balance-history')
@ApiTags('balance-history')
export class BalanceHistoryController {
  constructor(private readonly balanceHistoryService: BalanceHistoryService) {}
  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createServiceDto: CreateBalanceHistoryDto,
    @Req() req: IPayload,
  ) {
    return this.balanceHistoryService.create(createServiceDto, req.userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query: FindAllQuery) {
    return this.balanceHistoryService.findAll(query);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateBalanceHistoryDto,
    @Req() req: IPayload,
  ) {
    return this.balanceHistoryService.update(+id, updateServiceDto, req.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.balanceHistoryService.remove(+id);
  }
}
