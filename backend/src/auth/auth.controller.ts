import { Controller, Post, Get, Put, Body, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt.guard';
import { IsEmail, IsString, MinLength } from 'class-validator';

class ForgotPasswordDto { @IsEmail() email: string; }
class ResetPasswordDto { @IsString() token: string; @IsString() @MinLength(6) password: string; }
class ChangeEmailDto { @IsEmail() email: string; }

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) { return this.auth.register(dto); }

    @Post('login')
    login(@Body() dto: LoginDto) { return this.auth.login(dto); }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    me(@Request() req) { return this.auth.me(req.user.sub); }

    /** GET /api/auth/verify-email?token=xxx */
    @Get('verify-email')
    verifyEmail(@Query('token') token: string) { return this.auth.verifyEmail(token); }

    /** POST /api/auth/send-verify-email  (autenticado) */
    @Post('send-verify-email')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    sendVerifyEmail(@Request() req) { return this.auth.sendVerifyEmail(req.user.sub); }

    /** POST /api/auth/forgot-password */
    @Post('forgot-password')
    forgotPassword(@Body() dto: ForgotPasswordDto) { return this.auth.forgotPassword(dto.email); }

    /** POST /api/auth/reset-password */
    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto) { return this.auth.resetPassword(dto.token, dto.password); }

    /** PUT /api/auth/change-email  (autenticado) */
    @Put('change-email')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    changeEmail(@Request() req, @Body() dto: ChangeEmailDto) {
        return this.auth.changeEmail(req.user.sub, dto.email);
    }
}
