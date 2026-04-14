import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

// Auth
import { AuthModule } from './auth/auth.module';

// Catalog (legado)
import { PeptidesModule } from './peptides/peptides.module';
import { GuidesModule } from './guides/guides.module';
import { ProtocolsModule } from './protocols/protocols.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

// Novos módulos BioPeptidios
import { ComplianceModule } from './compliance/compliance.module';
import { PaymentsModule } from './payments/payments.module';
import { ProductsModule } from './products/products.module';
import { CrmModule } from './crm/crm.module';
import { ConversationsModule } from './conversations/conversations.module';
import { AIConfigModule } from './ai-config/ai-config.module';
import { ChannelsModule } from './channels/channels.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { HealthModule } from './health/health.module';
import { CouponModule } from './coupons/coupon.module';
import { EmailModule } from './email/email.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,

        // Auth
        AuthModule,

        // Legado
        PeptidesModule,
        GuidesModule,
        ProtocolsModule,
        ProfilesModule,
        SubscriptionsModule,

        // Core BioPeptidios
        ComplianceModule,
        PaymentsModule,
        ProductsModule,
        CrmModule,
        ConversationsModule,
        AIConfigModule,
        ChannelsModule,
        AnalyticsModule,
        WebhooksModule,
        HealthModule,
        CouponModule,
        EmailModule,
    ],
})
export class AppModule { }
