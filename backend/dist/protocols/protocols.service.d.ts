import { PrismaService } from '../prisma/prisma.service';
export declare class ProtocolsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(isPremium?: boolean): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        description: string | null;
        isFree: boolean;
        slug: string;
        peptides: string[];
        title: string;
        duration: string | null;
        objective: string | null;
    }[]>;
    findBySlug(slug: string): import(".prisma/client").Prisma.Prisma__ProtocolClient<{
        id: string;
        createdAt: Date;
        description: string | null;
        isFree: boolean;
        slug: string;
        peptides: string[];
        title: string;
        duration: string | null;
        objective: string | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
