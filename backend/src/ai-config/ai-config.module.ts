import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AIConfigService } from './ai-config.service';
import { AIConfigController } from './ai-config.controller';

@Module({
    imports: [PrismaModule],
    providers: [AIConfigService],
    controllers: [AIConfigController],
    exports: [AIConfigService],
})
export class AIConfigModule { }
