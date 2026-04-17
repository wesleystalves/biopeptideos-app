import {
    Controller, Get, UseGuards, Request,
    ForbiddenException, Res,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';

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
     * Gera backup completo do sistema e retorna como JSON para download.
     */
    @Get()
    @ApiOperation({ summary: 'Backup completo do sistema em JSON (admin)' })
    async generateBackup(@Request() req: any, @Res() res: Response): Promise<void> {
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
            ebookPurchases,
        ] = await Promise.all([
            this.prisma.profile.findMany({
                select: {
                    id: true, email: true, name: true, displayName: true,
                    plan: true, isAdmin: true, createdAt: true, updatedAt: true,
                    phone: true, countryCode: true,
                },
            }),
            this.prisma.product.findMany(),
            this.prisma.order.findMany(),
            this.prisma.guide.findMany(),
            this.prisma.peptide.findMany(),
            this.prisma.protocol.findMany(),
            this.prisma.coupon.findMany(),
            this.prisma.setting.findMany({
                where: {
                    key: { notIn: ['asaas.api_key', 'asaas.api_key_prod', 'asaas.webhook_token'] },
                },
            }),
            this.prisma.conversation.findMany(),
            this.prisma.lead.findMany(),
            this.prisma.complianceRule.findMany(),
            this.prisma.ebookPurchase.findMany(),
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
                    ebookPurchases: ebookPurchases.length,
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
                ebookPurchases,
            },
        };

        const now = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="biopeptideos-backup-${now}.json"`);
        res.send(JSON.stringify(backup, null, 2));
    }
}
