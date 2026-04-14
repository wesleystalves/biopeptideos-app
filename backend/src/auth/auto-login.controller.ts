import {
    Controller,
    Get,
    Query,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller('auth')
export class AutoLoginController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) { }

    /**
     * GET /api/auth/auto-login?token=XXX
     * Após pagamento, o cliente recebe este link e faz login sem senha.
     * Token expira em 15min e é de uso único.
     */
    @Get('auto-login')
    async autoLogin(@Query('token') token: string) {
        if (!token) throw new UnauthorizedException('Token inválido');

        const profile = await this.prisma.profile.findUnique({
            where: { autoLoginToken: token },
        });

        if (!profile) throw new UnauthorizedException('Token não encontrado');

        if (!profile.autoLoginExpires || profile.autoLoginExpires < new Date()) {
            throw new UnauthorizedException('Token expirado');
        }

        // Token de uso único — invalida imediatamente
        await this.prisma.profile.update({
            where: { id: profile.id },
            data: { autoLoginToken: null, autoLoginExpires: null },
        });

        const jwtToken = this.jwt.sign({
            sub: profile.id,
            email: profile.email,
            isAdmin: profile.isAdmin,
            plan: profile.plan,
        });

        const { password, autoLoginToken, autoLoginExpires, ...safe } = profile as any;

        return {
            token: jwtToken,
            user: safe,
        };
    }
}
