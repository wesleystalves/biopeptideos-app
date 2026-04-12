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
        id: string;
        plan: string;
        createdAt: Date;
        userId: string;
        status: string;
        gateway: string | null;
        gatewayId: string | null;
        expiresAt: Date | null;
    }>;
}
