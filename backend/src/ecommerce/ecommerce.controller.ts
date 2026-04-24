import {
    Controller, Get, Post, Put, Delete, Patch, Body, Param, Query,
    UseGuards, Req, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddressService, CreateAddressDto } from './address.service';
import { CheckoutService, CheckoutDto } from './checkout.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/ecommerce')
@UseGuards(JwtAuthGuard)
export class EcommerceController {
    constructor(
        private readonly cart: CartService,
        private readonly address: AddressService,
        private readonly checkout: CheckoutService,
    ) { }

    // ─── CART ────────────────────────────────────────────────────────────────

    @Get('cart')
    getCart(@Req() req: any) {
        return this.cart.getCart(req.user.id);
    }

    @Post('cart')
    addItem(@Req() req: any, @Body() body: { productId: string; qty?: number }) {
        return this.cart.addItem(req.user.id, body.productId, body.qty);
    }

    @Put('cart/:itemId')
    updateItem(@Req() req: any, @Param('itemId') id: string, @Body() body: { qty: number }) {
        return this.cart.updateItem(req.user.id, id, body.qty);
    }

    @Delete('cart/:itemId')
    removeItem(@Req() req: any, @Param('itemId') id: string) {
        return this.cart.removeItem(req.user.id, id);
    }

    @Delete('cart')
    clearCart(@Req() req: any) {
        return this.cart.clearCart(req.user.id);
    }

    // ─── ADDRESSES ───────────────────────────────────────────────────────────

    @Get('addresses')
    listAddresses(@Req() req: any) {
        return this.address.list(req.user.id);
    }

    @Post('addresses')
    createAddress(@Req() req: any, @Body() body: CreateAddressDto) {
        return this.address.create(req.user.id, body);
    }

    @Patch('addresses/:id/default')
    setDefaultAddress(@Req() req: any, @Param('id') id: string) {
        return this.address.setDefault(req.user.id, id);
    }

    @Delete('addresses/:id')
    removeAddress(@Req() req: any, @Param('id') id: string) {
        return this.address.remove(req.user.id, id);
    }

    // ─── CHECKOUT ────────────────────────────────────────────────────────────

    @Post('checkout')
    createOrder(@Req() req: any, @Body() body: CheckoutDto) {
        return this.checkout.createOrder(req.user.id, body);
    }

    @Get('orders')
    getOrders(
        @Req() req: any,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ) {
        return this.checkout.getOrders(req.user.id, page);
    }

    // ─── ADMIN ───────────────────────────────────────────────────────────────

    @Get('admin/orders')
    @UseGuards(AdminGuard)
    getAllOrders(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ) {
        return this.checkout.getAllOrders(page);
    }

    @Patch('admin/orders/:id/status')
    @UseGuards(AdminGuard)
    updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
        return this.checkout.updateOrderStatus(id, body.status);
    }
}
