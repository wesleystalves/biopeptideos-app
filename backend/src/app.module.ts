import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PeptidesModule } from './peptides/peptides.module';
import { ProtocolsModule } from './protocols/protocols.module';
import { GuidesModule } from './guides/guides.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        PeptidesModule,
        ProtocolsModule,
        GuidesModule,
        SubscriptionsModule,
        ProfilesModule,
    ],
})
export class AppModule { }
