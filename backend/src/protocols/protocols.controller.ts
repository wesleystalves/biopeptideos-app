import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProtocolsService } from './protocols.service';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';

@ApiTags('protocols')
@Controller('protocols')
export class ProtocolsController {
    constructor(private readonly service: ProtocolsService) { }

    @Get()
    @UseGuards(OptionalJwtGuard)
    findAll(@Request() req) {
        const isPremium = req.user?.isAdmin || false;
        return this.service.findAll(isPremium);
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.service.findBySlug(slug);
    }
}
