import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum ComplianceStatus {
    ALLOWED = 'allowed',
    RESTRICTED = 'restricted',
    BLOCKED = 'blocked',
}

@Injectable()
export class ComplianceService {
    // Master feature flag — set to true when legally approved per country
    private readonly ENABLE_RESTRICTED_PRODUCTS =
        process.env.ENABLE_RESTRICTED_PRODUCTS === 'true';

    constructor(private readonly prisma: PrismaService) { }

    async checkProductAccess(countryCode: string, productCategory: string) {
        if (!this.ENABLE_RESTRICTED_PRODUCTS) {
            return { status: ComplianceStatus.BLOCKED, reason: 'pre-launch mode' };
        }

        const rule = await this.prisma.complianceRule.findFirst({
            where: {
                countryCode: countryCode.toUpperCase(),
                productCategory,
            },
        });

        if (!rule) return { status: ComplianceStatus.RESTRICTED, reason: 'no rule found' };

        return {
            status: rule.status as ComplianceStatus,
            requiresPrescription: rule.requiresPrescription,
            notes: rule.notes,
        };
    }

    async getRules() {
        return this.prisma.complianceRule.findMany({ orderBy: { countryCode: 'asc' } });
    }

    async upsertRule(data: {
        countryCode: string;
        productCategory: string;
        status: string;
        requiresPrescription: boolean;
        notes?: string;
    }) {
        return this.prisma.complianceRule.upsert({
            where: {
                countryCode_productCategory: {
                    countryCode: data.countryCode.toUpperCase(),
                    productCategory: data.productCategory,
                },
            },
            create: data,
            update: data,
        });
    }

    async deleteRule(id: string) {
        return this.prisma.complianceRule.delete({ where: { id } });
    }

    // Bulk seed de países base
    async seedDefaultRules() {
        const defaults = [
            // USA — permitido (research use)
            { countryCode: 'US', productCategory: 'peptides', status: 'allowed', requiresPrescription: false, notes: 'Research use only' },
            // UK — permitido com restrições
            { countryCode: 'GB', productCategory: 'peptides', status: 'restricted', requiresPrescription: true, notes: 'Prescription required for some' },
            // Canada — permitido
            { countryCode: 'CA', productCategory: 'peptides', status: 'allowed', requiresPrescription: false },
            // Germany
            { countryCode: 'DE', productCategory: 'peptides', status: 'restricted', requiresPrescription: true },
            // Brazil — blocked until legalized
            { countryCode: 'BR', productCategory: 'peptides', status: 'blocked', requiresPrescription: false, notes: 'Pending regulation' },
            // Australia
            { countryCode: 'AU', productCategory: 'peptides', status: 'restricted', requiresPrescription: true },
        ];

        for (const rule of defaults) {
            await this.upsertRule(rule);
        }

        return { seeded: defaults.length };
    }
}
