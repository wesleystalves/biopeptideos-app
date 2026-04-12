import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GuidesService } from './guides.service';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';

@ApiTags('guides')
@Controller('guides')
export class GuidesController {
    constructor(private readonly service: GuidesService) { }

    @Get()
    @UseGuards(OptionalJwtGuard)
    findAll(@Request() req) {
        const isPremium = req.user?.isAdmin || false;
        return this.service.findAll(isPremium);
    }

    @Get(':slug')
    @UseGuards(OptionalJwtGuard)
    findOne(@Param('slug') slug: string, @Request() req) {
        const isPremium = req.user?.isAdmin || false;
        return this.service.findBySlug(slug, isPremium);
    }
}
