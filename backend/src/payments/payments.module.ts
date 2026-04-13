import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ComplianceModule } from '../compliance/compliance.module';
import { PaymentRouterService } from './payment-router.service';
import { StripeProvider } from './providers/stripe.provider';
import { AsaasProvider } from './providers/asaas.provider';
import { PaymentsController } from './payments.controller';
import { GatewayConfigController } from './gateway-config.controller';

@Module({
    imports: [PrismaModule, ComplianceModule],
    providers: [PaymentRouterService, StripeProvider, AsaasProvider],
    controllers: [PaymentsController, GatewayConfigController],
    exports: [PaymentRouterService],
})
export class PaymentsModule { }
