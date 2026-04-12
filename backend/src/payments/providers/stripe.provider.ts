import { Injectable, Logger } from '@nestjs/common';
const Stripe = require('stripe');
import type {
    PaymentProvider,
    CreatePaymentDto,
    CreateSubscriptionDto,
    PaymentResult,
    WebhookEvent,
} from '../payment-provider.interface';

@Injectable()
export class StripeProvider implements PaymentProvider {
    readonly name = 'stripe';
    private _stripe: any = null;
    private readonly logger = new Logger(StripeProvider.name);

    private get stripe() {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) {
            this.logger.warn('Stripe not configured — STRIPE_SECRET_KEY is empty');
            return null;
        }
        if (!this._stripe) {
            this._stripe = new Stripe(key, { apiVersion: '2024-04-10' });
        }
        return this._stripe;
    }

    constructor() { }

    async createPayment(data: CreatePaymentDto): Promise<PaymentResult> {
        const session = await this.stripe.checkout.sessions.create({
            customer_email: data.customerEmail,
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: data.currency.toLowerCase(),
                        unit_amount: Math.round(data.amount * 100),
                        product_data: { name: data.description || 'BioPeptidios' },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
            metadata: data.metadata || {},
        });

        return { id: session.id, status: 'pending', paymentUrl: session.url || '' };
    }

    async createSubscription(data: CreateSubscriptionDto): Promise<PaymentResult> {
        const session = await this.stripe.checkout.sessions.create({
            customer_email: data.customerEmail,
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{ price: data.priceId, quantity: 1 }],
            success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
            metadata: data.metadata || {},
        });

        return { id: session.id, status: 'pending', paymentUrl: session.url || '' };
    }

    async cancelSubscription(subscriptionId: string): Promise<boolean> {
        await this.stripe.subscriptions.cancel(subscriptionId);
        return true;
    }

    async getWebhookEvent(payload: Buffer, signature: string): Promise<WebhookEvent> {
        const event = this.stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || '',
        );

        return {
            type: event.type,
            raw: event,
            paymentId: (event.data.object as any).id,
            status: (event.data.object as any).status,
            customerId: (event.data.object as any).customer,
        };
    }
}
