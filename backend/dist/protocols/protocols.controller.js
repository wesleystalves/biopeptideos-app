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
exports.ProtocolsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const protocols_service_1 = require("./protocols.service");
const optional_jwt_guard_1 = require("../auth/optional-jwt.guard");
let ProtocolsController = class ProtocolsController {
    constructor(service) {
        this.service = service;
    }
    findAll(req) {
        const isPremium = req.user?.isAdmin || false;
        return this.service.findAll(isPremium);
    }
    findOne(slug) {
        return this.service.findBySlug(slug);
    }
};
exports.ProtocolsController = ProtocolsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProtocolsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProtocolsController.prototype, "findOne", null);
exports.ProtocolsController = ProtocolsController = __decorate([
    (0, swagger_1.ApiTags)('protocols'),
    (0, common_1.Controller)('protocols'),
    __metadata("design:paramtypes", [protocols_service_1.ProtocolsService])
], ProtocolsController);
//# sourceMappingURL=protocols.controller.js.map