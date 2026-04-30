import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from '../prisma/prisma.service';

// Evolution API v2.3.7 — endpoints oficiais
// Docs: https://doc.evolution-api.com/v2/
const EVO_VERSION = '2.3.7';

export interface InstanceInfo {
    instanceName: string;
    status: 'open' | 'close' | 'connecting' | 'unknown';
    profilePicUrl?: string;
    profileName?: string;
    number?: string;
}

@Injectable()
export class EvolutionService {
    private readonly logger = new Logger(`EvolutionService@${EVO_VERSION}`);

    constructor(private readonly prisma: PrismaService) { }

    // ─── Busca config do banco ──────────────────────────────────────────
    private async getClient(): Promise<AxiosInstance> {
        const [urlRow, keyRow] = await Promise.all([
            this.prisma.setting.findUnique({ where: { key: 'evolution.url' } }),
            this.prisma.setting.findUnique({ where: { key: 'evolution.api_key' } }),
        ]);

        const baseURL = urlRow?.value || process.env.EVOLUTION_API_URL || '';
        const apikey = keyRow?.value || process.env.EVOLUTION_API_KEY || '';

        if (!baseURL) throw new Error('Evolution API URL não configurada. Configure em Admin → Config IA → WhatsApp');

        return axios.create({
            baseURL: baseURL.replace(/\/$/, ''),
            headers: { apikey, 'Content-Type': 'application/json' },
            timeout: 30000,
        });
    }

    // ─── INSTÂNCIAS ─────────────────────────────────────────────────────

    /** Lista todas as instâncias */
    async listInstances(): Promise<InstanceInfo[]> {
        try {
            const client = await this.getClient();
            const { data } = await client.get('/instance/fetchInstances');
            const instances = Array.isArray(data) ? data : (data?.instances || []);
            return instances.map((i: any) => ({
                instanceName: i.instance?.instanceName || i.instanceName,
                status: i.instance?.status || i.connectionStatus || 'unknown',
                profilePicUrl: i.instance?.profilePicUrl,
                profileName: i.instance?.profileName,
                number: i.instance?.number,
            }));
        } catch (err: any) {
            this.logger.error(`listInstances: ${err.message}`);
            return [];
        }
    }

    /** Cria nova instância */
    async createInstance(name: string, webhookUrl?: string): Promise<any> {
        const client = await this.getClient();
        const payload: any = {
            instanceName: name,
            integration: 'WHATSAPP-BAILEYS',
            qrcode: true,
            rejectCall: false,
            msgCall: 'Não consigo atender chamadas no momento.',
            groupsIgnore: true,
            alwaysOnline: true,
            readMessages: true,
            readStatus: true,
        };

        if (webhookUrl) {
            payload.webhook = {
                url: webhookUrl,
                byEvents: true,
                base64: false,
                events: [
                    'MESSAGES_UPSERT',
                    'CONNECTION_UPDATE',
                    'QRCODE_UPDATED',
                ],
            };
        }

        const { data } = await client.post('/instance/create', payload);
        this.logger.log(`Instância criada: ${name}`);
        return data;
    }

    /** Busca QR Code (base64) para escanear */
    async getQrCode(instanceName: string): Promise<{ qrCode?: string; pairingCode?: string; status: string }> {
        try {
            const client = await this.getClient();
            const { data } = await client.get(`/instance/connect/${instanceName}`);
            return {
                qrCode: data?.base64 || data?.qrcode?.base64 || null,
                pairingCode: data?.pairingCode || null,
                status: data?.instance?.status || 'connecting',
            };
        } catch (err: any) {
            this.logger.warn(`getQrCode ${instanceName}: ${err.message}`);
            return { status: 'error' };
        }
    }

    /** Status da conexão */
    async getStatus(instanceName: string): Promise<string> {
        try {
            const client = await this.getClient();
            const { data } = await client.get(`/instance/connectionState/${instanceName}`);
            return data?.instance?.state || data?.state || 'unknown';
        } catch {
            return 'unknown';
        }
    }

    /** Configura webhook da instância */
    async setWebhook(instanceName: string, webhookUrl: string, events?: string[]): Promise<any> {
        const client = await this.getClient();
        const { data } = await client.post(`/webhook/set/${instanceName}`, {
            url: webhookUrl,
            byEvents: true,
            base64: false,
            events: events || [
                'MESSAGES_UPSERT',
                'MESSAGES_UPDATE',
                'MESSAGES_DELETE',
                'CONNECTION_UPDATE',
                'QRCODE_UPDATED',
                'PRESENCE_UPDATE',
            ],
        });
        return data;
    }

    /** Envia mensagem de texto */
    async sendText(instanceName: string, phone: string, text: string): Promise<any> {
        try {
            const client = await this.getClient();
            const { data } = await client.post(`/message/sendText/${instanceName}`, {
                number: phone,
                text,
                delay: 1200, // simula digitação humana (ms)
            });
            return data;
        } catch (err: any) {
            this.logger.error(`sendText ${instanceName} → ${phone}: ${err.message}`);
            throw err;
        }
    }

    /** Envia imagem */
    async sendImage(instanceName: string, phone: string, imageUrl: string, caption?: string): Promise<any> {
        const client = await this.getClient();
        const { data } = await client.post(`/message/sendMedia/${instanceName}`, {
            number: phone,
            mediatype: 'image',
            media: imageUrl,
            caption: caption || '',
        });
        return data;
    }

    /** Logout (desconecta WhatsApp sem remover instância) */
    async logout(instanceName: string): Promise<any> {
        const client = await this.getClient();
        const { data } = await client.delete(`/instance/logout/${instanceName}`);
        return data;
    }

    /** Remove instância completamente */
    async deleteInstance(instanceName: string): Promise<any> {
        const client = await this.getClient();
        const { data } = await client.delete(`/instance/delete/${instanceName}`);
        return data;
    }

    /** Restart instância */
    async restartInstance(instanceName: string): Promise<any> {
        const client = await this.getClient();
        const { data } = await client.put(`/instance/restart/${instanceName}`);
        return data;
    }

    /** Verifica conectividade com a Evolution API */
    async testConnection(): Promise<{ ok: boolean; version?: string; error?: string }> {
        try {
            const client = await this.getClient();
            // Health check — tenta listar instâncias
            await client.get('/instance/fetchInstances');
            return { ok: true, version: EVO_VERSION };
        } catch (err: any) {
            return { ok: false, error: err.message };
        }
    }
}
