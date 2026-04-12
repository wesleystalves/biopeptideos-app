import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
    PaymentProvider,
    CreatePaymentDto,
    CreateSubscriptionDto,
    PaymentResult,
    WebhookEvent,
} from '../payment-provider.interface';

@Injectable()
export class AsaasProvider implements PaymentProvider {
    readonly name = 'asaas';
    private readonly api = axios.create({
        baseURL: process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3',
        headers: { access_token: process.env.ASAAS_API_KEY || '' },
    });

    async createPayment(data: CreatePaymentDto): Promise<PaymentResult> {
        // Criar ou buscar customer no Asaas
        const customer = await this.api.post('/customers', {
            name: data.customerId,
            email: data.customerEmail,
        });

        const charge = await this.api.post('/payments', {
            customer: customer.data.id,
            billingType: 'PIX',
            value: data.amount,
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            description: data.description || 'BioPeptidios',
        });

        const pix = await this.api.get(`/payments/${charge.data.id}/pixQrCode`);

        return {
            id: charge.data.id,
            status: charge.data.status,
            paymentUrl: pix.data.encodedImage || charge.data.invoiceUrl,
        };
    }

    async createSubscription(data: CreateSubscriptionDto): Promise<PaymentResult> {
        const customer = await this.api.post('/customers', {
            name: data.customerId,
            email: data.customerEmail,
        });

        const sub = await this.api.post('/subscriptions', {
            customer: customer.data.id,
            billingType: 'CREDIT_CARD',
            value: 97,
            nextDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            cycle: 'MONTHLY',
        });

        return { id: sub.data.id, status: sub.data.status, subscriptionId: sub.data.id };
    }

    async cancelSubscription(subscriptionId: string): Promise<boolean> {
        await this.api.delete(`/subscriptions/${subscriptionId}`);
        return true;
    }

    async getWebhookEvent(payload: any): Promise<WebhookEvent> {
        return {
            type: payload.event,
            paymentId: payload.payment?.id,
            status: payload.payment?.status,
            raw: payload,
        };
    }
}
