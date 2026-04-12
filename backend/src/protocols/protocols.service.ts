import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProtocolsService {
    constructor(private readonly prisma: PrismaService) { }

    findAll(isPremium = false) {
        if (!isPremium) {
            return this.prisma.protocol.findMany({
                where: { isFree: true },
                orderBy: { title: 'asc' },
            });
        }
        return this.prisma.protocol.findMany({ orderBy: { title: 'asc' } });
    }

    findBySlug(slug: string) {
        return this.prisma.protocol.findUnique({ where: { slug } });
    }
}
