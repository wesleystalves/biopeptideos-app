import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ComplianceService } from '../compliance/compliance.service';
import { StripeProvider } from './providers/stripe.provider';
import { AsaasProvider } from './providers/asaas.provider';
import { CreatePaymentDto, CreateSubscriptionDto } from './payment-provider.interface';

export type GatewayName = 'stripe' | 'asaas' | 'auto';

@Injectable()
export class PaymentRouterService {
    private readonly logger = new Logger(PaymentRouterService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly compliance: ComplianceService,
        private readonly stripe: StripeProvider,
        private readonly asaas: AsaasProvider,
    ) { }

    // Roteamento inteligente por país e valor
    private selectGateway(countryCode: string, amount: number) {
        // Brasil → Asaas (PIX)
        if (countryCode === 'BR') return this.asaas;
        // Internacional → Stripe
        return this.stripe;
    }

    async createCheckout(input: {
        userId: string;
        userEmail: string;
        countryCode: string;
        productId: string;
        gateway?: GatewayName;
    }) {
        // 1. Checa compliance antes do checkout
        const compliance = await this.compliance.checkProductAccess(input.countryCode, 'peptides');
        if (compliance.status === 'blocked') {
            throw new BadRequestException(`Produto não disponível no país ${input.countryCode}: ${compliance.reason}`);
        }

        // 2. Busca o produto
        const product = await this.prisma.product.findUniqueOrThrow({ where: { id: input.productId } });

        // 3. Seleciona gateway
        const provider = input.gateway && input.gateway !== 'auto'
            ? input.gateway === 'stripe' ? this.stripe : this.asaas
            : this.selectGateway(input.countryCode, product.price);

        // 4. Cria pagamento
        const paymentDto: CreatePaymentDto = {
            amount: product.price,
            currency: input.countryCode === 'BR' ? 'BRL' : 'USD',
            customerId: input.userId,
            customerEmail: input.userEmail,
            description: product.name,
            metadata: { productId: input.productId, userId: input.userId },
        };

        const result = await provider.createPayment(paymentDto);

        // 5. Registra o pedido
        await this.prisma.order.create({
            data: {
                userId: input.userId,
                amount: product.price,
                currency: paymentDto.currency,
                status: 'pending',
                gateway: provider.name,
                gatewayPaymentId: result.id,
                items: {
                    create: {
                        productId: input.productId,
                        name: product.name,
                        qty: 1,
                        price: product.price,
                    },
                },
            },
        });

        this.logger.log(`Checkout criado via ${provider.name} para ${input.userEmail}`);
        return { paymentUrl: result.paymentUrl, paymentId: result.id, gateway: provider.name };
    }

    async handleWebhook(gateway: string, payload: any, signature?: string) {
        const provider = gateway === 'stripe' ? this.stripe : this.asaas;
        const event = await provider.getWebhookEvent(payload, signature || '');

        if (event.type === 'checkout.session.completed' || event.type === 'PAYMENT_CONFIRMED') {
            await this.prisma.order.updateMany({
                where: { gatewayPaymentId: event.paymentId },
                data: { status: 'paid' },
            });
            this.logger.log(`Pagamento confirmado: ${event.paymentId}`);
        }

        return { processed: true, type: event.type };
    }

    async getOrdersByUser(userId: string) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
}
