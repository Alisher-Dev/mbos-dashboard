"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_entity_1 = require("./entities/admin.entity");
const typeorm_2 = require("typeorm");
const bcrypt_1 = require("bcrypt");
const token_1 = require("../../helpers/token");
const apiRespons_1 = require("../../helpers/apiRespons");
let AdminService = class AdminService {
    constructor(adminRepo) {
        this.adminRepo = adminRepo;
    }
    async create(createAdminDto) {
        const admin = await this.adminRepo.findOneBy({
            user_name: createAdminDto.user_name,
        });
        if (!!admin) {
            throw new common_1.BadRequestException('admin allaqachon bor');
        }
        const newAdmin = this.adminRepo.create(createAdminDto);
        newAdmin.password = (0, bcrypt_1.hashSync)(createAdminDto.password, 5);
        const saveAdmin = await this.adminRepo.save(newAdmin);
        const accessToken = token_1.default.generateAccessToken({ userId: saveAdmin.id });
        const refreshToken = token_1.default.generateRefreshToken({ userId: saveAdmin.id });
        saveAdmin.token = (0, bcrypt_1.hashSync)(refreshToken, 5);
        await this.adminRepo.save(saveAdmin);
        return new apiRespons_1.ApiResponse({ accessToken, refreshToken }, 201);
    }
    async Login(body) {
        const admin = await this.adminRepo.findOneBy({ user_name: body.user_name });
        if (!admin) {
            throw new common_1.NotFoundException('admin topilmadi');
        }
        const checkPassword = (0, bcrypt_1.compareSync)(body.password, admin.password);
        if (!checkPassword) {
            throw new common_1.BadRequestException("parol noto'g'ri");
        }
        const accessToken = token_1.default.generateAccessToken({ userId: admin.id });
        const refreshToken = token_1.default.generateRefreshToken({ userId: admin.id });
        admin.token = (0, bcrypt_1.hashSync)(refreshToken, 5);
        await this.adminRepo.save(admin);
        return new apiRespons_1.ApiResponse({ accessToken, refreshToken });
    }
    async Me(id) {
        const admin = await this.adminRepo.findOne({ where: { id } });
        if (!admin) {
            throw new common_1.NotFoundException('admin topilmadi');
        }
        return new apiRespons_1.ApiResponse({ ...admin, token: null });
    }
    async GetAdmin(id) {
        const admin = await this.adminRepo.findOne({ where: { id: id } });
        if (!admin) {
            throw new common_1.NotFoundException('admin topilmadi');
        }
        const { password, token, ...adminData } = admin;
        return new apiRespons_1.ApiResponse({ ...adminData });
    }
    async update(body) {
        const { userId } = token_1.default.verifyRefreshToken(body.token);
        const admin = await this.adminRepo.findOneBy({ id: userId });
        if (!admin) {
            throw new common_1.NotFoundException('admin topilmadi');
        }
        const accessToken = token_1.default.generateAccessToken({ userId });
        const refreshToken = token_1.default.generateRefreshToken({ userId });
        admin.token = (0, bcrypt_1.hashSync)(refreshToken, 5);
        await this.adminRepo.save(admin);
        return new apiRespons_1.ApiResponse({ accessToken, refreshToken });
    }
    async remove(id) {
        const admin = await this.adminRepo.findOneBy({ id });
        if (!admin) {
            throw new common_1.NotFoundException('admin topilmadi');
        }
        admin.token = null;
        await this.adminRepo.save(admin);
        return new apiRespons_1.ApiResponse('chikdingiz');
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map