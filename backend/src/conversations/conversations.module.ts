import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';

@Module({
    imports: [PrismaModule],
    providers: [ConversationsService],
    controllers: [ConversationsController],
    exports: [ConversationsService],
})
export class ConversationsModule { }
