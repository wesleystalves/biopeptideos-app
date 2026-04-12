import { Controller, Get, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
    constructor(private readonly service: ProfilesService) { }

    @Get()
    findAll(@Request() req) {
        if (!req.user.isAdmin) throw new ForbiddenException('Somente admins');
        return this.service.findAll();
    }
}
