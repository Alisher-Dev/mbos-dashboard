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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllQuery, IPayload } from 'src/helpers/type';
import { AuthGuard } from 'src/helpers/authGuard';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth('accessToken')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createUserDto: CreateUserDto, @Req() req: IPayload) {
    return this.userService.create(createUserDto, req.userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() query: FindAllQuery) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: IPayload,
  ) {
    return this.userService.update(+id, updateUserDto, req.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
