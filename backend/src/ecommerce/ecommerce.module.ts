import { Module } from '@nestjs/common';
import { EcommerceController } from './ecommerce.controller';
import { CartService } from './cart.service';
import { AddressService } from './address.service';
import { CheckoutService } from './checkout.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CouponModule } from '../coupons/coupon.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, CouponModule, AuthModule],
    controllers: [EcommerceController],
    providers: [CartService, AddressService, CheckoutService],
    exports: [CartService, AddressService, CheckoutService],
})
export class EcommerceModule { }
