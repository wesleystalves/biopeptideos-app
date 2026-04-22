import {
    Controller,
    Post, Get,
    Body,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';
import axios from 'axios';
import { CouponService } from '../coupons/coupon.service';
import { PrismaService } from '../prisma/prisma.service';

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
    cpfCnpj?: string;

    @IsString()
    @IsOptional()
    coupon?: string;

    /** pix | credit_card | debit_card — padrão: pix */
    @IsString()
    @IsOptional()
    paymentMethod?: 'pix' | 'credit_card' | 'debit_card';

    // Dados do cartão (obrigatório se paymentMethod !== 'pix')
    @IsString() @IsOptional() cardNumber?: string;
    @IsString() @IsOptional() cardHolder?: string;
    @IsString() @IsOptional() cardExpiryMonth?: string;
    @IsString() @IsOptional() cardExpiryYear?: string;
    @IsString() @IsOptional() cardCvv?: string;
    @IsString() @IsOptional() postalCode?: string;
    @IsString() @IsOptional() addressNumber?: string;
    @IsString() @IsOptional() phone?: string;
}

// Fallback caso não haja preço no banco
const PLAN_DEFAULTS = {
    basic: {
        name: 'Ebook — O Código Secreto dos Peptídeos',
        fallbackPrice: parseFloat(process.env.PRICE_BASIC || '9.90'),
    },
    premium: {
        name: 'Plano Premium — Ebook + IA + Plataforma BioPeptidios',
        fallbackPrice: parseFloat(process.env.PRICE_PREMIUM || '29.90'),
    },
};

@ApiTags('ebook')
@Controller('checkout/ebook')
export class EbookCheckoutController {
    private readonly logger = new Logger(EbookCheckoutController.name);

    constructor(
        private readonly couponService: CouponService,
        private readonly prisma: PrismaService,
    ) { }

    private readonly asaas = axios.create({
        baseURL: process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3',
        headers: { access_token: process.env.ASAAS_API_KEY || '' },
    });

    /** Busca preços do banco, com fallback para ENV/padrão */
    private async getPrices(): Promise<{ basic: number; premium: number }> {
        const rows = await this.prisma.setting.findMany({
            where: { key: { in: ['price.basic', 'price.premium'] } },
        });
        const map = Object.fromEntries(rows.map(r => [r.key, parseFloat(r.value)]));
        return {
            basic: map['price.basic'] || PLAN_DEFAULTS.basic.fallbackPrice,
            premium: map['price.premium'] || PLAN_DEFAULTS.premium.fallbackPrice,
        };
    }

    /**
     * GET /api/checkout/ebook/prices
     * Público — retorna preços atuais para o frontend exibir
     */
    @Get('prices')
    @ApiOperation({ summary: 'Retorna preços públicos do ebook (sem auth)' })
    async getPublicPrices() {
        const prices = await this.getPrices();
        return {
            basic: { price: prices.basic, label: 'Ebook — Acesso vitalício' },
            premium: { price: prices.premium, label: 'Ebook + IA + Plataforma' },
        };
    }

    @Post()
    @ApiOperation({ summary: 'Cria cobrança Asaas dinâmica para o ebook' })
    async createCheckout(@Body() dto: EbookCheckoutDto) {
        const prices = await this.getPrices();
        const planDef = PLAN_DEFAULTS[dto.plan];
        let finalPrice = prices[dto.plan];
        let discountApplied = 0;
        let couponId: string | null = null;

        // Valida cupom
        if (dto.coupon?.trim()) {
            try {
                const result = await this.couponService.validate(
                    dto.coupon,
                    dto.plan,
                    finalPrice,
                );
                finalPrice = result.finalAmount;
                discountApplied = result.discountApplied;
                couponId = result.couponId;
            } catch (err) {
                throw new BadRequestException(err.message || 'Cupom inválido');
            }
        }

        // Busca API key do banco (ambiente correto)
        const envRow = await this.prisma.setting.findUnique({ where: { key: 'asaas.env' } });
        const isProduction = envRow?.value === 'production';
        const apiKeyRow = await this.prisma.setting.findUnique({
            where: { key: isProduction ? 'asaas.api_key_prod' : 'asaas.api_key' },
        });

        const asaasBaseUrl = isProduction
            ? 'https://api.asaas.com/v3'
            : 'https://sandbox.asaas.com/api/v3';
        const asaasKey = apiKeyRow?.value || process.env.ASAAS_API_KEY || '';

        const asaas = axios.create({
            baseURL: asaasBaseUrl,
            headers: { access_token: asaasKey },
        });

        // Cria ou busca cliente no Asaas
        let customerId: string;
        try {
            const search = await asaas.get('/customers', {
                params: { email: dto.email },
            });

            if (search.data.data?.length > 0) {
                customerId = search.data.data[0].id;
                if (!search.data.data[0].cpfCnpj && dto.cpfCnpj) {
                    await asaas.put(`/customers/${customerId}`, { cpfCnpj: dto.cpfCnpj });
                }
            } else {
                const customer = await asaas.post('/customers', {
                    name: dto.name || dto.email.split('@')[0],
                    email: dto.email,
                    // Asaas Sandbox aceita qualquer CPF válido; prod exige CPF real do comprador
                    cpfCnpj: dto.cpfCnpj || '24971563792',
                    notificationDisabled: false,
                });
                customerId = customer.data.id;
            }
        } catch (err) {
            this.logger.error('Erro ao criar cliente Asaas', err?.response?.data);
            throw new BadRequestException('Falha ao criar cliente no gateway de pagamento');
        }

        // Cria cobrança — tipo depende do método escolhido
        const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];

