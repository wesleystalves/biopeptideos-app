import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
    constructor(private readonly service: SubscriptionsService) { }

    @Get('status')
    getStatus(@Request() req) {
        return this.service.getStatus(req.user.sub);
    }

    @Post('activate')
    activate(@Request() req, @Body() body: { plan: string }) {
        return this.service.activate(req.user.sub, body.plan || 'pro');
    }
}
