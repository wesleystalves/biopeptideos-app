import { Controller, Post, Get, Body, Param, Request, UseGuards, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PaymentRouterService } from './payment-router.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly router: PaymentRouterService) { }

    @Post('checkout')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    createCheckout(@Request() req, @Body() body: {
        productId: string;
        countryCode?: string;
        gateway?: 'stripe' | 'asaas' | 'auto';
    }) {
        return this.router.createCheckout({
            userId: req.user.sub,
            userEmail: req.user.email,
            countryCode: body.countryCode || req.user.countryCode || 'US',
            productId: body.productId,
            gateway: body.gateway,
        });
    }

    @Get('orders')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    getOrders(@Request() req) {
        return this.router.getOrdersByUser(req.user.sub);
    }

    @Post('webhook/stripe')
    stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig: string) {
        return this.router.handleWebhook('stripe', req.rawBody, sig);
    }

    @Post('webhook/asaas')
    asaasWebhook(@Body() body: any) {
        return this.router.handleWebhook('asaas', body);
    }
}
