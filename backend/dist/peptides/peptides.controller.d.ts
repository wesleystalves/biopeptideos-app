import { PeptidesService } from './peptides.service';
export declare class PeptidesController {
    private readonly service;
    constructor(service: PeptidesService);
    findAll(req: any, search?: string): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        createdAt: Date;
        slug: string;
        description: string | null;
        category: string | null;
        imageUrl: string | null;
        isPro: boolean;
    }[]>;
    findOne(slug: string): import(".prisma/client").Prisma.Prisma__PeptideClient<{
        name: string;
        id: number;
        createdAt: Date;
        slug: string;
        description: string | null;
        category: string | null;
        imageUrl: string | null;
        isPro: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
