import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

@Injectable()
export class CrmService {
    constructor(private readonly prisma: PrismaService) { }

    async createLead(data: {
        name?: string;
        email?: string;
        phone?: string;
        channel: string;
        countryCode?: string;
        source?: string;
    }) {
        return this.prisma.lead.upsert({
            where: { phone_channel: { phone: data.phone || '', channel: data.channel } },
            create: {
                ...data,
                status: 'new',
                score: 0,
                tags: [],
            },
            update: { updatedAt: new Date() },
        });
    }

    async updateLeadStatus(leadId: string, status: LeadStatus) {
        return this.prisma.lead.update({
            where: { id: leadId },
            data: { status },
        });
    }

    async scoreUp(leadId: string, points: number) {
        return this.prisma.lead.update({
            where: { id: leadId },
            data: { score: { increment: points } },
        });
    }

    async addTag(leadId: string, tag: string) {
        const lead = await this.prisma.lead.findUniqueOrThrow({ where: { id: leadId } });
        const tags = Array.isArray(lead.tags) ? lead.tags as string[] : [];
        if (!tags.includes(tag)) {
            return this.prisma.lead.update({
                where: { id: leadId },
                data: { tags: [...tags, tag] },
            });
        }
        return lead;
    }

    async getLeads(filters?: { status?: string; channel?: string; minScore?: number }) {
        return this.prisma.lead.findMany({
            where: {
                ...(filters?.status && { status: filters.status }),
                ...(filters?.channel && { channel: filters.channel }),
                ...(filters?.minScore && { score: { gte: filters.minScore } }),
            },
            orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
        });
    }

    async getLeadById(id: string) {
        return this.prisma.lead.findUniqueOrThrow({
            where: { id },
            include: { conversations: { orderBy: { createdAt: 'desc' }, take: 50 } },
        });
    }

    async findOrCreateByPhone(phone: string, channel: string) {
        return this.prisma.lead.upsert({
            where: { phone_channel: { phone, channel } },
            create: { phone, channel, status: 'new', score: 0, tags: [] },
            update: {},
        });
    }

    async getPipelineStats() {
        const statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
        const stats: Record<string, number> = {};
        for (const s of statuses) {
            stats[s] = await this.prisma.lead.count({ where: { status: s } });
        }
        return stats;
    }
}
