import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    async getDashboard() {
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalLeads,
            newLeadsToday,
            wonLeads,
            totalOrders,
            paidOrders,
            totalRevenue,
            monthRevenue,
            conversationCount,
        ] = await Promise.all([
            this.prisma.lead.count(),
            this.prisma.lead.count({ where: { createdAt: { gte: today } } }),
            this.prisma.lead.count({ where: { status: 'won' } }),
            this.prisma.order.count(),
            this.prisma.order.count({ where: { status: 'paid' } }),
            this.prisma.order.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
            this.prisma.order.aggregate({ where: { status: 'paid', createdAt: { gte: thisMonth } }, _sum: { amount: true } }),
            this.prisma.conversation.count({ where: { createdAt: { gte: today } } }),
        ]);

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
            revenue: {
                total: totalRevenue._sum.amount || 0,
                thisMonth: monthRevenue._sum.amount || 0,
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

    async getRevenueByDay(days = 30) {
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return this.prisma.order.findMany({
            where: { status: 'paid', createdAt: { gte: since } },
            select: { createdAt: true, amount: true, currency: true },
            orderBy: { createdAt: 'asc' },
        });
    }
}
