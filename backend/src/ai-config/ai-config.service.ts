import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AIConfiguration {
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
    model: string;
    welcomeMessage: string;
    followUpDelay: number; // minutos
    followUpMessages: string[];
    enableAutoCheckout: boolean;
    enableFollowUp: boolean;
}

const DEFAULT_CONFIG: AIConfiguration = {
    systemPrompt: `Você é um consultor especialista em otimização de performance e saúde.
Seu objetivo é entender o que o cliente busca e apresentar a solução ideal.
- Sempre faça perguntas para entender o objetivo do cliente
- Nunca se apresente como IA
- Conduza a conversa para a conversão natural
- Use linguagem profissional mas acessível
- Quando o cliente demonstrar interesse em comprar, ofereça o checkout`,
    temperature: 0.7,
    maxTokens: 500,
    model: 'gpt-4o-mini',
    welcomeMessage: 'Olá! Seja bem-vindo. Como posso ajudar você hoje?',
    followUpDelay: 30,
    followUpMessages: [
        'Oi, ainda está por aqui? Posso te ajudar com alguma dúvida?',
        'Caso queira retomar nossa conversa, estou à disposição!',
    ],
    enableAutoCheckout: true,
    enableFollowUp: true,
};

@Injectable()
export class AIConfigService {
    constructor(private readonly prisma: PrismaService) { }

    async getConfig(): Promise<AIConfiguration> {
        const settings = await this.prisma.setting.findMany({
            where: { key: { startsWith: 'ai_' } },
        });

        if (!settings.length) return DEFAULT_CONFIG;

        const config: any = { ...DEFAULT_CONFIG };
        for (const s of settings) {
            const key = s.key.replace('ai_', '');
            try {
                config[key] = JSON.parse(s.value);
            } catch {
                config[key] = s.value;
            }
        }

        return config as AIConfiguration;
    }

    async updateConfig(patch: Partial<AIConfiguration>) {
        const operations = Object.entries(patch).map(([key, value]) =>
            this.prisma.setting.upsert({
                where: { key: `ai_${key}` },
                create: { key: `ai_${key}`, value: JSON.stringify(value) },
                update: { value: JSON.stringify(value) },
            })
        );

        await this.prisma.$transaction(operations);
        return this.getConfig();
    }

    async resetToDefault() {
        await this.prisma.setting.deleteMany({ where: { key: { startsWith: 'ai_' } } });
        return DEFAULT_CONFIG;
    }
}
