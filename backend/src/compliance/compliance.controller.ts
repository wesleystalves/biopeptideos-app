import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('compliance')
@ApiBearerAuth()
@Controller('compliance')
export class ComplianceController {
    constructor(private readonly service: ComplianceService) { }

    @Get('rules')
    getRules() {
        return this.service.getRules();
    }

    @Post('check')
    check(@Body() body: { countryCode: string; productCategory: string }) {
        return this.service.checkProductAccess(body.countryCode, body.productCategory);
    }

    @Post('rules')
    @UseGuards(JwtAuthGuard, AdminGuard)
    upsertRule(@Body() body: any) {
        return this.service.upsertRule(body);
    }

    @Delete('rules/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    deleteRule(@Param('id') id: string) {
        return this.service.deleteRule(id);
    }

    @Post('seed')
    @UseGuards(JwtAuthGuard, AdminGuard)
    seed() {
        return this.service.seedDefaultRules();
    }
}
