import { ProtocolsService } from './protocols.service';
export declare class ProtocolsController {
    private readonly service;
    constructor(service: ProtocolsService);
    findAll(req: any): import(".prisma/client").Prisma.PrismaPromise<{
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
    findOne(slug: string): import(".prisma/client").Prisma.Prisma__ProtocolClient<{
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
