import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async getCart(userId: string) {
        const items = await this.prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
            orderBy: { createdAt: 'asc' },
        });

        const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
        return { items, subtotal, count: items.length };
    }

    async addItem(userId: string, productId: string, qty = 1) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product || !product.isActive) throw new NotFoundException('Produto não encontrado');
        if (product.stockQty < qty) throw new BadRequestException('Estoque insuficiente');

        return this.prisma.cartItem.upsert({
            where: { userId_productId: { userId, productId } },
            update: { qty: { increment: qty } },
            create: { userId, productId, qty },
            include: { product: true },
        });
    }

    async updateItem(userId: string, cartItemId: string, qty: number) {
        if (qty < 1) throw new BadRequestException('Quantidade mínima é 1');
        const item = await this.prisma.cartItem.findFirst({ where: { id: cartItemId, userId } });
        if (!item) throw new NotFoundException('Item não encontrado no carrinho');
        return this.prisma.cartItem.update({ where: { id: cartItemId }, data: { qty }, include: { product: true } });
    }

    async removeItem(userId: string, cartItemId: string) {
        const item = await this.prisma.cartItem.findFirst({ where: { id: cartItemId, userId } });
        if (!item) throw new NotFoundException('Item não encontrado no carrinho');
        return this.prisma.cartItem.delete({ where: { id: cartItemId } });
    }

    async clearCart(userId: string) {
        return this.prisma.cartItem.deleteMany({ where: { userId } });
    }
}
