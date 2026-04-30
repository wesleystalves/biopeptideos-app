import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AIAgentService } from '../channels/ai-agent.service';
import { AIConfigService } from '../ai-config/ai-config.service';

@ApiTags('ai')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AITestController {
    constructor(
        private readonly agent: AIAgentService,
        private readonly aiConfig: AIConfigService,
    ) { }

    /** POST /api/ai/chat — testa o agente direto pelo admin */
    @Post('chat')
    async chat(@Body() body: { message: string; history?: any[] }) {
        const config = await this.aiConfig.getConfig();
        const reply = await this.agent.chat({
            leadId: 'admin-test',
            phone: 'admin',
            channel: 'chat',
            userMessage: body.message,
            conversationHistory: body.history || [],
            config: {
                systemPrompt: config.systemPrompt,
                model: (config as any).model || 'gpt-4o-mini',
                temperature: config.temperature ?? 0.7,
                maxTokens: config.maxTokens ?? 500,
                enableTools: (config as any).enableTools !== false,
            },
        });
        return { reply };
    }
}
