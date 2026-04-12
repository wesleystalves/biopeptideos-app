import { PrismaService } from '../prisma/prisma.service';
export declare class ProtocolsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(isPremium?: boolean): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        createdAt: Date;
        slug: string;
        description: string | null;
        isPro: boolean;
    }[]>;
    findBySlug(slug: string): import(".prisma/client").Prisma.Prisma__ProtocolClient<{
        name: string;
        id: number;
        createdAt: Date;
        slug: string;
        description: string | null;
        isPro: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
