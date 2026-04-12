import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AnalyticsController {
    constructor(private readonly svc: AnalyticsService) { }

    @Get('dashboard')
    dashboard() {
        return this.svc.getDashboard();
    }

    @Get('leads-by-channel')
    byChannel() {
        return this.svc.getLeadsByChannel();
    }

    @Get('orders-by-gateway')
    byGateway() {
        return this.svc.getOrdersByGateway();
    }

    @Get('revenue')
    revenue() {
        return this.svc.getRevenueByDay(30);
    }
}
