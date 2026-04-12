import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(filters?: {
        category?: string;
        search?: string;
        countryCode?: string;
    }) {
        return this.prisma.product.findMany({
            where: {
                isActive: true,
                ...(filters?.category && { category: filters.category }),
                ...(filters?.search && {
                    OR: [
                        { name: { contains: filters.search, mode: 'insensitive' } },
                        { description: { contains: filters.search, mode: 'insensitive' } },
                    ],
                }),
            },
            orderBy: [{ featured: 'desc' }, { name: 'asc' }],
        });
    }

    async findBySlug(slug: string) {
        return this.prisma.product.findUnique({ where: { slug } });
    }

    async findById(id: string) {
        return this.prisma.product.findUnique({ where: { id } });
    }

    async create(data: {
        name: string;
        slug: string;
        description: string;
        price: number;
        currency?: string;
        category: string;
        imageUrl?: string;
        featured?: boolean;
        stockQty?: number;
        allowedCountries?: string[];
    }) {
        return this.prisma.product.create({ data: { ...data, isActive: true } });
    }

    async update(id: string, data: Partial<ReturnType<typeof this.create>>) {
        return this.prisma.product.update({ where: { id }, data: data as any });
    }

    async toggleActive(id: string) {
        const p = await this.prisma.product.findUniqueOrThrow({ where: { id } });
        return this.prisma.product.update({ where: { id }, data: { isActive: !p.isActive } });
    }

    async getCategories() {
        const result = await this.prisma.product.groupBy({
            by: ['category'],
            where: { isActive: true },
        });
        return result.map((r) => r.category);
    }
}
