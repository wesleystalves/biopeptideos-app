import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AIConfigService } from './ai-config.service';

@ApiTags('ai-config')
@ApiBearerAuth()
@Controller('ai-config')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AIConfigController {
    constructor(private readonly svc: AIConfigService) { }

    @Get()
    getConfig() {
        return this.svc.getConfig();
    }

    @Put()
    updateConfig(@Body() body: any) {
        return this.svc.updateConfig(body);
    }

    @Post('reset')
    reset() {
        return this.svc.resetToDefault();
    }
}
