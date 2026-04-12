import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CrmModule } from '../crm/crm.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { AIConfigModule } from '../ai-config/ai-config.module';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';

@Module({
    imports: [PrismaModule, CrmModule, ConversationsModule, AIConfigModule],
    providers: [ChannelsService],
    controllers: [ChannelsController],
    exports: [ChannelsService],
})
export class ChannelsModule { }
