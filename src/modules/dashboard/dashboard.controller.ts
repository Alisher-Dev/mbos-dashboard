import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/helpers/authGuard';
import { IYears } from './dto/query.dto';

@Controller('dashboard')
@ApiTags('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AuthGuard)
  find(@Query() query: IYears) {
    return this.dashboardService.find(query);
  }

  @Get('/income')
  @UseGuards(AuthGuard)
  findIncome() {
    return this.dashboardService.findIncome();
  }

  @Get('/statstik')
  @UseGuards(AuthGuard)
  findStatistik(@Query() query: IYears) {
    return this.dashboardService.findStatstik(query);
  }

  @Get('/statstik-years')
  @UseGuards(AuthGuard)
  findStatistikYears() {
    return this.dashboardService.findYearlyForecast();
  }

  @Get('/statstik-income')
  @UseGuards(AuthGuard)
  findStatistikOnlyIncome(@Query() query: IYears) {
    return this.dashboardService.findStatistikOnlyIncome(query);
  }

  @Get('/serviceDash/:id')
  @UseGuards(AuthGuard)
  findServiceDash(@Param() { id }: { id: number }) {
    return this.dashboardService.findServiceDash(id);
  }
}
