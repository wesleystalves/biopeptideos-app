export interface PaymentProvider {
    name: string;
    createPayment(data: CreatePaymentDto): Promise<PaymentResult>;
    createSubscription(data: CreateSubscriptionDto): Promise<PaymentResult>;
    cancelSubscription(subscriptionId: string): Promise<boolean>;
    getWebhookEvent(payload: any, signature: string): Promise<WebhookEvent>;
}

export interface CreatePaymentDto {
    amount: number;
    currency: string;
    customerId: string;
    customerEmail: string;
    description?: string;
    metadata?: Record<string, string>;
}

export interface CreateSubscriptionDto {
    customerId: string;
    customerEmail: string;
    priceId: string;
    metadata?: Record<string, string>;
}

export interface PaymentResult {
    id: string;
    status: string;
    paymentUrl?: string;
    subscriptionId?: string;
    raw?: any;
}

export interface WebhookEvent {
    type: string;
    paymentId?: string;
    subscriptionId?: string;
    customerId?: string;
    status?: string;
    raw: any;
}
