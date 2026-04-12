import { PrismaService } from '../prisma/prisma.service';
export declare class PeptidesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(isPremium?: boolean): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        mechanism: string | null;
        benefits: string[];
        variants: string[];
        stability: string | null;
        halfLife: string | null;
        reconstitution: string | null;
        storage: string | null;
        isFree: boolean;
        imagePath: string | null;
        slug: string | null;
    }[]>;
    findBySlug(slug: string): import(".prisma/client").Prisma.Prisma__PeptideClient<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        mechanism: string | null;
        benefits: string[];
        variants: string[];
        stability: string | null;
        halfLife: string | null;
        reconstitution: string | null;
        storage: string | null;
        isFree: boolean;
        imagePath: string | null;
        slug: string | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    search(query: string): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        description: string | null;
        mechanism: string | null;
        benefits: string[];
        variants: string[];
        stability: string | null;
        halfLife: string | null;
        reconstitution: string | null;
        storage: string | null;
        isFree: boolean;
        imagePath: string | null;
        slug: string | null;
    }[]>;
}
