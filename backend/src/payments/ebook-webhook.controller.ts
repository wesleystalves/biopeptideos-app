import {
    Controller,
    Post,
    Body,
    Headers,
    HttpCode,
    Logger,
    BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';

// R$29.90 → plan "basic" (ebook)
// R$89.90 → plan "premium" (ebook + IA + protocolos personalizados)
const PLAN_BASIC_AMOUNT = 29.9;
const PLAN_PREMIUM_AMOUNT = 89.9;
const PLAN_TOLERANCE = 0.5;  // tolerancia maior para pagamentos com centavos

@ApiTags('ebook')
@Controller('payments/webhook/ebook')
export class EbookWebhookController {
    private readonly logger = new Logger(EbookWebhookController.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly email: EmailService,
    ) { }

    @Post()
    @HttpCode(200)
    async handle(
        @Body() body: any,
        @Headers('asaas-access-token') token?: string,
    ) {
        // ── 1. Validação de assinatura ──────────────────────────────────────
        const secret = process.env.ASAAS_WEBHOOK_SECRET;
        if (secret && token !== secret) {
            this.logger.warn('Webhook recebido com token inválido');
            throw new BadRequestException('invalid_signature');
        }

        const event = body.event as string;
        // Só processa pagamentos confirmados
        if (event !== 'PAYMENT_RECEIVED' && event !== 'PAYMENT_CONFIRMED') {
            return { ignored: true };
        }

        const payment = body.payment;
        if (!payment) throw new BadRequestException('missing_payment');

        const gatewayId: string = payment.id;
        const email: string = payment.customer?.email ?? payment.billingType;
        const amount: number = payment.value;

        if (!email || !gatewayId) {
            this.logger.error('Dados incompletos no webhook', JSON.stringify(body));
            throw new BadRequestException('missing_fields');
        }

        // ── 2. Verificar valor mínimo ───────────────────────────────────────
        if (amount < PLAN_BASIC_AMOUNT - PLAN_TOLERANCE) {
            this.logger.warn(`Valor muito baixo: ${amount}`);
            return { ignored: true };
        }

        // ── 3. Idempotência — evita processar duas vezes ────────────────────
        const existing = await this.prisma.ebookPurchase.findUnique({
            where: { gatewayId },
        });
        if (existing) {
            this.logger.log(`Compra já processada: ${gatewayId}`);
            return { ok: true, duplicate: true };
        }

        // ── 4. Determinar plano ─────────────────────────────────────────────
        const isPremium = amount >= PLAN_PREMIUM_AMOUNT - PLAN_TOLERANCE;
        const plan = isPremium ? 'premium' : 'basic';

        // ── 5. Criar ou atualizar usuário ───────────────────────────────────
        let profile = await this.prisma.profile.findUnique({ where: { email } });
        const isNewUser = !profile;

        if (!profile) {
            const tempPassword = randomBytes(6).toString('hex');
            const hashed = await bcrypt.hash(tempPassword, 10);

            profile = await this.prisma.profile.create({
                data: {
                    email,
                    name: email.split('@')[0],
                    password: hashed,
                    plan,
                },
            });

            this.logger.log(`Novo usuário criado: ${email} → ${plan}`);
        } else {
            // Não faz downgrade — só sobe o plano
            const shouldUpgrade =
                plan === 'premium' ||
                (plan === 'basic' && profile.plan === 'free');

            if (shouldUpgrade) {
                await this.prisma.profile.update({
                    where: { id: profile.id },
                    data: { plan },
                });
                profile = { ...profile, plan };
            }
        }

        // ── 6. Registrar compra (upsert — atualiza pending→paid se já existir) ──────
        await this.prisma.ebookPurchase.upsert({
            where: { gatewayId },
            create: {
                userId: profile.id,
                plan,
                amount,
                gateway: 'asaas',
                gatewayId,
                status: 'paid',
            },
            update: {
                status: 'paid',
                amount,
                plan,
            },
        });

        // ── 7. Gerar magic token de auto-login (expira em 24h) ───────────────
        const magicToken = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        await this.prisma.profile.update({
            where: { id: profile.id },
            data: {
                autoLoginToken: magicToken,
                autoLoginExpires: expires,
            },
        });

        const appUrl = process.env.APP_URL ?? 'https://biopeptidios.dw.aiwhatsapp.com.br';
        const autoLoginUrl = `${appUrl}/auth/auto-login?token=${magicToken}`;

        this.logger.log(`Pagamento processado: ${email} → ${plan} (${gatewayId})`);

        // ── 8. Enviar e-mail de confirmação de compra com magic link ────────
        this.email.sendPurchaseConfirmation({
            to: email,
            name: profile.name ?? undefined,
            plan: plan as 'basic' | 'premium',
            amount,
            autoLoginUrl,
        }).catch(err => this.logger.error('Falha ao enviar e-mail de compra', err));

        // Se for novo usuário básico, agendar upsell após 48h (via webhook ou cron)
        // Para não bloquear o webhook, apenas logamos a intenção
        if (isNewUser && plan === 'basic') {
            this.logger.log(`Upsell agendado para ${email} após 48h`);
        }

        return { ok: true, plan, autoLoginUrl };
    }
}
