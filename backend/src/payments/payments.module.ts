import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { ComplianceModule } from '../compliance/compliance.module';
import { CouponModule } from '../coupons/coupon.module';
import { EmailModule } from '../email/email.module';
import { PaymentRouterService } from './payment-router.service';
import { StripeProvider } from './providers/stripe.provider';
import { AsaasProvider } from './providers/asaas.provider';
import { PaymentsController } from './payments.controller';
import { GatewayConfigController } from './gateway-config.controller';
import { EbookWebhookController } from './ebook-webhook.controller';
import { EbookCheckoutController } from './ebook-checkout.controller';
import { BackupController } from './backup.controller';


@Module({
    imports: [
        PrismaModule,
        ComplianceModule,
        CouponModule,
        EmailModule,
        JwtModule.register({ secret: process.env.JWT_SECRET }),
    ],
    providers: [PaymentRouterService, StripeProvider, AsaasProvider],
    controllers: [PaymentsController, GatewayConfigController, EbookWebhookController, EbookCheckoutController, BackupController],
    exports: [PaymentRouterService],
})
export class PaymentsModule { }




