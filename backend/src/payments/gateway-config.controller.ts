import {
    Controller, Get, Put, Body, UseGuards, Request,
    ForbiddenException, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';

/* ── Chaves que este módulo gerencia ────────────────────── */
const GATEWAY_KEYS = [
    'asaas.env',              // 'sandbox' | 'production'
    'asaas.api_key',          // API Key (sandbox)
    'asaas.api_key_prod',     // API Key (production)
    'asaas.webhook_token',    // Token para verificar webhooks
    'asaas.webhook_url',      // URL pública do webhook
    'asaas.default_methods',  // JSON: ["PIX","BOLETO","CREDIT_CARD"]
    'asaas.pix_key',          // Chave Pix do recebedor
    'asaas.due_days',         // dias de vencimento do boleto (default "3")
    'asaas.fine_pct',         // % de multa pós-vencimento (default "2")
    'asaas.interest_pct',     // % juros ao mês (default "1")
    'asaas.split_enabled',    // "true" | "false"
    'asaas.split_wallet_id',  // Wallet ID para split
    'asaas.notifications_email', // email para receber notificações
    'price.basic',            // Preço do plano Ebook (default "9.90")
    'price.premium',          // Preço do plano Premium (default "29.90")
];

@ApiTags('admin/gateway')
@Controller('admin/gateway')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GatewayConfigController {
    constructor(private readonly prisma: PrismaService) { }

    private requireAdmin(req: any) {
        if (!req.user?.isAdmin) throw new ForbiddenException('Admin only');
    }

    @Get()
    @ApiOperation({ summary: 'Get all gateway config keys (admin only)' })
    async getConfig(@Request() req) {
        this.requireAdmin(req);

        const rows = await this.prisma.setting.findMany({
            where: { key: { in: GATEWAY_KEYS } },
        });

        // Mascarar API keys nas últimas posições
        const masked = rows.map(r => ({
            key: r.key,
            value: r.key.includes('api_key') && r.value.length > 8
                ? r.value.slice(0, 4) + '●●●●●●●●●●●●' + r.value.slice(-4)
                : r.value,
            updatedAt: r.updatedAt,
        }));

        // Retornar todas as chaves, mesmo as não configuradas
        const result: Record<string, any> = {};
        for (const k of GATEWAY_KEYS) {
            const row = masked.find(r => r.key === k);
            result[k] = row ?? { key: k, value: null, updatedAt: null };
        }

        return result;
    }

    @Get('raw')
    @ApiOperation({ summary: 'Get raw config values for internal use (admin only)' })
    async getRawConfig(@Request() req) {
        this.requireAdmin(req);

        const rows = await this.prisma.setting.findMany({
            where: { key: { in: GATEWAY_KEYS } },
        });

        const result: Record<string, string | null> = {};
        for (const k of GATEWAY_KEYS) {
            result[k] = rows.find(r => r.key === k)?.value ?? null;
        }
        return result;
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Save/update gateway config keys (admin only)' })
    async saveConfig(
        @Request() req,
        @Body() body: Record<string, string>,
    ) {
        this.requireAdmin(req);

        const allowed = Object.entries(body).filter(([k]) => GATEWAY_KEYS.includes(k));

        await this.prisma.$transaction(
            allowed.map(([key, value]) =>
                this.prisma.setting.upsert({
                    where: { key },
                    create: { key, value: String(value) },
                    update: { value: String(value) },
                })
            )
        );

        return { ok: true, saved: allowed.length };
    }

    @Get('test')
    @ApiOperation({ summary: 'Test Asaas connection using saved credentials (admin only)' })
    async testConnection(@Request() req) {
        this.requireAdmin(req);

        const envRow = await this.prisma.setting.findUnique({ where: { key: 'asaas.env' } });
        const keyRow = await this.prisma.setting.findUnique({
            where: { key: envRow?.value === 'production' ? 'asaas.api_key_prod' : 'asaas.api_key' },
        });

        if (!keyRow?.value) return { ok: false, error: 'API key not configured' };

        const baseUrl = envRow?.value === 'production'
            ? 'https://api.asaas.com/v3'
            : 'https://sandbox.asaas.com/api/v3';

        try {
            const res = await fetch(`${baseUrl}/customers?limit=1`, {
                headers: { access_token: keyRow.value },
            });
            const data = await res.json();
            if (res.ok) return { ok: true, env: envRow?.value ?? 'sandbox', customers: data.totalCount };
            return { ok: false, error: data.errors?.[0]?.description ?? 'API error' };
        } catch (e: any) {
            return { ok: false, error: e.message };
        }
    }
}
