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
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { FindAllQuery } from 'src/helpers/type';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/helpers/authGuard';

@Controller('income')
@ApiTags('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createIncomeDto: CreateIncomeDto) {
    return this.incomeService.create(createIncomeDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query: FindAllQuery) {
    return this.incomeService.findAll(query);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
    return this.incomeService.update(+id, updateIncomeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.incomeService.remove(+id);
  }
}
