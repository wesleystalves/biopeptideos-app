import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PeptidesService {
    constructor(private readonly prisma: PrismaService) { }

    findAll(isPremium = false) {
        // Free users só veem peptídeos marcados como isFree=true
        if (!isPremium) {
            return this.prisma.peptide.findMany({
                where: { isFree: true },
                orderBy: { name: 'asc' },
            });
        }
        return this.prisma.peptide.findMany({ orderBy: { name: 'asc' } });
    }

    findBySlug(slug: string) {
        return this.prisma.peptide.findUnique({ where: { slug } });
    }

    search(query: string) {
        return this.prisma.peptide.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { category: { contains: query, mode: 'insensitive' } },
                ],
            },
            orderBy: { name: 'asc' },
        });
    }
}
