import { Injectable, Logger } from '@nestjs/common';
import { CrmService } from '../crm/crm.service';
import { ConversationsService } from '../conversations/conversations.service';
import { AIConfigService } from '../ai-config/ai-config.service';
import { AIAgentService } from './ai-agent.service';
import { EvolutionService } from './evolution.service';
import { PrismaService } from '../prisma/prisma.service';

// Cache em memória para deduplicação de mensagens (evita resposta dupla)
const processedMessages = new Set<string>();
const DEDUP_TTL_MS = 60_000; // 1 minuto

@Injectable()
export class ChannelsService {
    private readonly logger = new Logger(ChannelsService.name);

    constructor(
        private readonly crm: CrmService,
        private readonly conversations: ConversationsService,
        private readonly aiConfig: AIConfigService,
        private readonly aiAgent: AIAgentService,
        private readonly evolution: EvolutionService,
        private readonly prisma: PrismaService,
    ) { }

    // ===== WHATSAPP — Evolution API v2.3.7 ================================
    async handleWhatsApp(payload: any) {
        // Suporte ao formato MESSAGES_UPSERT da Evolution API v2.3.7
        const event = payload?.event || payload?.type || 'MESSAGES_UPSERT';
        const data = payload?.data || payload;

        // Só processa mensagens novas
        if (event !== 'MESSAGES_UPSERT' && event !== 'messages.upsert') {
            return { ignored: true, event };
        }

        // Extrai dados da mensagem (formato Evolution v2.x)
        const key = data?.key || {};
        const messageId = key?.id || '';
        const remoteJid = key?.remoteJid || '';
        const fromMe = key?.fromMe || false;

        // Ignora mensagens enviadas por nós mesmos e grupos
        if (fromMe || remoteJid.endsWith('@g.us')) {
            return { ignored: true, reason: fromMe ? 'own_message' : 'group' };
        }

        // ── Deduplicação por messageId ──────────────────────────────────
        if (messageId && processedMessages.has(messageId)) {
            this.logger.debug(`Mensagem duplicada ignorada: ${messageId}`);
            return { ignored: true, reason: 'duplicate' };
        }
        if (messageId) {
            processedMessages.add(messageId);
            setTimeout(() => processedMessages.delete(messageId), DEDUP_TTL_MS);
        }

        // Extrai telefone e texto
        const phone = remoteJid.replace('@s.whatsapp.net', '').replace('@c.us', '');
        const message =
            data?.message?.conversation ||
            data?.message?.extendedTextMessage?.text ||
            data?.message?.imageMessage?.caption ||
            data?.message?.videoMessage?.caption ||
            '';

        const instanceName = payload?.instance || data?.instance || 'default';

        if (!message.trim() || !phone) {
            return { ignored: true, reason: 'no_text' };
        }

        this.logger.log(`📩 WhatsApp ${phone}: "${message.slice(0, 80)}"`);

        // Busca ou cria lead no CRM
        const lead = await this.crm.findOrCreateByPhone(`+${phone}`, 'whatsapp');

        // Salva mensagem recebida
        await this.conversations.saveMessage({
            leadId: lead.id,
            channel: 'whatsapp',
            role: 'user',
            content: message,
        });

        await this.crm.scoreUp(lead.id, 5);

        // Busca histórico de conversa
        const history = await this.conversations.getHistory(lead.id, 20);
        const conversationHistory = history.slice(0, -1).map(m => ({
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content,
        }));

        // Carrega config da IA
        const config = await this.aiConfig.getConfig();

        // Gera resposta com o agente OpenAI
        const aiResponse = await this.aiAgent.chat({
            leadId: lead.id,
            phone,
            channel: 'whatsapp',
            userMessage: message,
            conversationHistory,
            config: {
                systemPrompt: config.systemPrompt,
                model: (config as any).model || 'gpt-4o-mini',
                temperature: config.temperature ?? 0.7,
                maxTokens: config.maxTokens ?? 500,
                enableTools: (config as any).enableTools !== false,
            },
        }).catch(err => {
            this.logger.error(`Agent error: ${err.message}`);
            return config.welcomeMessage || 'Olá! Como posso ajudar?';
        });

        // Salva resposta da IA
        await this.conversations.saveMessage({
            leadId: lead.id,
            channel: 'whatsapp',
            role: 'assistant',
            content: aiResponse,
        });

        // Envia resposta via Evolution API v2.3.7
        await this.evolution.sendText(instanceName, phone, aiResponse)
            .catch(err => this.logger.error(`Erro ao enviar WhatsApp: ${err.message}`));

        return { ok: true, phone, responseLength: aiResponse.length };
    }

    // ===== TELEGRAM =========================================================
    async handleTelegram(payload: any) {
        const msg = payload?.message;
        if (!msg) return { ignored: true };

        const chatId = msg.chat.id.toString();
        const text = msg.text || '';
        const name = `${msg.from?.first_name || ''} ${msg.from?.last_name || ''}`.trim();

        if (!text.trim()) return { ignored: true, reason: 'no_text' };

        const lead = await this.crm.findOrCreateByPhone(chatId, 'telegram');
        if (name) await this.crm.createLead({ phone: chatId, name, channel: 'telegram' });

        await this.conversations.saveMessage({ leadId: lead.id, channel: 'telegram', role: 'user', content: text });
        await this.crm.scoreUp(lead.id, 5);

        const history = await this.conversations.getHistory(lead.id, 20);
        const config = await this.aiConfig.getConfig();

        const aiResponse = await this.aiAgent.chat({
            leadId: lead.id,
            phone: chatId,
            channel: 'telegram',
            userMessage: text,
            conversationHistory: history.slice(0, -1).map(m => ({
                role: m.role as 'user' | 'assistant' | 'system',
                content: m.content,
            })),
            config: {
                systemPrompt: config.systemPrompt,
                model: (config as any).model || 'gpt-4o-mini',
                temperature: config.temperature ?? 0.7,
                maxTokens: config.maxTokens ?? 500,
                enableTools: (config as any).enableTools !== false,
            },
        }).catch(() => config.welcomeMessage || 'Olá! Como posso ajudar?');

        await this.conversations.saveMessage({ leadId: lead.id, channel: 'telegram', role: 'assistant', content: aiResponse });
        await this.sendTelegram(chatId, aiResponse);

        return { ok: true };
    }

    async sendTelegram(chatId: string, text: string) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) { this.logger.warn('Telegram não configurado'); return; }

        const { default: axios } = await import('axios');
        try {
            await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
                chat_id: chatId, text, parse_mode: 'Markdown',
            });
        } catch (err: any) {
            this.logger.error(`Erro Telegram: ${err.message}`);
        }
    }
}
