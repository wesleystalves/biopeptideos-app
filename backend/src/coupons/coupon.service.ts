import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponService {
    private readonly logger = new Logger(CouponService.name);

    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const coupon = await this.prisma.coupon.findUnique({ where: { id } });
        if (!coupon) throw new NotFoundException('Cupom não encontrado');
        return coupon;
    }

    async create(data: {
        code: string;
        description?: string;
        discountType?: string;
        discountValue: number;
        maxUses?: number;
        minAmount?: number;
        allowedPlans?: string;
        startsAt?: string;
        expiresAt?: string;
    }) {
        const code = data.code.toUpperCase().trim();

        const existing = await this.prisma.coupon.findUnique({ where: { code } });
        if (existing) throw new BadRequestException(`Cupom '${code}' já existe`);

        return this.prisma.coupon.create({
            data: {
                code,
                description: data.description,
                discountType: data.discountType || 'percent',
                discountValue: data.discountValue,
                maxUses: data.maxUses ?? null,
                minAmount: data.minAmount ?? null,
                allowedPlans: data.allowedPlans ?? null,
                startsAt: data.startsAt ? new Date(data.startsAt) : null,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            },
        });
    }

    async update(id: string, data: Partial<{
        description: string;
        discountType: string;
        discountValue: number;
        maxUses: number | null;
        minAmount: number | null;
        allowedPlans: string | null;
        startsAt: string | null;
        expiresAt: string | null;
        isActive: boolean;
    }>) {
        await this.findOne(id);
        return this.prisma.coupon.update({
            where: { id },
            data: {
                ...data,
                startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.coupon.delete({ where: { id } });
    }

    /**
     * Valida e aplica um cupom.
     * Retorna o valor final a cobrar e o desconto aplicado.
     * Lança BadRequestException se o cupom for inválido.
     */
    async validate(code: string, plan: string, originalAmount: number): Promise<{
        finalAmount: number;
        discountApplied: number;
        couponId: string;
    }> {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code: code.toUpperCase().trim() },
        });

        if (!coupon) throw new BadRequestException('Cupom inválido ou expirado');
        if (!coupon.isActive) throw new BadRequestException('Este cupom está desativado');

        const now = new Date();
        if (coupon.startsAt && coupon.startsAt > now)
            throw new BadRequestException('Este cupom ainda não é válido');
        if (coupon.expiresAt && coupon.expiresAt < now)
            throw new BadRequestException('Este cupom expirou');

        if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)
            throw new BadRequestException('Este cupom atingiu o limite máximo de usos');

        if (coupon.minAmount && originalAmount < coupon.minAmount)
            throw new BadRequestException(
                `Valor mínimo para este cupom: R$ ${coupon.minAmount.toFixed(2)}`
            );

        // Valida planos permitidos
        if (coupon.allowedPlans) {
            const allowed: string[] = JSON.parse(coupon.allowedPlans);
            if (!allowed.includes(plan))
                throw new BadRequestException(
                    `Este cupom não é válido para o plano ${plan}`
                );
        }

        // Calcula desconto
        let discountApplied: number;
        if (coupon.discountType === 'percent') {
            discountApplied = Math.round(originalAmount * (coupon.discountValue / 100) * 100) / 100;
        } else {
            discountApplied = Math.min(coupon.discountValue, originalAmount);
        }

        const finalAmount = Math.max(0, Math.round((originalAmount - discountApplied) * 100) / 100);

        this.logger.log(
            `Cupom ${coupon.code} aplicado: -R$${discountApplied} → R$${finalAmount} (${plan})`
        );

        return { finalAmount, discountApplied, couponId: coupon.id };
    }

    /** Incrementa usedCount após cobrança criada com sucesso */
    async incrementUsage(couponId: string) {
        return this.prisma.coupon.update({
            where: { id: couponId },
            data: { usedCount: { increment: 1 } },
        });
    }
}
