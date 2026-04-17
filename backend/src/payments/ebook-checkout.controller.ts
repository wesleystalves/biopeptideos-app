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
                    cpfCnpj: dto.cpfCnpj || '00000000000',
                    notificationDisabled: false,
                });
                customerId = customer.data.id;
            }
        } catch (err) {
            this.logger.error('Erro ao criar cliente Asaas', err?.response?.data);
            throw new BadRequestException('Falha ao criar cliente no gateway de pagamento');
        }

        // Cria cobrança (cliente escolhe PIX/Boleto/Cartão na página do Asaas)
        const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];

        try {
            const charge = await asaas.post('/payments', {
                customer: customerId,
                billingType: 'UNDEFINED',
                value: finalPrice,
                dueDate,
                description: planDef.name,
                externalReference: `${dto.plan}:${dto.email}`,
                callback: {
                    successUrl: `${process.env.APP_URL || 'https://peptideosbio.com'}/auto-login-redirect?plan=${dto.plan}&email=${encodeURIComponent(dto.email)}`,
                    autoRedirect: true,
                },
            });

            this.logger.log(`Cobrança criada: ${charge.data.id} — R$${finalPrice} (${dto.plan})`);

            if (couponId) {
                await this.couponService.incrementUsage(couponId);
            }

            return {
                checkoutUrl: charge.data.invoiceUrl,
                plan: dto.plan,
                amount: finalPrice,
                originalAmount: prices[dto.plan],
                discount: discountApplied,
                expiresAt: dueDate,
            };
        } catch (err) {
            this.logger.error('Erro ao criar cobrança Asaas', err?.response?.data);
            throw new BadRequestException('Falha ao criar cobrança no gateway de pagamento');
        }
    }
}
