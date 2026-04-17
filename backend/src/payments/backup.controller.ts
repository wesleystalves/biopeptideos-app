import {
    Controller, Get, UseGuards, Request,
    ForbiddenException, StreamableFile, Header,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('admin/backup')
@Controller('admin/backup')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BackupController {
    constructor(private readonly prisma: PrismaService) { }

    private requireAdmin(req: any) {
        if (!req.user?.isAdmin) throw new ForbiddenException('Admin only');
    }

    /**
     * GET /api/admin/backup
     * Retorna um JSON completo com todos os dados do sistema para download.
     */
    @Get()
    @ApiOperation({ summary: 'Gera backup completo do sistema em JSON (admin)' })
    @Header('Content-Type', 'application/json')
    @Header('Content-Disposition', 'attachment; filename="biopeptideos-backup.json"')
    async generateBackup(@Request() req): Promise<StreamableFile> {
        this.requireAdmin(req);

        const [
            profiles,
            products,
            orders,
            guides,
            peptides,
            protocols,
            coupons,
            settings,
            conversations,
            leads,
            complianceRules,
        ] = await Promise.all([
            this.prisma.profile.findMany({
                select: {
                    id: true, email: true, name: true, displayName: true,
                    plan: true, isAdmin: true, createdAt: true, updatedAt: true,
                    phone: true, countryCode: true,
                },
            }),
            this.prisma.product.findMany().catch(() => []),
            this.prisma.order.findMany().catch(() => []),
            this.prisma.guide.findMany().catch(() => []),
            this.prisma.peptide.findMany().catch(() => []),
            this.prisma.protocol.findMany().catch(() => []),
            this.prisma.coupon.findMany().catch(() => []),
            this.prisma.setting.findMany({
                // Omitir chaves sensíveis do backup
                where: {
                    key: {
                        notIn: ['asaas.api_key', 'asaas.api_key_prod', 'asaas.webhook_token'],
                    },
                },
            }),
            this.prisma.conversation.findMany().catch(() => []),
            this.prisma.lead.findMany().catch(() => []),
            this.prisma.complianceRule.findMany().catch(() => []),
        ]);

        const backup = {
            meta: {
                version: '1.0',
                generatedAt: new Date().toISOString(),
                system: 'BioPeptideos Platform',
                counts: {
                    profiles: profiles.length,
                    products: products.length,
                    orders: orders.length,
                    guides: guides.length,
                    peptides: peptides.length,
                    protocols: protocols.length,
                    coupons: coupons.length,
                    conversations: conversations.length,
                    leads: leads.length,
                },
            },
            data: {
                profiles,
                products,
                orders,
                guides,
                peptides,
                protocols,
                coupons,
                settings,
                conversations,
                leads,
                complianceRules,
            },
        };

        const json = JSON.stringify(backup, null, 2);
        const buffer = Buffer.from(json, 'utf-8');
        return new StreamableFile(buffer);
    }
}
