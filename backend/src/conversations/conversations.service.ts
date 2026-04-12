import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type ConversationChannel = 'whatsapp' | 'telegram' | 'email' | 'chat';

@Injectable()
export class ConversationsService {
    constructor(private readonly prisma: PrismaService) { }

    async saveMessage(data: {
        leadId: string;
        channel: ConversationChannel;
        role: 'user' | 'assistant' | 'system';
        content: string;
        metadata?: Record<string, any>;
    }) {
        return this.prisma.conversation.create({ data });
    }

    async getHistory(leadId: string, limit = 50) {
        return this.prisma.conversation.findMany({
            where: { leadId },
            orderBy: { createdAt: 'asc' },
            take: limit,
        });
    }

    async getInbox(filters?: { channel?: string; unreadOnly?: boolean }) {
        // Agrupa a última mensagem por lead
        const recentLeads = await this.prisma.conversation.groupBy({
            by: ['leadId'],
            _max: { createdAt: true },
            where: filters?.channel ? { channel: filters.channel } : undefined,
            orderBy: { _max: { createdAt: 'desc' } },
            take: 50,
        });

        const conversations = await Promise.all(
            recentLeads.map(async (r) => {
                const lead = await this.prisma.lead.findUnique({ where: { id: r.leadId } });
                const lastMsg = await this.prisma.conversation.findFirst({
                    where: { leadId: r.leadId },
                    orderBy: { createdAt: 'desc' },
                });
                return { lead, lastMessage: lastMsg };
            })
        );

        return conversations;
    }

    async getStats() {
        const channels: ConversationChannel[] = ['whatsapp', 'telegram', 'email', 'chat'];
        const stats: Record<string, number> = {};
        for (const ch of channels) {
            stats[ch] = await this.prisma.conversation.count({
                where: { channel: ch, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            });
        }
        return stats;
    }
}
