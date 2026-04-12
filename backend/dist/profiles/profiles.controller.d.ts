import { ProfilesService } from './profiles.service';
export declare class ProfilesController {
    private readonly service;
    constructor(service: ProfilesService);
    findAll(req: any): import(".prisma/client").Prisma.PrismaPromise<{
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
