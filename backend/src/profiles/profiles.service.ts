import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
    constructor(private readonly prisma: PrismaService) { }

    findAll() {
        return this.prisma.profile.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                plan: true,
                isAdmin: true,
                createdAt: true,
                subscriptions: { select: { plan: true, status: true, expiresAt: true }, take: 1, orderBy: { createdAt: 'desc' } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
