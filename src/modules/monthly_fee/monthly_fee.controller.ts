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
import { MonthlyFeeService } from './monthly_fee.service';
import { CreateMonthlyFeeDto } from './dto/create-monthly_fee.dto';
import { UpdateMonthlyFeeDto } from './dto/update-monthly_fee.dto';
import { AuthGuard } from 'src/helpers/authGuard';
import { FindAllQuery, IPayload } from 'src/helpers/type';
import { ApiTags } from '@nestjs/swagger';

@Controller('monthly-fee')
@ApiTags('monthly-fee')
export class MonthlyFeeController {
  constructor(private readonly monthlyFeeService: MonthlyFeeService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createMonthlyFeeDto: CreateMonthlyFeeDto,
    @Req() req: IPayload,
  ) {
    return this.monthlyFeeService.create(createMonthlyFeeDto, req.userId);
  }

  @Get('/cron')
  Find() {
    return this.monthlyFeeService.updateOrCreateMonthlyFees();
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query: FindAllQuery) {
    return this.monthlyFeeService.findAll(query);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateMonthlyFeeDto: UpdateMonthlyFeeDto,
    @Req() req: IPayload,
  ) {
    return this.monthlyFeeService.update(+id, updateMonthlyFeeDto, req.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.monthlyFeeService.remove(+id);
  }
}
