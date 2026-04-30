import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CrmModule } from '../crm/crm.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { AIConfigModule } from '../ai-config/ai-config.module';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { EvolutionService } from './evolution.service';
import { EvolutionAdminController } from './evolution-admin.controller';
import { AIAgentService } from './ai-agent.service';
import { AITestController } from './ai-test.controller';

@Module({
    imports: [PrismaModule, CrmModule, ConversationsModule, AIConfigModule],
    providers: [ChannelsService, EvolutionService, AIAgentService],
    controllers: [ChannelsController, EvolutionAdminController, AITestController],
    exports: [ChannelsService, EvolutionService, AIAgentService],
})
export class ChannelsModule { }
