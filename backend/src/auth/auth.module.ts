import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AutoLoginController } from './auto-login.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailService } from '../notifications/email.service';

@Module({
    imports: [
        PassportModule,
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'peptideos-secret-2026',
            signOptions: { expiresIn: '30d' },
        }),
    ],
    providers: [AuthService, JwtStrategy, EmailService],
    controllers: [AuthController, AutoLoginController],
    exports: [AuthService, JwtModule, EmailService],
})
export class AuthModule { }

