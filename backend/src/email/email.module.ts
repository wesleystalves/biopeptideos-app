import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailBroadcastController } from './email-broadcast.controller';

@Module({
    providers: [EmailService],
    controllers: [EmailBroadcastController],
    exports: [EmailService],
})
export class EmailModule { }
