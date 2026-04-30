import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
    revenue(@Query('days') days?: string) {
        return this.svc.getRevenueByDay(days ? parseInt(days) : 30);
    }

    @Get('users-by-day')
    usersByDay(@Query('days') days?: string) {
        return this.svc.getUsersByDay(days ? parseInt(days) : 30);
    }

    @Get('ebook-purchases')
    ebookPurchases(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('status') status?: string,
        @Query('plan') plan?: string,
    ) {
        return this.svc.getEbookPurchases(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 50,
            status,
            plan,
        );
    }

    @Get('plan-distribution')
    planDistribution() {
        return this.svc.getPlanDistribution();
    }
}
