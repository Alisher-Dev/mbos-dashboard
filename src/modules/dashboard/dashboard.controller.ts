import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/helpers/authGuard';

@Controller('dashboard')
@ApiTags('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AuthGuard)
  find() {
    return this.dashboardService.find();
  }

  @Get('/income')
  @UseGuards(AuthGuard)
  findIncome() {
    return this.dashboardService.findIncome();
  }

  @Get('/statstik')
  @UseGuards(AuthGuard)
  findStatistik() {
    return this.dashboardService.findStatstik();
  }
}
