import { Controller, Get, Param, Query, Request, UseGuards, Optional } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PeptidesService } from './peptides.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';

@ApiTags('peptides')
@Controller('peptides')
export class PeptidesController {
    constructor(private readonly service: PeptidesService) { }

    @Get()
    @UseGuards(OptionalJwtGuard)
    @ApiQuery({ name: 'search', required: false })
    findAll(@Request() req, @Query('search') search?: string) {
        const isPremium = req.user?.isAdmin || req.user?.isPremium || false;
        if (search) return this.service.search(search);
        return this.service.findAll(isPremium);
    }

    @Get(':slug')
    @UseGuards(OptionalJwtGuard)
    findOne(@Param('slug') slug: string) {
        return this.service.findBySlug(slug);
    }
}
