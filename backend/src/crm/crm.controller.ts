import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CrmService } from './crm.service';

@ApiTags('crm')
@ApiBearerAuth()
@Controller('crm')
@UseGuards(JwtAuthGuard, AdminGuard)
export class CrmController {
    constructor(private readonly crm: CrmService) { }

    @Get('leads')
    getLeads(@Query() q: { status?: string; channel?: string; minScore?: string }) {
        return this.crm.getLeads({
            status: q.status,
            channel: q.channel,
            minScore: q.minScore ? parseInt(q.minScore) : undefined,
        });
    }

    @Get('leads/pipeline')
    getPipeline() {
        return this.crm.getPipelineStats();
    }

    @Get('leads/:id')
    getLead(@Param('id') id: string) {
        return this.crm.getLeadById(id);
    }

    @Put('leads/:id/status')
    updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
        return this.crm.updateLeadStatus(id, body.status as any);
    }

    @Put('leads/:id/score')
    addScore(@Param('id') id: string, @Body() body: { points: number }) {
        return this.crm.scoreUp(id, body.points);
    }

    @Put('leads/:id/tag')
    addTag(@Param('id') id: string, @Body() body: { tag: string }) {
        return this.crm.addTag(id, body.tag);
    }
}
