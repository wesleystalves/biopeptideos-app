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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto) {
        const exists = await this.prisma.profile.findUnique({
            where: { email: dto.email },
        });
        if (exists)
            throw new common_1.ConflictException('E-mail já cadastrado');
        const hashed = await bcrypt.hash(dto.password, 10);
        const profile = await this.prisma.profile.create({
            data: {
                email: dto.email,
                name: dto.name,
                displayName: dto.name,
                password: hashed,
            },
        });
        const token = this.signToken(profile.id, profile.email, profile.isAdmin);
        return { token, user: this.sanitize(profile) };
    }
    async login(dto) {
        const profile = await this.prisma.profile.findUnique({
            where: { email: dto.email },
            include: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });
        if (!profile)
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        if (profile.password) {
            const valid = await bcrypt.compare(dto.password, profile.password);
            if (!valid)
                throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const activeSub = profile.subscriptions.find((s) => s.status === 'active');
        const isPremium = !!activeSub || profile.isAdmin;
        const token = this.signToken(profile.id, profile.email, profile.isAdmin);
        return {
            token,
            user: {
                ...this.sanitize(profile),
                isPremium,
                plan: isPremium ? (profile.isAdmin ? 'admin' : 'pro') : 'free',
            },
        };
    }
    async me(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { id: userId },
            include: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });
        if (!profile)
            throw new common_1.UnauthorizedException();
        const activeSub = profile.subscriptions.find((s) => s.status === 'active');
        const isPremium = !!activeSub || profile.isAdmin;
        return {
            ...this.sanitize(profile),
            isPremium,
            plan: isPremium ? (profile.isAdmin ? 'admin' : 'pro') : 'free',
        };
    }
    signToken(id, email, isAdmin) {
        return this.jwt.sign({ sub: id, email, isAdmin });
    }
    sanitize(profile) {
        const { password, subscriptions, ...rest } = profile;
        return rest;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map