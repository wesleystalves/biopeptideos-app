import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ConversationsService } from './conversations.service';

@ApiTags('conversations')
@ApiBearerAuth()
@Controller('conversations')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ConversationsController {
    constructor(private readonly svc: ConversationsService) { }

    @Get('inbox')
    inbox(@Query('channel') channel?: string) {
        return this.svc.getInbox({ channel });
    }

    @Get('stats')
    stats() {
        return this.svc.getStats();
    }

    @Get('history/:leadId')
    history(@Param('leadId') leadId: string) {
        return this.svc.getHistory(leadId);
    }
}
