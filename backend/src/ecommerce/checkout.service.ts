import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CouponService } from '../coupons/coupon.service';
import axios from 'axios';

export interface CheckoutDto {
    addressId?: string;
    couponCode?: string;
    paymentMethod: 'pix' | 'credit_card';
    cardToken?: string;
    cardHolderInfo?: {
        name: string;
        email: string;
        cpfCnpj: string;
        phone?: string;
    };
}

@Injectable()
export class CheckoutService {
    private readonly logger = new Logger(CheckoutService.name);
    private readonly asaas = axios.create({
        baseURL: process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3',
        headers: { access_token: process.env.ASAAS_API_KEY || '' },
    });

    constructor(
        private readonly prisma: PrismaService,
        private readonly couponService: CouponService,
    ) { }

    /** Returns paginated order history for a user */
    async getOrders(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where: { userId },
                include: { items: { include: { product: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where: { userId } }),
        ]);
        return { orders, total, page, limit };
    }

    /** Admin: all orders */
    async getAllOrders(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                include: {
                    items: { include: { product: true } },
                    profile: { select: { name: true, email: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.order.count(),
        ]);
        return { orders, total, page, limit };
    }

    /** Admin: update order status */
    async updateOrderStatus(orderId: string, status: string) {
        return this.prisma.order.update({ where: { id: orderId }, data: { status } });
    }

    /** Get or create Asaas customer for user */
    private async getOrCreateCustomer(userId: string) {
        const profile = await this.prisma.profile.findUniqueOrThrow({
            where: { id: userId },
            select: { name: true, email: true, phone: true },
        });

        const search = await this.asaas.get('/customers', { params: { email: profile.email, limit: 1 } });
        if (search.data.data?.length > 0) {
            return search.data.data[0].id;
        }
        const created = await this.asaas.post('/customers', {
            name: profile.name || profile.email,
            email: profile.email,
            mobilePhone: profile.phone,
            notificationDisabled: false,
        });
        return created.data.id;
    }

    /** Create order from cart */
    async createOrder(userId: string, dto: CheckoutDto) {
        // 1. Load cart
        const cartItems = await this.prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });
        if (cartItems.length === 0) throw new BadRequestException('Carrinho vazio');

        // 2. Validate stock
        for (const item of cartItems) {
            if (!item.product.isActive) throw new BadRequestException(`Produto "${item.product.name}" indisponível`);
            if (item.product.stockQty < item.qty) {
                throw new BadRequestException(`Estoque insuficiente para "${item.product.name}"`);
            }
        }

        // 3. Calculate subtotal
        let subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.qty, 0);
        subtotal = Math.round(subtotal * 100) / 100;

        // 4. Apply coupon
        let discountAmount = 0;
        let couponId: string | undefined;
        if (dto.couponCode) {
            try {
                const result = await this.couponService.validate(dto.couponCode, 'product', subtotal);
                discountAmount = result.discountApplied;
                couponId = result.couponId;
            } catch (err) {
                throw new BadRequestException(err.message);
            }
        }
        const finalAmount = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

        // 5. Load address
        let shippingAddress: object | undefined;
        if (dto.addressId) {
            const addr = await this.prisma.address.findFirst({ where: { id: dto.addressId, userId } });
            if (addr) shippingAddress = addr;
        }

        // 6. Create order record
        const order = await this.prisma.order.create({
            data: {
                userId,
                amount: finalAmount,
                discountAmount,
                currency: 'BRL',
                status: 'pending',
                paymentMethod: dto.paymentMethod,
                couponCode: dto.couponCode,
                shippingAddress,
                items: {
                    create: cartItems.map(i => ({
                        productId: i.productId,
                        name: i.product.name,
                        price: i.product.price,
                        qty: i.qty,
                    })),
                },
            },
            include: { items: true },
        });

        // 7. Create Asaas payment
        try {
            const customerId = await this.getOrCreateCustomer(userId);
            const billingType = dto.paymentMethod === 'pix' ? 'PIX' : 'CREDIT_CARD';
            const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const paymentPayload: any = {
                customer: customerId,
                billingType,
                value: finalAmount > 0 ? finalAmount : 0.01,
                dueDate,
                description: `Pedido #${order.id.slice(-8).toUpperCase()} — BioPeptideos`,
                externalReference: order.id,
            };

            if (dto.paymentMethod === 'credit_card' && dto.cardToken) {
                paymentPayload.creditCardToken = dto.cardToken;
                if (dto.cardHolderInfo) {
                    paymentPayload.creditCardHolderInfo = dto.cardHolderInfo;
                }
            }

            const payment = await this.asaas.post('/payments', paymentPayload);
            const gatewayPaymentId = payment.data.id;

            let pixQr: string | undefined;
            let pixCode: string | undefined;
            if (dto.paymentMethod === 'pix') {
                const pixData = await this.asaas.get(`/payments/${gatewayPaymentId}/pixQrCode`);
                pixQr = pixData.data.encodedImage;
                pixCode = pixData.data.payload;
            }

            // update order with payment info
            const updatedOrder = await this.prisma.order.update({
                where: { id: order.id },
                data: {
                    gateway: 'asaas',
                    gatewayPaymentId,
                    gatewayPixQr: pixQr,
                    gatewayPixCode: pixCode,
                    status: dto.paymentMethod === 'credit_card' ? 'paid' : 'pending',
                },
            });

            // 8. Decrement stock
            for (const item of cartItems) {
                await this.prisma.product.update({
                    where: { id: item.productId },
                    data: { stockQty: { decrement: item.qty } },
                });
            }

            // 9. Increment coupon usage
            if (couponId) {
                await this.couponService.incrementUsage(couponId);
                await this.prisma.couponUsage.create({
                    data: { couponId, userId, orderId: order.id, discount: discountAmount },
                });
            }

            // 10. Clear cart
            await this.prisma.cartItem.deleteMany({ where: { userId } });

            return {
                order: updatedOrder,
                pixQr,
                pixCode,
                paymentId: gatewayPaymentId,
            };
        } catch (err) {
            // Rollback order on payment failure
            await this.prisma.order.update({ where: { id: order.id }, data: { status: 'cancelled', notes: err.message } });
            this.logger.error(`Checkout falhou para order ${order.id}: ${err.message}`);
            throw new BadRequestException(`Falha no pagamento: ${err?.response?.data?.errors?.[0]?.description || err.message}`);
        }
    }
}
