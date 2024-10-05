import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { compareSync, hashSync } from 'bcrypt';
import token from 'src/helpers/token';
import { ApiResponse } from 'src/helpers/apiRespons';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    const admin = await this.adminRepo.findOneBy({
      user_name: createAdminDto.user_name,
    });

    if (!!admin) {
      throw new BadRequestException('already have this');
    }
    const newAdmin = this.adminRepo.create(createAdminDto);
    newAdmin.password = hashSync(createAdminDto.password, 5);
    const saveAdmin = await this.adminRepo.save(newAdmin);

    const accessToken = token.generateAccessToken({ userId: saveAdmin.id });
    const refreshToken = token.generateRefreshToken({ userId: saveAdmin.id });

    saveAdmin.token = hashSync(refreshToken, 5);

    await this.adminRepo.save(saveAdmin);

    return new ApiResponse({ accessToken, refreshToken }, 201);
  }

  async Login(body: CreateAdminDto) {
    const admin = await this.adminRepo.findOneBy({ user_name: body.user_name });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    const checkPassword = compareSync(body.password, admin.password);
    if (!checkPassword) {
      throw new BadRequestException('password is incorrect');
    }

    const accessToken = token.generateAccessToken({ userId: admin.id });
    const refreshToken = token.generateRefreshToken({ userId: admin.id });

    admin.token = hashSync(refreshToken, 5);

    await this.adminRepo.save(admin);

    return new ApiResponse({ accessToken, refreshToken });
  }

  async Me(id: number) {
    const admin = await this.adminRepo.findOneBy({ id: id });
    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    return new ApiResponse({
      ...admin,
      token: null,
    });
  }

  async update(body: UpdateAdminDto) {
    const { userId } = token.verifyRefreshToken(body.token);
    const admin = await this.adminRepo.findOneBy({ id: userId });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    const accessToken = token.generateAccessToken({ userId });
    const refreshToken = token.generateRefreshToken({ userId });

    admin.token = hashSync(refreshToken, 5);

    await this.adminRepo.save(admin);

    return new ApiResponse({ accessToken, refreshToken });
  }

  async remove(id: number) {
    const admin = await this.adminRepo.findOneBy({ id });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    admin.token = null;
    await this.adminRepo.save(admin);
    return new ApiResponse('logout');
  }
}