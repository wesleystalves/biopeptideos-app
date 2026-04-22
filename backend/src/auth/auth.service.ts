import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { EmailService } from '../notifications/email.service';

// Hierarquia de planos:  free < basic < premium < admin
const PLAN_HIERARCHY = ['free', 'basic', 'premium'];

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly email: EmailService,
    ) { }

    async register(dto: RegisterDto) {
        const exists = await this.prisma.profile.findUnique({
            where: { email: dto.email },
        });
        if (exists) throw new ConflictException('E-mail já cadastrado');

        const hashed = await bcrypt.hash(dto.password, 10);
        const profile = await this.prisma.profile.create({
            data: {
                email: dto.email,
                name: dto.name,
                displayName: dto.name,
                password: hashed,
                plan: 'free',
            },
        });

        const token = this.signToken(profile.id, profile.email, profile.isAdmin, profile.plan);

        // Envia email de boas-vindas (não bloqueia o cadastro se falhar)
        this.email.sendWelcome(profile.email, profile.name || profile.displayName || '');

        return { token, user: this.sanitize(profile) };
    }

    async login(dto: LoginDto) {
        const profile = await this.prisma.profile.findUnique({
            where: { email: dto.email },
        });
        if (!profile) throw new UnauthorizedException('Credenciais inválidas');

        if (profile.password) {
            const valid = await bcrypt.compare(dto.password, profile.password);
            if (!valid) throw new UnauthorizedException('Credenciais inválidas');
        }

        // Plano real do banco — admin tem acesso total
        const plan = profile.isAdmin ? 'admin' : profile.plan;

        const token = this.signToken(profile.id, profile.email, profile.isAdmin, plan);
        return {
            token,
            user: {
                ...this.sanitize(profile),
                plan,
                isPremium: profile.isAdmin || ['premium'].includes(profile.plan),
                isAdmin: profile.isAdmin,
            },
        };
    }

    async me(userId: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { id: userId },
        });
        if (!profile) throw new UnauthorizedException();

        const plan = profile.isAdmin ? 'admin' : profile.plan;

        return {
            ...this.sanitize(profile),
            plan,
            isPremium: profile.isAdmin || ['premium'].includes(profile.plan),
            isAdmin: profile.isAdmin,
        };
    }

    private signToken(id: string, email: string, isAdmin: boolean, plan: string) {
        // plan e isAdmin no JWT → PlanGuard pode verificar sem ir ao banco
        return this.jwt.sign({ sub: id, email, isAdmin, plan });
    }

    private sanitize(profile: any) {
        const { password, subscriptions, autoLoginToken, autoLoginExpires, ...rest } = profile;
        return rest;
    }
}
