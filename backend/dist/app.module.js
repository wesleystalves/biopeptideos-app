"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const peptides_module_1 = require("./peptides/peptides.module");
const guides_module_1 = require("./guides/guides.module");
const protocols_module_1 = require("./protocols/protocols.module");
const profiles_module_1 = require("./profiles/profiles.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const compliance_module_1 = require("./compliance/compliance.module");
const payments_module_1 = require("./payments/payments.module");
const products_module_1 = require("./products/products.module");
const crm_module_1 = require("./crm/crm.module");
const conversations_module_1 = require("./conversations/conversations.module");
const ai_config_module_1 = require("./ai-config/ai-config.module");
const channels_module_1 = require("./channels/channels.module");
const analytics_module_1 = require("./analytics/analytics.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const health_module_1 = require("./health/health.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            peptides_module_1.PeptidesModule,
            guides_module_1.GuidesModule,
            protocols_module_1.ProtocolsModule,
            profiles_module_1.ProfilesModule,
            subscriptions_module_1.SubscriptionsModule,
            compliance_module_1.ComplianceModule,
            payments_module_1.PaymentsModule,
            products_module_1.ProductsModule,
            crm_module_1.CrmModule,
            conversations_module_1.ConversationsModule,
            ai_config_module_1.AIConfigModule,
            channels_module_1.ChannelsModule,
            analytics_module_1.AnalyticsModule,
            webhooks_module_1.WebhooksModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map