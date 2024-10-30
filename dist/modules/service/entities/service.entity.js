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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const enum_1 = require("../../../helpers/enum");
const root_entity_1 = require("../../../helpers/root.entity");
const shartnoma_entity_1 = require("../../shartnoma/entities/shartnoma.entity");
const typeorm_1 = require("typeorm");
let Service = class Service extends root_entity_1.RootEntity {
};
exports.Service = Service;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Service.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Service.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Service.prototype, "birliklar", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: enum_1.EnumServiceType, type: 'enum' }),
    __metadata("design:type", String)
], Service.prototype, "serviceType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shartnoma_entity_1.Shartnoma, (shartnoma) => shartnoma.service, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Service.prototype, "shartnoma", void 0);
exports.Service = Service = __decorate([
    (0, typeorm_1.Entity)()
], Service);
//# sourceMappingURL=service.entity.js.map