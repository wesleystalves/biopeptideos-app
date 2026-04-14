import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    ForbiddenException,
    Get,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { EmailService } from './email.service';
import { IsString, IsOptional, IsArray, IsEmail } from 'class-validator';

export class SendTestDto {
    @IsEmail()
    to: string;
}

export class BroadcastDto {
    @IsArray()
    @IsEmail({}, { each: true })
    to: string[];

    @IsString()
    subject: string;

    @IsString()
    title: string;

    @IsString()
    body: string; // HTML permitido

    @IsString()
    @IsOptional()
    ctaLabel?: string;

    @IsString()
    @IsOptional()
    ctaUrl?: string;
}

export class UpsellDto {
    @IsArray()
    @IsEmail({}, { each: true })
    to: string[]; // Lista de e-mails que serão alvo do upsell

    @IsString()
    @IsOptional()
    coupon?: string;
}

function admin(req: any) {
    if (!req.user?.isAdmin) throw new ForbiddenException('Somente administradores');
}

@ApiTags('email-admin')
@Controller('admin/email')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmailBroadcastController {
    constructor(private readonly emailService: EmailService) { }

    @Post('test')
    @ApiOperation({ summary: 'Envia e-mail de teste para um endereço (admin)' })
    async test(@Request() req: any, @Body() dto: SendTestDto) {
        admin(req);
        await this.emailService.sendTest(dto.to);
        return { ok: true, message: `E-mail de teste enviado para ${dto.to}` };
    }

    @Post('broadcast')
    @ApiOperation({ summary: 'Envia broadcast para lista de e-mails (admin)' })
    async broadcast(@Request() req: any, @Body() dto: BroadcastDto) {
        admin(req);
        return this.emailService.sendBroadcast(dto);
    }

    @Post('upsell-premium')
    @ApiOperation({ summary: 'Dispara campanha de upsell premium para lista de e-mails (admin)' })
    async upsell(@Request() req: any, @Body() dto: UpsellDto) {
        admin(req);
        const promises = dto.to.map(email =>
            this.emailService.sendUpsellPremium({
                to: email,
                coupon: dto.coupon,
            }),
        );
        const results = await Promise.allSettled(promises);
        const sent = results.filter(r => r.status === 'fulfilled').length;
        return { sent, total: dto.to.length };
    }
}
