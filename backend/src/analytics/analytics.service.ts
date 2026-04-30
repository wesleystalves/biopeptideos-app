import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    async getDashboard() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const [
            totalLeads,
            newLeadsToday,
            wonLeads,
            // Catalog orders
            totalOrders,
            paidOrders,
            catalogRevenue,
            catalogMonthRevenue,
            // Ebook purchases
            totalEbookPurchases,
            paidEbookPurchases,
            ebookRevenue,
            ebookMonthRevenue,
            ebookBasic,
            ebookPremium,
            // Users
            totalUsers,
            newUsersToday,
            newUsersMonth,
            // Conversations
            conversationCount,
        ] = await Promise.all([
            this.prisma.lead.count(),
            this.prisma.lead.count({ where: { createdAt: { gte: today } } }),
            this.prisma.lead.count({ where: { status: 'won' } }),
            // catalog
            this.prisma.order.count(),
            this.prisma.order.count({ where: { status: 'paid' } }),
            this.prisma.order.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
            this.prisma.order.aggregate({ where: { status: 'paid', createdAt: { gte: thisMonth } }, _sum: { amount: true } }),
            // ebook
            this.prisma.ebookPurchase.count(),
            this.prisma.ebookPurchase.count({ where: { status: 'paid' } }),
            this.prisma.ebookPurchase.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
            this.prisma.ebookPurchase.aggregate({ where: { status: 'paid', createdAt: { gte: thisMonth } }, _sum: { amount: true } }),
            this.prisma.ebookPurchase.count({ where: { status: 'paid', plan: 'basic' } }),
            this.prisma.ebookPurchase.count({ where: { status: 'paid', plan: 'premium' } }),
            // users
            this.prisma.profile.count(),
            this.prisma.profile.count({ where: { createdAt: { gte: today } } }),
            this.prisma.profile.count({ where: { createdAt: { gte: thisMonth } } }),
            // conversations
            this.prisma.conversation.count({ where: { createdAt: { gte: today } } }),
        ]);

        const catalogTotal = catalogRevenue._sum.amount || 0;
        const ebookTotal = ebookRevenue._sum.amount || 0;
        const totalRevenue = catalogTotal + ebookTotal;

        const catalogMonthTotal = catalogMonthRevenue._sum.amount || 0;
        const ebookMonthTotal = ebookMonthRevenue._sum.amount || 0;
        const monthRevenue = catalogMonthTotal + ebookMonthTotal;

        const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0';

        return {
            leads: {
                total: totalLeads,
                today: newLeadsToday,
                won: wonLeads,
                conversionRate: `${conversionRate}%`,
            },
            orders: {
                total: totalOrders,
                paid: paidOrders,
                pendingPayment: totalOrders - paidOrders,
            },
            ebook: {
                total: totalEbookPurchases,
                paid: paidEbookPurchases,
                pending: totalEbookPurchases - paidEbookPurchases,
                basic: ebookBasic,
                premium: ebookPremium,
                revenue: ebookTotal,
                monthRevenue: ebookMonthTotal,
            },
            users: {
                total: totalUsers,
                today: newUsersToday,
                thisMonth: newUsersMonth,
            },
            revenue: {
                total: totalRevenue,
                thisMonth: monthRevenue,
                catalog: catalogTotal,
                ebook: ebookTotal,
                catalogMonth: catalogMonthTotal,
                ebookMonth: ebookMonthTotal,
            },
            conversations: {
                today: conversationCount,
            },
        };
    }

    async getLeadsByChannel() {
        return this.prisma.lead.groupBy({
            by: ['channel'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
        });
    }

    async getOrdersByGateway() {
        return this.prisma.order.groupBy({
            by: ['gateway'],
            _sum: { amount: true },
            _count: { id: true },
            where: { status: 'paid' },
        });
    }

    /** Receita consolidada (ebook + catálogo) por dia nos últimos N dias */
    async getRevenueByDay(days = 30) {
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const [catalogOrders, ebookPurchases] = await Promise.all([
            this.prisma.order.findMany({
                where: { status: 'paid', createdAt: { gte: since } },
                select: { createdAt: true, amount: true },
                orderBy: { createdAt: 'asc' },
            }),
            this.prisma.ebookPurchase.findMany({
                where: { status: 'paid', createdAt: { gte: since } },
                select: { createdAt: true, amount: true, plan: true },
                orderBy: { createdAt: 'asc' },
            }),
        ]);

        // Agrupar por dia
        const dayMap: Record<string, { date: string; catalog: number; ebook: number; total: number }> = {};

        // Preenche os últimos N dias com 0
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const key = d.toISOString().split('T')[0];
            dayMap[key] = { date: key, catalog: 0, ebook: 0, total: 0 };
        }

        for (const o of catalogOrders) {
            const key = o.createdAt.toISOString().split('T')[0];
            if (dayMap[key]) {
                dayMap[key].catalog += o.amount;
                dayMap[key].total += o.amount;
            }
        }

        for (const e of ebookPurchases) {
            const key = e.createdAt.toISOString().split('T')[0];
            if (dayMap[key]) {
                dayMap[key].ebook += e.amount;
                dayMap[key].total += e.amount;
            }
        }

        return Object.values(dayMap).map(d => ({
            ...d,
            catalog: parseFloat(d.catalog.toFixed(2)),
            ebook: parseFloat(d.ebook.toFixed(2)),
            total: parseFloat(d.total.toFixed(2)),
            label: new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        }));
    }

    /** Novos usuários por dia nos últimos N dias */
    async getUsersByDay(days = 30) {
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const users = await this.prisma.profile.findMany({
            where: { createdAt: { gte: since } },
            select: { createdAt: true, plan: true },
            orderBy: { createdAt: 'asc' },
        });

        const dayMap: Record<string, { date: string; label: string; users: number; basic: number; premium: number }> = {};
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const key = d.toISOString().split('T')[0];
            dayMap[key] = {
                date: key,
                label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                users: 0, basic: 0, premium: 0,
            };
        }

        for (const u of users) {
            const key = u.createdAt.toISOString().split('T')[0];
            if (dayMap[key]) {
                dayMap[key].users++;
                if (u.plan === 'basic') dayMap[key].basic++;
                if (u.plan === 'premium') dayMap[key].premium++;
            }
        }

        return Object.values(dayMap);
    }

    /** Lista todas as compras de ebook com dados do usuário */
    async getEbookPurchases(page = 1, limit = 50, status?: string, plan?: string) {
        const where: any = {};
        if (status) where.status = status;
        if (plan) where.plan = plan;

        const [purchases, total] = await Promise.all([
            this.prisma.ebookPurchase.findMany({
                where,
                include: { profile: { select: { name: true, email: true, phone: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.ebookPurchase.count({ where }),
        ]);

        const summary = await this.prisma.ebookPurchase.aggregate({
            where: { status: 'paid' },
            _sum: { amount: true },
            _count: { id: true },
        });

        return {
            purchases,
            total,
            page,
            pages: Math.ceil(total / limit),
            summary: {
                totalPaid: summary._count.id,
                totalRevenue: summary._sum.amount || 0,
            },
        };
    }

    /** Distribuição dos planos dos usuários */
    async getPlanDistribution() {
        const groups = await this.prisma.profile.groupBy({
            by: ['plan'],
            _count: { id: true },
        });
        return groups.map(g => ({ plan: g.plan, count: g._count.id }));
    }
}
