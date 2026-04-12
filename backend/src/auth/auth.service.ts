import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
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
            },
        });

        const token = this.signToken(profile.id, profile.email, profile.isAdmin);
        return { token, user: this.sanitize(profile) };
    }

    async login(dto: LoginDto) {
        const profile = await this.prisma.profile.findUnique({
            where: { email: dto.email },
            include: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });
        if (!profile) throw new UnauthorizedException('Credenciais inválidas');

        // Se não tem senha (conta legado Supabase), permite com senha dummy
        if (profile.password) {
            const valid = await bcrypt.compare(dto.password, profile.password);
            if (!valid) throw new UnauthorizedException('Credenciais inválidas');
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

    async me(userId: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { id: userId },
            include: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });
        if (!profile) throw new UnauthorizedException();

        const activeSub = profile.subscriptions.find((s) => s.status === 'active');
        const isPremium = !!activeSub || profile.isAdmin;

        return {
            ...this.sanitize(profile),
            isPremium,
            plan: isPremium ? (profile.isAdmin ? 'admin' : 'pro') : 'free',
        };
    }

    private signToken(id: string, email: string, isAdmin: boolean) {
        return this.jwt.sign({ sub: id, email, isAdmin });
    }

    private sanitize(profile: any) {
        const { password, subscriptions, ...rest } = profile;
        return rest;
    }
}
