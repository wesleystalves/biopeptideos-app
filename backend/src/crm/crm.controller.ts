import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CrmService } from './crm.service';
import { IsString, IsEmail, IsOptional } from 'class-validator';

class PublicLeadDto {
    @IsOptional() @IsString() name?: string;
    @IsOptional() @IsEmail() email?: string;
    @IsOptional() @IsString() whatsapp?: string;
    @IsOptional() @IsString() source?: string;
    @IsOptional() @IsString() plan?: string;
}

@ApiTags('crm')
@Controller('crm')
export class CrmController {
    constructor(private readonly crm: CrmService) { }

    // ── Rota pública — salva lead sem autenticação ──────────────────────
    /** POST /api/crm/leads/public — captura lead do ebook antes do pagamento */
    @Post('leads/public')
    capturePublicLead(@Body() dto: PublicLeadDto) {
        return this.crm.createLead({
            name: dto.name,
            email: dto.email,
            phone: dto.whatsapp || '',
            channel: 'ebook',
            source: dto.source || 'ebook_checkout',
        });
    }

    @Get('leads')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    getLeads(@Query() q: { status?: string; channel?: string; minScore?: string }) {
        return this.crm.getLeads({
            status: q.status,
            channel: q.channel,
            minScore: q.minScore ? parseInt(q.minScore) : undefined,
        });
    }

    @Get('leads/pipeline')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    getPipeline() {
        return this.crm.getPipelineStats();
    }

    @Get('leads/:id')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    getLead(@Param('id') id: string) {
        return this.crm.getLeadById(id);
    }

    @Put('leads/:id/status')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
        return this.crm.updateLeadStatus(id, body.status as any);
    }

    @Put('leads/:id/score')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    addScore(@Param('id') id: string, @Body() body: { points: number }) {
        return this.crm.scoreUp(id, body.points);
    }

    @Put('leads/:id/tag')
    @ApiBearerAuth() @UseGuards(JwtAuthGuard, AdminGuard)
    addTag(@Param('id') id: string, @Body() body: { tag: string }) {
        return this.crm.addTag(id, body.tag);
    }
}
