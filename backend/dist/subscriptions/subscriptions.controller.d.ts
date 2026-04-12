import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private readonly service;
    constructor(service: SubscriptionsService);
    getStatus(req: any): Promise<{
        hasSub: boolean;
        plan: string;
        status: string;
        expiresAt: Date;
    }>;
    activate(req: any, body: {
        plan: string;
    }): Promise<{
        id: number;
        plan: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: string | null;
        activatedAt: Date | null;
        expiresAt: Date | null;
        paymentProvider: string | null;
        externalId: string | null;
    }>;
}
