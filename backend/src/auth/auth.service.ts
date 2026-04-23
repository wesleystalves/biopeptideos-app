import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly email: EmailService,
    ) { }

    // ── Registro ─────────────────────────────────────────────────────────────
    async register(dto: RegisterDto) {
        const exists = await this.prisma.profile.findUnique({ where: { email: dto.email } });
        if (exists) throw new ConflictException('E-mail já cadastrado');

        const hashed = await bcrypt.hash(dto.password, 10);
        const verifyToken = crypto.randomBytes(32).toString('hex');

        const profile = await this.prisma.profile.create({
            data: {
                email: dto.email,
                name: dto.name,
                displayName: dto.name,
                password: hashed,
                plan: 'free',
                emailVerifyToken: verifyToken,
                emailVerifyExpires: new Date(Date.now() + 48 * 60 * 60 * 1000),
            },
        });

        const token = this.signToken(profile.id, profile.email, profile.isAdmin, profile.plan);

        // Fire-and-forget: não bloqueia se falhar
        this.email.sendWelcome(profile.email, profile.name || profile.displayName || '');
        this.email.sendEmailVerification({ to: profile.email, name: profile.name || '', token: verifyToken });

        return { token, user: this.sanitize(profile) };
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    async login(dto: LoginDto) {
        const profile = await this.prisma.profile.findUnique({ where: { email: dto.email } });
        if (!profile) throw new UnauthorizedException('Credenciais inválidas');

        if (profile.password) {
            const valid = await bcrypt.compare(dto.password, profile.password);
            if (!valid) throw new UnauthorizedException('Credenciais inválidas');
        }

        const plan = profile.isAdmin ? 'admin' : profile.plan;
        const token = this.signToken(profile.id, profile.email, profile.isAdmin, plan);
        return {
            token,
            user: {
                ...this.sanitize(profile),
                plan,
                isPremium: profile.isAdmin || ['premium', 'basic'].includes(profile.plan),
                isAdmin: profile.isAdmin,
                emailVerified: profile.emailVerified,
            },
        };
    }

    // ── Me ────────────────────────────────────────────────────────────────────
    async me(userId: string) {
        const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
        if (!profile) throw new UnauthorizedException();

        const plan = profile.isAdmin ? 'admin' : profile.plan;
        return {
            ...this.sanitize(profile),
            plan,
            isPremium: profile.isAdmin || ['premium', 'basic'].includes(profile.plan),
            isAdmin: profile.isAdmin,
            emailVerified: profile.emailVerified,
        };
    }

    // ── Verificar e-mail ──────────────────────────────────────────────────────
    async verifyEmail(token: string) {
        const profile = await this.prisma.profile.findFirst({
            where: {
                emailVerifyToken: token,
                emailVerifyExpires: { gt: new Date() },
            },
        });
        if (!profile) throw new BadRequestException('Link de verificação inválido ou expirado');

        await this.prisma.profile.update({
            where: { id: profile.id },
            data: {
                emailVerified: true,
                emailVerifyToken: null,
                emailVerifyExpires: null,
            },
        });

        return { message: 'E-mail confirmado com sucesso!' };
    }

    // ── Reenviar verificação ──────────────────────────────────────────────────
    async sendVerifyEmail(userId: string) {
        const profile = await this.prisma.profile.findUnique({ where: { id: userId } });
        if (!profile) throw new NotFoundException('Usuário não encontrado');
        if (profile.emailVerified) throw new BadRequestException('E-mail já verificado');

        const token = crypto.randomBytes(32).toString('hex');
        await this.prisma.profile.update({
            where: { id: profile.id },
            data: {
                emailVerifyToken: token,
                emailVerifyExpires: new Date(Date.now() + 48 * 60 * 60 * 1000),
            },
        });

        await this.email.sendEmailVerification({ to: profile.email, name: profile.name || '', token });
        return { message: 'E-mail de verificação reenviado' };
    }

    // ── Esqueci minha senha ───────────────────────────────────────────────────
    async forgotPassword(email: string) {
        const profile = await this.prisma.profile.findUnique({ where: { email } });
        // Retorna sucesso mesmo se não encontrar (segurança: não revelar existência)
        if (!profile) return { message: 'Se o e-mail existir, você receberá um link de redefinição' };

        const token = crypto.randomBytes(32).toString('hex');
        await this.prisma.profile.update({
            where: { id: profile.id },
            data: {
                passwordResetToken: token,
                passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
            },
        });

        await this.email.sendPasswordReset({ to: profile.email, name: profile.name || '', token });
        return { message: 'Se o e-mail existir, você receberá um link de redefinição' };
    }

    // ── Redefinir senha ───────────────────────────────────────────────────────
    async resetPassword(token: string, newPassword: string) {
        const profile = await this.prisma.profile.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: { gt: new Date() },
            },
        });
        if (!profile) throw new BadRequestException('Link de redefinição inválido ou expirado');

        const hashed = await bcrypt.hash(newPassword, 10);
        await this.prisma.profile.update({
            where: { id: profile.id },
            data: {
                password: hashed,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });

        return { message: 'Senha redefinida com sucesso!' };
    }

    // ── Trocar e-mail ─────────────────────────────────────────────────────────
    async changeEmail(userId: string, newEmail: string) {
        const conflict = await this.prisma.profile.findUnique({ where: { email: newEmail } });
        if (conflict && conflict.id !== userId) throw new ConflictException('Este e-mail já está em uso');

        const token = crypto.randomBytes(32).toString('hex');
        const profile = await this.prisma.profile.update({
            where: { id: userId },
            data: {
                email: newEmail,
                emailVerified: false,
                emailVerifyToken: token,
                emailVerifyExpires: new Date(Date.now() + 48 * 60 * 60 * 1000),
            },
        });

        await this.email.sendEmailVerification({ to: newEmail, name: profile.name || '', token });
        return { message: 'E-mail atualizado. Verifique sua nova caixa de entrada.' };
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private signToken(id: string, email: string, isAdmin: boolean, plan: string) {
        return this.jwt.sign({ sub: id, email, isAdmin, plan });
    }

    private sanitize(profile: any) {
        const { password, subscriptions, autoLoginToken, autoLoginExpires,
            emailVerifyToken, emailVerifyExpires, passwordResetToken, passwordResetExpires, ...rest } = profile;
        return rest;
    }
}
