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
        id: string;
        plan: string;
        createdAt: Date;
        userId: string;
        status: string;
        gateway: string | null;
        gatewayId: string | null;
        expiresAt: Date | null;
    }>;
}
