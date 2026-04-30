import {
    Controller, Get, Post, Delete, Body, Param,
    UseGuards, Request, BadRequestException, Logger,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { EvolutionService } from './evolution.service';
import { PrismaService } from '../prisma/prisma.service';

// Chaves do banco que este módulo gerencia
const EVO_KEYS = ['evolution.url', 'evolution.api_key', 'evolution.default_instance'];

@ApiTags('evolution')
@Controller('evolution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
export class EvolutionAdminController {
    private readonly logger = new Logger(EvolutionAdminController.name);

    constructor(
        private readonly evo: EvolutionService,
        private readonly prisma: PrismaService,
    ) { }

    /** GET /api/evolution/config — busca config salva */
    @Get('config')
    @ApiOperation({ summary: 'Get Evolution API configuration' })
    async getConfig() {
        const rows = await this.prisma.setting.findMany({
            where: { key: { in: EVO_KEYS } },
        });
        const result: Record<string, string | null> = {};
        for (const k of EVO_KEYS) {
            const row = rows.find(r => r.key === k);
            // Mascarar API key
            result[k] = row?.key === 'evolution.api_key' && row.value
                ? row.value.slice(0, 6) + '••••••••' + row.value.slice(-4)
                : row?.value || null;
        }
        return result;
    }

    /** PUT /api/evolution/config — salva config */
    @Post('config')
    @ApiOperation({ summary: 'Save Evolution API configuration' })
    async saveConfig(@Body() body: { url?: string; apiKey?: string; defaultInstance?: string }) {
        const ops: any[] = [];

        if (body.url !== undefined) ops.push(
            this.prisma.setting.upsert({
                where: { key: 'evolution.url' },
                create: { key: 'evolution.url', value: body.url, updatedAt: new Date() },
                update: { value: body.url, updatedAt: new Date() },
            })
        );

        if (body.apiKey !== undefined && !body.apiKey.includes('••')) ops.push(
            this.prisma.setting.upsert({
                where: { key: 'evolution.api_key' },
                create: { key: 'evolution.api_key', value: body.apiKey, updatedAt: new Date() },
                update: { value: body.apiKey, updatedAt: new Date() },
            })
        );

        if (body.defaultInstance !== undefined) ops.push(
            this.prisma.setting.upsert({
                where: { key: 'evolution.default_instance' },
                create: { key: 'evolution.default_instance', value: body.defaultInstance, updatedAt: new Date() },
                update: { value: body.defaultInstance, updatedAt: new Date() },
            })
        );

        await this.prisma.$transaction(ops);
        return { ok: true, saved: ops.length };
    }

    /** GET /api/evolution/test — testa conexão */
    @Get('test')
    @ApiOperation({ summary: 'Test Evolution API connection' })
    async testConnection() {
        return this.evo.testConnection();
    }

    /** GET /api/evolution/instances — lista instâncias */
    @Get('instances')
    @ApiOperation({ summary: 'List all WhatsApp instances' })
    async listInstances() {
        return this.evo.listInstances();
    }

    /** POST /api/evolution/instances — cria nova instância */
    @Post('instances')
    @ApiOperation({ summary: 'Create new WhatsApp instance' })
    async createInstance(@Request() req: any, @Body() body: { name: string; setupWebhook?: boolean }) {
        if (!body.name?.trim()) throw new BadRequestException('Nome da instância é obrigatório');

        const webhookUrl = body.setupWebhook
            ? `${process.env.APP_URL || 'https://api.peptideosbio.com'}/api/channels/webhook/whatsapp`
            : undefined;

        try {
            const result = await this.evo.createInstance(body.name.trim(), webhookUrl);
            this.logger.log(`Admin criou instância: ${body.name}`);
            return result;
        } catch (err: any) {
            throw new BadRequestException(err.message || 'Erro ao criar instância');
        }
    }

    /** GET /api/evolution/instances/:name/qr — QR code para conectar */
    @Get('instances/:name/qr')
    @ApiOperation({ summary: 'Get QR code to connect WhatsApp' })
    async getQr(@Param('name') name: string) {
        const result = await this.evo.getQrCode(name);
        return result;
    }

    /** GET /api/evolution/instances/:name/status — status da conexão */
    @Get('instances/:name/status')
    @ApiOperation({ summary: 'Get instance connection status' })
    async getStatus(@Param('name') name: string) {
        const status = await this.evo.getStatus(name);
        return { instanceName: name, status };
    }

    /** POST /api/evolution/instances/:name/webhook — configura webhook */
    @Post('instances/:name/webhook')
    @ApiOperation({ summary: 'Configure webhook for instance' })
    async setWebhook(@Param('name') name: string, @Body() body: { url?: string }) {
        const webhookUrl = body.url ||
            `${process.env.APP_URL || 'https://api.peptideosbio.com'}/api/channels/webhook/whatsapp`;
        const result = await this.evo.setWebhook(name, webhookUrl);
        return result;
    }

    /** POST /api/evolution/instances/:name/logout — desconecta */
    @Post('instances/:name/logout')
    @ApiOperation({ summary: 'Logout WhatsApp instance (keep instance)' })
    async logout(@Param('name') name: string) {
        return this.evo.logout(name);
    }

    /** POST /api/evolution/instances/:name/restart — reinicia instância */
    @Post('instances/:name/restart')
    @ApiOperation({ summary: 'Restart WhatsApp instance' })
    async restart(@Param('name') name: string) {
        return this.evo.restartInstance(name);
    }

    /** DELETE /api/evolution/instances/:name — remove instância */
    @Delete('instances/:name')
    @ApiOperation({ summary: 'Delete WhatsApp instance permanently' })
    async deleteInstance(@Param('name') name: string) {
        return this.evo.deleteInstance(name);
    }
}
