import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
    constructor(private readonly prisma: PrismaService) { }

    async getStatus(profileId: string) {
        const subs = await this.prisma.subscription.findMany({
            where: { userId: profileId },
            orderBy: { createdAt: 'desc' },
            take: 1,
        });
        const sub = subs[0];
        return {
            hasSub: !!sub,
            plan: sub?.plan ?? 'free',
            status: sub?.status ?? 'inactive',
            expiresAt: sub?.expiresAt ?? null,
        };
    }

    async activate(profileId: string, plan: string) {
        return this.prisma.subscription.create({
            data: {
                userId: profileId,
                plan,
                status: 'active',
            },
        });
    }
}
