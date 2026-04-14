import {
    Controller,
    Post,
    Body,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';
import axios from 'axios';
import { CouponService } from '../coupons/coupon.service';

export class EbookCheckoutDto {
    @IsString()
    @IsIn(['basic', 'premium'])
    plan: 'basic' | 'premium';

    @IsString()
    email: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    cpfCnpj?: string; // Necessário para criar cliente no Asaas

    @IsString()
    @IsOptional()
    coupon?: string;
}

// Preços base gerenciados por ENV — muda sem deploy
const PLANS = {
    basic: {
        name: 'Ebook — O Código Secreto dos Peptídeos',
        price: parseFloat(process.env.PRICE_BASIC || '9.90'),
    },
    premium: {
        name: 'Plano Premium — Ebook + IA + Plataforma BioPeptidios',
        price: parseFloat(process.env.PRICE_PREMIUM || '29.90'),
    },
};

@ApiTags('ebook')
@Controller('checkout/ebook')
export class EbookCheckoutController {
    private readonly logger = new Logger(EbookCheckoutController.name);

    constructor(private readonly couponService: CouponService) { }

    private readonly asaas = axios.create({
        baseURL: process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3',
        headers: { access_token: process.env.ASAAS_API_KEY || '' },
    });

    @Post()
    @ApiOperation({ summary: 'Cria cobrança Asaas dinâmica para o ebook' })
    async createCheckout(@Body() dto: EbookCheckoutDto) {
        const plan = PLANS[dto.plan];
        let finalPrice = plan.price;
        let discountApplied = 0;
        let couponId: string | null = null;

        // ── Valida cupom no banco de dados ────────────────────────────────
        if (dto.coupon?.trim()) {
            try {
                const result = await this.couponService.validate(
                    dto.coupon,
                    dto.plan,
                    plan.price,
                );
                finalPrice = result.finalAmount;
                discountApplied = result.discountApplied;
                couponId = result.couponId;
            } catch (err) {
                throw new BadRequestException(err.message || 'Cupom inválido');
            }
        }

        // ── Cria ou busca cliente no Asaas ────────────────────────────────
        let customerId: string;
        try {
            const search = await this.asaas.get('/customers', {
                params: { email: dto.email },
            });

            if (search.data.data?.length > 0) {
                customerId = search.data.data[0].id;
                // Se cliente existe mas sem CPF, atualiza
                if (!search.data.data[0].cpfCnpj && dto.cpfCnpj) {
                    await this.asaas.put(`/customers/${customerId}`, {
                        cpfCnpj: dto.cpfCnpj,
                    });
                }
            } else {
                const customer = await this.asaas.post('/customers', {
                    name: dto.name || dto.email.split('@')[0],
                    email: dto.email,
                    cpfCnpj: dto.cpfCnpj || '00000000000', // CPF obrigatório no sandbox
                    notificationDisabled: false,
                });
                customerId = customer.data.id;
            }
        } catch (err) {
            this.logger.error('Erro ao criar cliente Asaas', err?.response?.data);
            throw new BadRequestException('Falha ao criar cliente no gateway de pagamento');
        }

        // ── Cria cobrança (cliente escolhe PIX/Boleto/Cartão) ────────────
        const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];

        try {
            const charge = await this.asaas.post('/payments', {
                customer: customerId,
                billingType: 'UNDEFINED',
                value: finalPrice,
                dueDate,
                description: plan.name,
                externalReference: `${dto.plan}:${dto.email}`,
                callback: {
                    successUrl: `${process.env.APP_URL || 'https://biopeptidios.dw.aiwhatsapp.com.br'}/auto-login-redirect?plan=${dto.plan}&email=${encodeURIComponent(dto.email)}`,
                    autoRedirect: true,
                },
            });

            this.logger.log(`Cobrança criada: ${charge.data.id} — R$${finalPrice} (${dto.plan})`);

            // Incrementa uso do cupom após cobrança criada com sucesso
            if (couponId) {
                await this.couponService.incrementUsage(couponId);
            }

            return {
                checkoutUrl: charge.data.invoiceUrl,
                plan: dto.plan,
                amount: finalPrice,
                originalAmount: plan.price,
                discount: discountApplied,
                expiresAt: dueDate,
            };
        } catch (err) {
            this.logger.error('Erro ao criar cobrança Asaas', err?.response?.data);
            throw new BadRequestException('Falha ao criar cobrança no gateway de pagamento');
        }
    }
}
