import { PrismaService } from '../prisma/prisma.service';
export declare class PeptidesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(isPremium?: boolean): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        createdAt: Date;
        slug: string;
        description: string | null;
        category: string | null;
        imageUrl: string | null;
        isPro: boolean;
    }[]>;
    findBySlug(slug: string): import(".prisma/client").Prisma.Prisma__PeptideClient<{
        name: string;
        id: number;
        createdAt: Date;
        slug: string;
        description: string | null;
        category: string | null;
        imageUrl: string | null;
        isPro: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    search(query: string): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        createdAt: Date;
        slug: string;
        description: string | null;
        category: string | null;
        imageUrl: string | null;
        isPro: boolean;
    }[]>;
}
