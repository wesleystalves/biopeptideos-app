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
import * as crypto from 'crypto';
import { CouponService } from '../coupons/coupon.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../notifications/email.service';

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
        fallbackPrice: parseFloat(process.env.PRICE_BASIC || '29.90'),
    },
    premium: {
        name: 'Plano Premium — Ebook + IA com Protocolos Personalizados',
        fallbackPrice: parseFloat(process.env.PRICE_PREMIUM || '89.90'),
    },
};

@ApiTags('ebook')
@Controller('checkout/ebook')
export class EbookCheckoutController {
    private readonly logger = new Logger(EbookCheckoutController.name);

    constructor(
        private readonly couponService: CouponService,
        private readonly prisma: PrismaService,
        private readonly email: EmailService,
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
            premium: { price: prices.premium, label: 'Ebook + IA com Protocolos Personalizados' },
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
                const customerPayload: Record<string, unknown> = {
                    name: dto.name || dto.email.split('@')[0],
                    email: dto.email,
                    notificationDisabled: false,
                };
                if (dto.cpfCnpj) customerPayload.cpfCnpj = dto.cpfCnpj;
                const customer = await asaas.post('/customers', customerPayload);
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
                    this.logger.log(`pixQrCode raw: ${JSON.stringify(pix.data)}`);
                    pixQrCode = pix.data.payload || pix.data.encodedImage || '';
                    pixQrCodeUrl = pix.data.encodedImage || '';
                } catch (e: any) {
                    this.logger.warn(`PIX QR Code falhou: ${e?.message} — response: ${JSON.stringify(e?.response?.data)}`);
                }

                if (couponId) await this.couponService.incrementUsage(couponId);

                // Cria ou busca conta do usuário + dispara emails
                this.provisionAccountAndSendEmails(dto.email, dto.name, dto.plan, finalPrice).catch(
                    e => this.logger.warn('provisionAccount failed:', e?.message),
                );

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
                    cpfCnpj: dto.cpfCnpj || '',
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

    /**
     * Cria ou atualiza a conta do cliente após pagamento confirmado.
     * Eleva o plano, gera token de verificação de email e dispara os emails.
     * Executado de forma assíncrona (fire-and-forget) para não bloquear a resposta.
     */
    private async provisionAccountAndSendEmails(
        email: string,
        name: string | undefined,
        plan: 'basic' | 'premium',
        amount: number,
    ) {
        const verifyToken = crypto.randomBytes(32).toString('hex');

        const existing = await this.prisma.profile.findUnique({ where: { email } });

        if (existing) {
            // Atualiza plano se necessário (só eleva, nunca rebaixa)
            const planRank = { free: 0, basic: 1, premium: 2 };
            const shouldUpgrade = (planRank[plan] ?? 0) > (planRank[existing.plan] ?? 0);

            await this.prisma.profile.update({
                where: { id: existing.id },
                data: {
                    ...(name && !existing.name ? { name, displayName: name } : {}),
                    ...(shouldUpgrade ? { plan } : {}),
                    // Renova token de verificação se ainda não verificou
                    ...(!existing.emailVerified ? {
                        emailVerifyToken: verifyToken,
                        emailVerifyExpires: new Date(Date.now() + 48 * 60 * 60 * 1000),
                    } : {}),
                } as any,
            });

            if (!existing.emailVerified) {
                await this.email.sendEmailVerification({ to: email, name: name || existing.name || '', token: verifyToken });
            }
        } else {
            // Cria nova conta sem senha (usuário define depois via "esqueci minha senha")
            await this.prisma.profile.create({
                data: {
                    email,
                    name: name || email.split('@')[0],
                    displayName: name || email.split('@')[0],
                    plan,
                    emailVerifyToken: verifyToken,
                    emailVerifyExpires: new Date(Date.now() + 48 * 60 * 60 * 1000),
                } as any,
            });

            await this.email.sendWelcome(email, name || '');
            await this.email.sendEmailVerification({ to: email, name: name || '', token: verifyToken });
        }

        // Email de confirmação de compra sempre
        const loginUrl = `${process.env.APP_URL || 'https://peptideosbio.com'}/auth/login`;
        await this.email.sendPurchaseConfirmation({ to: email, name, plan, amount, loginUrl });

        this.logger.log(`✅ Conta provisionada e emails enviados para ${email} (plano: ${plan})`);
    }
}

