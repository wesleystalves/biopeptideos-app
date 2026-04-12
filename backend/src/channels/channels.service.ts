import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CrmService } from '../crm/crm.service';
import { ConversationsService } from '../conversations/conversations.service';
import { AIConfigService } from '../ai-config/ai-config.service';

@Injectable()
export class ChannelsService {
    private readonly logger = new Logger(ChannelsService.name);

    constructor(
        private readonly crm: CrmService,
        private readonly conversations: ConversationsService,
        private readonly aiConfig: AIConfigService,
    ) { }

    // ===== WHATSAPP =====
    async handleWhatsApp(payload: any) {
        const phone = payload?.data?.key?.remoteJid?.replace('@s.whatsapp.net', '').replace('@c.us', '') || '';
        const message = payload?.data?.message?.conversation ||
            payload?.data?.message?.extendedTextMessage?.text || '';
        const instance = payload?.instance || 'default';

        if (!message || phone.endsWith('@g.us')) return { ignored: true };

        // Busca ou cria lead no CRM
        const lead = await this.crm.findOrCreateByPhone(`+${phone}`, 'whatsapp');

        // Salva mensagem recebida
        await this.conversations.saveMessage({
            leadId: lead.id,
            channel: 'whatsapp',
            role: 'user',
            content: message,
        });

        // Atualiza score do lead
        await this.crm.scoreUp(lead.id, 5);

        // Gera resposta da IA (chamada ao ai-service)
        const aiResponse = await this.callAIService(lead.id, message, 'whatsapp');

        // Salva resposta
        await this.conversations.saveMessage({
            leadId: lead.id,
            channel: 'whatsapp',
            role: 'assistant',
            content: aiResponse,
        });

        // Envia resposta via Evolution API
        await this.sendWhatsApp(instance, phone, aiResponse);

        return { ok: true };
    }

    async sendWhatsApp(instance: string, phone: string, text: string) {
        const url = process.env.EVOLUTION_API_URL;
        const key = process.env.EVOLUTION_API_KEY;

        if (!url || !key) {
            this.logger.warn('Evolution API não configurada');
            return;
        }

        try {
            await axios.post(`${url}/message/sendText/${instance}`, {
                number: phone,
                text,
            }, {
                headers: { apikey: key },
                timeout: 10000,
            });
        } catch (err: any) {
            this.logger.error(`Erro ao enviar WhatsApp: ${err.message}`);
        }
    }

    // ===== TELEGRAM =====
    async handleTelegram(payload: any) {
        const msg = payload?.message;
        if (!msg) return { ignored: true };

        const chatId = msg.chat.id.toString();
        const text = msg.text || '';
        const name = `${msg.from?.first_name || ''} ${msg.from?.last_name || ''}`.trim();

        const lead = await this.crm.findOrCreateByPhone(chatId, 'telegram');
        if (name) await this.crm.createLead({ phone: chatId, name, channel: 'telegram' });

        await this.conversations.saveMessage({ leadId: lead.id, channel: 'telegram', role: 'user', content: text });
        await this.crm.scoreUp(lead.id, 5);

        const aiResponse = await this.callAIService(lead.id, text, 'telegram');

        await this.conversations.saveMessage({ leadId: lead.id, channel: 'telegram', role: 'assistant', content: aiResponse });
        await this.sendTelegram(chatId, aiResponse);

        return { ok: true };
    }

    async sendTelegram(chatId: string, text: string) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) { this.logger.warn('Telegram não configurado'); return; }

        try {
            await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
                chat_id: chatId,
                text,
                parse_mode: 'Markdown',
            });
        } catch (err: any) {
            this.logger.error(`Erro Telegram: ${err.message}`);
        }
    }

    // ===== AI SERVICE CALL =====
    private async callAIService(leadId: string, message: string, channel: string): Promise<string> {
        const config = await this.aiConfig.getConfig();

        try {
            const res = await axios.post(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/chat`, {
                lead_id: leadId,
                message,
                channel,
                config: {
                    system_prompt: config.systemPrompt,
                    temperature: config.temperature,
                    model: config.model,
                },
            }, { timeout: 30000 });

            return res.data.reply || 'Olá! Como posso ajudar?';
        } catch (err: any) {
            this.logger.error(`AI Service error: ${err.message}`);
            return config.welcomeMessage;
        }
    }
}
