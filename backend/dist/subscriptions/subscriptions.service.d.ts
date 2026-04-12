import { PrismaService } from '../prisma/prisma.service';
export declare class SubscriptionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStatus(profileId: string): Promise<{
        hasSub: boolean;
        plan: string;
        status: string;
        expiresAt: Date;
    }>;
    activate(profileId: string, plan: string): Promise<{
        id: number;
        plan: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: string | null;
        activatedAt: Date | null;
        expiresAt: Date | null;
        paymentProvider: string | null;
        externalId: string | null;
    }>;
}