        const method = dto.paymentMethod || 'pix';

        try {
            // ── PIX ──────────────────────────────────────────────────────
            if (method === 'pix') {
                const charge = await asaas.post('/payments', {
                    customer: customerId,
                    billingType: 'PIX',
                    value: finalPrice,
                    dueDate,
                    description: planDef.name,
                    externalReference: `${dto.plan}:${dto.email}`,
                });

                const paymentId = charge.data.id;
                this.logger.log(`PIX criado: ${paymentId} — R$${finalPrice} (${dto.plan})`);

                let pixQrCode = '';
                let pixQrCodeUrl = '';
                try {
                    const pix = await asaas.get(`/payments/${paymentId}/pixQrCode`);
                    pixQrCode = pix.data.payload || '';
                    pixQrCodeUrl = pix.data.encodedImage || '';
                } catch (e) {
                    this.logger.warn('Não foi possível buscar PIX QR Code', e?.message);
                }

                if (couponId) await this.couponService.incrementUsage(couponId);

                return {
                    paymentMethod: 'pix',
                    paymentId,
                    pixQrCode,
                    pixQrCodeUrl,
                    plan: dto.plan,
                    amount: finalPrice,
                    originalAmount: prices[dto.plan],
                    discount: discountApplied,
                    expiresAt: dueDate,
                    checkoutUrl: charge.data.invoiceUrl || null,
                };
            }

            // ── CARTÃO DE CRÉDITO / DÉBITO ────────────────────────────────
            if (!dto.cardNumber || !dto.cardHolder || !dto.cardExpiryMonth || !dto.cardExpiryYear || !dto.cardCvv) {
                throw new BadRequestException('Dados do cartão são obrigatórios.');
            }

            const billingType = method === 'debit_card' ? 'DEBIT_CARD' : 'CREDIT_CARD';
            const [expMonth, expYearRaw] = [dto.cardExpiryMonth.padStart(2, '0'), dto.cardExpiryYear];
            const expYear = expYearRaw.length === 2 ? `20${expYearRaw}` : expYearRaw;

            const charge = await asaas.post('/payments', {
                customer: customerId,
                billingType,
                value: finalPrice,
                dueDate,
                description: planDef.name,
                externalReference: `${dto.plan}:${dto.email}`,
                creditCard: {
                    holderName: dto.cardHolder,
                    number: dto.cardNumber.replace(/\s/g, ''),
                    expiryMonth: expMonth,
                    expiryYear: expYear,
                    ccv: dto.cardCvv,
                },
                creditCardHolderInfo: {
                    name: dto.name || dto.cardHolder,
                    email: dto.email,
                    cpfCnpj: dto.cpfCnpj || '24971563792',
                    postalCode: dto.postalCode || '01310100',
                    addressNumber: dto.addressNumber || 'S/N',
                    phone: dto.phone || '11999999999',
                },
            });

            const paymentId = charge.data.id;
            const status = charge.data.status; // CONFIRMED, PENDING, etc.
            this.logger.log(`Cartão ${billingType} criado: ${paymentId} status=${status} — R$${finalPrice} (${dto.plan})`);

            if (couponId) await this.couponService.incrementUsage(couponId);

            return {
                paymentMethod: method,
                paymentId,
                status,
                plan: dto.plan,
                amount: finalPrice,
                originalAmount: prices[dto.plan],
                discount: discountApplied,
                expiresAt: dueDate,
            };

        } catch (err) {
            const asaasError = err?.response?.data?.errors?.[0]?.description || err?.message;
            this.logger.error('Erro ao criar cobrança Asaas', err?.response?.data);
            throw new BadRequestException(asaasError || 'Falha ao criar cobrança no gateway de pagamento');
        }
    }
}
