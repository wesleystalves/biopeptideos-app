import { ProtocolsService } from './protocols.service';
export declare class ProtocolsController {
    private readonly service;
    constructor(service: ProtocolsService);
    findAll(req: any): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        createdAt: Date;
        slug: string;
        description: string | null;
        isPro: boolean;
    }[]>;
    findOne(slug: string): import(".prisma/client").Prisma.Prisma__ProtocolClient<{
        name: string;
        id: number;
        createdAt: Date;
        slug: string;
        description: string | null;
        isPro: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
