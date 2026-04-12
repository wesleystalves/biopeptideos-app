import { PeptidesService } from './peptides.service';
export declare class PeptidesController {
    private readonly service;
    constructor(service: PeptidesService);
    findAll(req: any, search?: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    findOne(slug: string): import(".prisma/client").Prisma.Prisma__PeptideClient<{
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
}
