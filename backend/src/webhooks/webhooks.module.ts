import { Module } from '@nestjs/common';

// Webhooks são tratados pelos próprios módulos (payments, channels) 
// Este module é placeholder para webhooks globais futuros
@Module({})
export class WebhooksModule { }
