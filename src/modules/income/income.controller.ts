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
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { FindAllQuery, IPayload } from 'src/helpers/type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/helpers/authGuard';

@Controller('income')
@ApiTags('income')
@ApiBearerAuth('accessToken')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createIncomeDto: CreateIncomeDto, @Req() req: IPayload) {
    return this.incomeService.create(createIncomeDto, req.userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query: FindAllQuery) {
    return this.incomeService.findAll(query);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
    @Req() req: IPayload,
  ) {
    return this.incomeService.update(+id, updateIncomeDto, req.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.incomeService.remove(+id);
  }
}
