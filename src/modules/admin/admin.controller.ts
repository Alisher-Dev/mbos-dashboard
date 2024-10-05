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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from 'src/helpers/authGuard';
import { IRequest } from 'src/helpers/type';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post('login')
  Login(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.Login(createAdminDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  Me(@Req() req: IRequest) {
    return this.adminService.Me(req.userId);
  }

  @Post('refresh')
  update(@Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(updateAdminDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  remove(@Req() req: IRequest) {
    return this.adminService.remove(req.userId);
  }
}