import { Controller, Post, Get, Put, Patch, Body, Query, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt.guard';
import { AdminGuard } from './admin.guard';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

class ForgotPasswordDto { @IsEmail() email: string; }
class ResetPasswordDto { @IsString() token: string; @IsString() @MinLength(6) password: string; }
class ChangeEmailDto { @IsEmail() email: string; }

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly auth: AuthService,
        private readonly prisma: PrismaService,
    ) { }

    @Post('register')
    register(@Body() dto: RegisterDto) { return this.auth.register(dto); }

    @Post('login')
    login(@Body() dto: LoginDto) { return this.auth.login(dto); }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    me(@Request() req: any) { return this.auth.me(req.user.sub); }

    @Get('verify-email')
    verifyEmail(@Query('token') token: string) { return this.auth.verifyEmail(token); }

    @Post('send-verify-email')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    sendVerifyEmail(@Request() req: any) { return this.auth.sendVerifyEmail(req.user.sub); }

    @Post('forgot-password')
    forgotPassword(@Body() dto: ForgotPasswordDto) { return this.auth.forgotPassword(dto.email); }

    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto) { return this.auth.resetPassword(dto.token, dto.password); }

    @Put('change-email')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    changeEmail(@Request() req: any, @Body() dto: ChangeEmailDto) {
        return this.auth.changeEmail(req.user.sub, dto.email);
    }

    // ─── ADMIN ───────────────────────────────────────────────────────────────

    /** GET /api/auth/admin/users */
    @Get('admin/users')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async listUsers(@Query('search') search?: string, @Query('plan') plan?: string) {
        const where: any = {};
        if (plan && plan !== 'all') where.plan = plan;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.profile.findMany({
            where,
            select: { id: true, name: true, email: true, plan: true, isAdmin: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 500,
        });
    }

    /** PATCH /api/auth/admin/users/:id/admin */
    @Patch('admin/users/:id/admin')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async toggleAdmin(@Param('id') id: string, @Body() body: { isAdmin: boolean }) {
        return this.prisma.profile.update({ where: { id }, data: { isAdmin: body.isAdmin }, select: { id: true, isAdmin: true } });
    }

    /** PATCH /api/auth/admin/users/:id/plan */
    @Patch('admin/users/:id/plan')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async changePlan(@Param('id') id: string, @Body() body: { plan: string }) {
        return this.prisma.profile.update({ where: { id }, data: { plan: body.plan }, select: { id: true, plan: true } });
    }
}
