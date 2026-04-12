import { PrismaService } from '../prisma/prisma.service';
export declare class ProfilesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        email: string;
        name: string;
        id: string;
        isAdmin: boolean;
        plan: string;
        createdAt: Date;
        subscriptions: {
            plan: string;
            status: string;
            expiresAt: Date;
        }[];
    }[]>;
}
