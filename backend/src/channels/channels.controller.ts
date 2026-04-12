import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
    constructor(private readonly svc: ChannelsService) { }

    @Post('webhook/whatsapp')
    whatsapp(@Body() body: any) {
        return this.svc.handleWhatsApp(body);
    }

    @Post('webhook/telegram')
    telegram(@Body() body: any) {
        return this.svc.handleTelegram(body);
    }
}
