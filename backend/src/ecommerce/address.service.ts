import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateAddressDto {
    label?: string;
    recipientName: string;
    phone?: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    isDefault?: boolean;
}

@Injectable()
export class AddressService {
    constructor(private readonly prisma: PrismaService) { }

    async list(userId: string) {
        return this.prisma.address.findMany({ where: { userId }, orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }] });
    }

    async create(userId: string, data: CreateAddressDto) {
        if (data.isDefault) {
            await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
        }
        const isFirst = (await this.prisma.address.count({ where: { userId } })) === 0;
        return this.prisma.address.create({ data: { ...data, userId, isDefault: data.isDefault || isFirst } });
    }

    async setDefault(userId: string, addressId: string) {
        const addr = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!addr) throw new NotFoundException('Endereço não encontrado');
        await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
        return this.prisma.address.update({ where: { id: addressId }, data: { isDefault: true } });
    }

    async remove(userId: string, addressId: string) {
        const addr = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!addr) throw new NotFoundException('Endereço não encontrado');
        return this.prisma.address.delete({ where: { id: addressId } });
    }

    async findOne(userId: string, addressId: string) {
        const addr = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!addr) throw new NotFoundException('Endereço não encontrado');
        return addr;
    }
}
