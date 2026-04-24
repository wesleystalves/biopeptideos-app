import {
    Controller, Post, Get, Put, Patch, Delete, Body,
    Query, Param, Request, UseGuards, BadRequestException, NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt.guard';
import { AdminGuard } from './admin.guard';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

class ForgotPasswordDto { @IsEmail() email: string; }
class ResetPasswordDto { @IsString() token: string; @IsString() @MinLength(6) password: string; }
class ChangeEmailDto { @IsEmail() email: string; }

class UpdateProfileDto {
    @IsOptional() @IsString() name?: string;
    @IsOptional() @IsString() displayName?: string;
    @IsOptional() @IsString() phone?: string;
    @IsOptional() @IsString() cpf?: string;
    @IsOptional() @IsString() whatsapp?: string;
    @IsOptional() @IsString() birthDate?: string;
    @IsOptional() @IsString() gender?: string;
    @IsOptional() @IsString() profileType?: string;
    @IsOptional() @IsString() avatarUrl?: string;
}

class AdminCreateUserDto {
    @IsEmail() email: string;
    @IsOptional() @IsString() name?: string;
    @IsOptional() @IsString() password?: string;
    @IsOptional() @IsString() phone?: string;
    @IsOptional() @IsString() cpf?: string;
    @IsOptional() @IsString() whatsapp?: string;
    @IsOptional() @IsString() birthDate?: string;
    @IsOptional() @IsString() gender?: string;
    @IsOptional() @IsString() profileType?: string;
    @IsOptional() @IsString() plan?: string;
    @IsOptional() emailVerified?: boolean;
}

class AdminUpdateUserDto {
    @IsOptional() @IsString() name?: string;
    @IsOptional() @IsEmail() email?: string;
    @IsOptional() @IsString() phone?: string;
    @IsOptional() @IsString() cpf?: string;
    @IsOptional() @IsString() whatsapp?: string;
    @IsOptional() @IsString() birthDate?: string;
    @IsOptional() @IsString() gender?: string;
    @IsOptional() @IsString() profileType?: string;
    @IsOptional() @IsString() plan?: string;
    @IsOptional() isAdmin?: boolean;
    @IsOptional() emailVerified?: boolean;
    @IsOptional() @IsString() password?: string;
}

class AddressDto {
    @IsOptional() @IsString() label?: string;
    @IsString() recipientName: string;
    @IsOptional() @IsString() phone?: string;
    @IsString() cep: string;
    @IsString() street: string;
    @IsString() number: string;
    @IsOptional() @IsString() complement?: string;
    @IsString() neighborhood: string;
    @IsString() city: string;
    @IsString() state: string;
    @IsOptional() isDefault?: boolean;
}

// ─── Shared field select ───────────────────────────────────────────────────────

const USER_SELECT = {
    id: true, email: true, name: true, displayName: true, avatarUrl: true,
    phone: true, cpf: true, whatsapp: true, birthDate: true, gender: true,
    profileType: true, plan: true, isAdmin: true,
    emailVerified: true, createdAt: true, updatedAt: true,
    _count: { select: { orders: true } },
};

// ─── Controller ───────────────────────────────────────────────────────────────

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly auth: AuthService,
        private readonly prisma: PrismaService,
    ) { }

    // ── Public Auth ────────────────────────────────────────────────────────────

    @Post('register')
    register(@Body() dto: RegisterDto) { return this.auth.register(dto); }

    @Post('login')
    login(@Body() dto: LoginDto) { return this.auth.login(dto); }

    @Get('me')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard)
    me(@Request() req: any) { return this.auth.me(req.user.sub); }

    @Get('verify-email')
    verifyEmail(@Query('token') token: string) { return this.auth.verifyEmail(token); }

    @Post('send-verify-email')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard)
    sendVerifyEmail(@Request() req: any) { return this.auth.sendVerifyEmail(req.user.sub); }

    @Post('forgot-password')
    forgotPassword(@Body() dto: ForgotPasswordDto) { return this.auth.forgotPassword(dto.email); }

    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto) { return this.auth.resetPassword(dto.token, dto.password); }

    @Put('change-email')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard)
    changeEmail(@Request() req: any, @Body() dto: ChangeEmailDto) {
        return this.auth.changeEmail(req.user.sub, dto.email);
    }

    // ── Self-Service Profile ───────────────────────────────────────────────────

    /** PATCH /api/auth/profile */
    @Patch('profile')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard)
    async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
        const data: any = { ...dto };
        if (dto.birthDate) data.birthDate = new Date(dto.birthDate);
        return this.prisma.profile.update({ where: { id: req.user.sub }, data, select: USER_SELECT });
    }

    // ── Client Address CRUD ────────────────────────────────────────────────────

    /** GET /api/auth/addresses */
    @Get('addresses')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard)
    listAddresses(@Request() req: any) {
        return this.prisma.address.findMany({
            where: { userId: req.user.sub },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
    }

    /** POST /api/auth/addresses */
    @Post('addresses')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard)
    async createAddress(@Request() req: any, @Body() dto: AddressDto) {
        if (dto.isDefault) {
            await this.prisma.address.updateMany({ where: { userId: req.user.sub }, data: { isDefault: false } });
        }
        return this.prisma.address.create({ data: { ...dto, userId: req.user.sub } });
    }

    /** PATCH /api/auth/addresses/:id */
    @Patch('addresses/:id')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard)
    async updateAddress(@Request() req: any, @Param('id') id: string, @Body() dto: Partial<AddressDto>) {
        const addr = await this.prisma.address.findFirst({ where: { id, userId: req.user.sub } });
        if (!addr) throw new NotFoundException('Endereço não encontrado');
        if (dto.isDefault) {
            await this.prisma.address.updateMany({ where: { userId: req.user.sub }, data: { isDefault: false } });
        }
        return this.prisma.address.update({ where: { id }, data: dto });
    }

    /** DELETE /api/auth/addresses/:id */
    @Delete('addresses/:id')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard)
    async deleteAddress(@Request() req: any, @Param('id') id: string) {
        const addr = await this.prisma.address.findFirst({ where: { id, userId: req.user.sub } });
        if (!addr) throw new NotFoundException('Endereço não encontrado');
        await this.prisma.address.delete({ where: { id } });
        return { ok: true };
    }

    // ── Admin: Users ───────────────────────────────────────────────────────────

    /**
     * GET /api/auth/admin/users
     * ?search=  ?plan=  ?verified=true|false  ?sort=newest|oldest|name|plan
     */
    @Get('admin/users')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    async listUsers(
        @Query('search') search?: string,
        @Query('plan') plan?: string,
        @Query('verified') verified?: string,
        @Query('sort') sort?: string,
    ) {
        const where: any = {};
        if (plan && plan !== 'all') where.plan = plan;
        if (verified === 'true') where.emailVerified = true;
        if (verified === 'false') where.emailVerified = false;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { cpf: { contains: search, mode: 'insensitive' } },
                { whatsapp: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }

        const orderBy: any =
            sort === 'oldest' ? { createdAt: 'asc' } :
                sort === 'name' ? { name: 'asc' } :
                    sort === 'plan' ? { plan: 'asc' } :
                        { createdAt: 'desc' };

        const [users, all] = await Promise.all([
            this.prisma.profile.findMany({ where, select: USER_SELECT, orderBy, take: 500 }),
            this.prisma.profile.findMany({ select: { plan: true, emailVerified: true } }),
        ]);

        const stats = {
            total: all.length,
            premium: all.filter(u => u.plan === 'premium').length,
            basic: all.filter(u => u.plan === 'basic').length,
            free: all.filter(u => u.plan === 'free').length,
            verified: all.filter(u => u.emailVerified).length,
            unverified: all.filter(u => !u.emailVerified).length,
        };

        return { users, stats };
    }

    /** GET /api/auth/admin/users/:id */
    @Get('admin/users/:id')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    async getUser(@Param('id') id: string) {
        const user = await this.prisma.profile.findUnique({
            where: { id },
            select: {
                ...USER_SELECT,
                addresses: { orderBy: { createdAt: 'desc' as const } },
                subscriptions: { orderBy: { createdAt: 'desc' as const }, take: 5 },
                orders: {
                    orderBy: { createdAt: 'desc' as const }, take: 10,
                    select: { id: true, amount: true, status: true, createdAt: true },
                },
                ebookPurchases: { orderBy: { createdAt: 'desc' as const }, take: 10 },
            },
        });
        if (!user) throw new NotFoundException('Usuário não encontrado');
        return user;
    }

    /** POST /api/auth/admin/users */
    @Post('admin/users')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    async createUser(@Body() dto: AdminCreateUserDto) {
        const exists = await this.prisma.profile.findUnique({ where: { email: dto.email } });
        if (exists) throw new BadRequestException('Email já cadastrado');

        const data: any = {
            email: dto.email, name: dto.name, phone: dto.phone,
            cpf: dto.cpf, whatsapp: dto.whatsapp,
            gender: dto.gender, profileType: dto.profileType,
            plan: dto.plan || 'free',
            emailVerified: dto.emailVerified ?? false,
        };
        if (dto.birthDate) data.birthDate = new Date(dto.birthDate);
        if (dto.password) data.password = await bcrypt.hash(dto.password, 10);

        return this.prisma.profile.create({ data, select: USER_SELECT });
    }

    /** PATCH /api/auth/admin/users/:id */
    @Patch('admin/users/:id')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    async updateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
        const data: any = { ...dto };
        if (dto.birthDate) data.birthDate = new Date(dto.birthDate);
        else delete data.birthDate;
        if (dto.password) data.password = await bcrypt.hash(dto.password, 10);
        else delete data.password;
        return this.prisma.profile.update({ where: { id }, data, select: USER_SELECT });
    }

    /** DELETE /api/auth/admin/users/:id */
    @Delete('admin/users/:id')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    async deleteUser(@Param('id') id: string) {
        await this.prisma.profile.delete({ where: { id } });
        return { ok: true };
    }

    /** PATCH /api/auth/admin/users/:id/admin */
    @Patch('admin/users/:id/admin')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    async toggleAdmin(@Param('id') id: string, @Body() body: { isAdmin: boolean }) {
        return this.prisma.profile.update({ where: { id }, data: { isAdmin: body.isAdmin }, select: { id: true, isAdmin: true } });
    }

    /** PATCH /api/auth/admin/users/:id/plan */
    @Patch('admin/users/:id/plan')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    async changePlan(@Param('id') id: string, @Body() body: { plan: string }) {
        return this.prisma.profile.update({ where: { id }, data: { plan: body.plan }, select: { id: true, plan: true } });
    }

    /** PATCH /api/auth/admin/users/:id/verify-email */
    @Patch('admin/users/:id/verify-email')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    async forceVerifyEmail(@Param('id') id: string) {
        return this.prisma.profile.update({
            where: { id },
            data: { emailVerified: true, emailVerifyToken: null, emailVerifyExpires: null },
            select: { id: true, emailVerified: true },
        });
    }
}
