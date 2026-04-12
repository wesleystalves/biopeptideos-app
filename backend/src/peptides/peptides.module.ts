import { Module } from '@nestjs/common';
import { PeptidesService } from './peptides.service';
import { PeptidesController } from './peptides.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    providers: [PeptidesService],
    controllers: [PeptidesController],
})
export class PeptidesModule { }
