import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

// ─────────────────────────────────────────────────────────────────────────────
// OpenAI Agent Service — Tools/Functions para o assistente BioPeptídeos
// O agente tem conhecimento completo do site e responde no WhatsApp
// ─────────────────────────────────────────────────────────────────────────────

export interface AgentContext {
    leadId: string;
    phone: string;
    channel: 'whatsapp' | 'telegram' | 'chat';
    userMessage: string;
    conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    config: {
        systemPrompt: string;
        model: string;
        temperature: number;
        maxTokens: number;
        enableTools: boolean;
    };
}

@Injectable()
export class AIAgentService {
    private readonly logger = new Logger(AIAgentService.name);

    constructor(private readonly prisma: PrismaService) { }

    // ─── Instância OpenAI (lê chave do banco ou ENV) ──────────────────────
    private async getOpenAI(): Promise<OpenAI> {
        const keyRow = await this.prisma.setting.findUnique({ where: { key: 'openai.api_key' } });
        const apiKey = keyRow?.value || process.env.OPENAI_API_KEY || '';
        if (!apiKey) throw new Error('OpenAI API Key não configurada. Configure em Admin → Config IA → IA & OpenAI');
        return new OpenAI({ apiKey });
    }

    // ─── TOOLS DEFINITION (OpenAI function calling) ─────────────────────────

    private readonly TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
        {
            type: 'function',
            function: {
                name: 'get_site_info',
                description: 'Retorna informações completas do site: preços dos planos, descrição do ebook, benefícios do Premium e informações de contato.',
                parameters: {
                    type: 'object',
                    properties: {
                        topic: {
                            type: 'string',
                            enum: ['prices', 'ebook', 'premium', 'catalog', 'all'],
                            description: 'Qual informação deseja: prices (preços), ebook (info do ebook), premium (benefícios premium), catalog (catálogo), all (tudo)',
                        },
                    },
                    required: ['topic'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'search_peptides',
                description: 'Busca peptídeos na biblioteca completa do site. Use quando cliente perguntar sobre um peptídeo específico, efeitos, protocolos, dosagem ou indicações.',
                parameters: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string',
                            description: 'Nome do peptídeo ou termos de busca (ex: "BPC-157", "emagrecimento", "testosterona", "recuperação muscular")',
                        },
                    },
                    required: ['query'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'get_user_profile',
                description: 'Retorna o perfil do usuário atual: plano ativo, histórico de compras e dados de cadastro.',
                parameters: {
                    type: 'object',
                    properties: {},
                    required: [],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'create_checkout_link',
                description: 'Gera o link de checkout para o cliente comprar. Use quando o cliente demonstrar intenção de compra.',
                parameters: {
                    type: 'object',
                    properties: {
                        plan: {
                            type: 'string',
                            enum: ['basic', 'premium'],
                            description: '"basic" = Ebook R$29,90 | "premium" = Ebook + IA + Protocolos R$89,90',
                        },
                        name: {
                            type: 'string',
                            description: 'Nome do cliente (se conhecido)',
                        },
                    },
                    required: ['plan'],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'save_lead_data',
                description: 'Salva ou atualiza dados do cliente no CRM (nome, email, interesse). Use quando o cliente fornecer dados pessoais.',
                parameters: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'Nome completo do cliente' },
                        email: { type: 'string', description: 'Email do cliente' },
                        interest: { type: 'string', description: 'Interesse demonstrado (ex: emagrecimento, ganho muscular, saúde hormonal)' },
                    },
                    required: [],
                },
            },
        },
        {
            type: 'function',
            function: {
                name: 'get_protocols',
                description: 'Busca protocolos de uso de peptídeos por objetivo do cliente.',
                parameters: {
                    type: 'object',
                    properties: {
                        goal: {
                            type: 'string',
                            description: 'Objetivo do cliente (ex: emagrecimento, ganho muscular, longevidade, saúde sexual, sono)',
                        },
                    },
                    required: ['goal'],
                },
            },
        },
    ];

    // ─── TOOLS EXECUTION ─────────────────────────────────────────────────────

    private async executeTool(toolName: string, args: any, context: AgentContext): Promise<string> {
        this.logger.log(`Tool: ${toolName} args: ${JSON.stringify(args)}`);

        switch (toolName) {
            case 'get_site_info':
                return this.toolGetSiteInfo(args.topic);

            case 'search_peptides':
                return this.toolSearchPeptides(args.query);

            case 'get_user_profile':
                return this.toolGetUserProfile(context.leadId);

            case 'create_checkout_link':
                return this.toolCreateCheckoutLink(args.plan, args.name, context.phone);

            case 'save_lead_data':
                return this.toolSaveLeadData(context.leadId, args);

            case 'get_protocols':
                return this.toolGetProtocols(args.goal);

            default:
                return `Tool ${toolName} não encontrada.`;
        }
    }

    // ─── TOOL IMPLEMENTATIONS ─────────────────────────────────────────────────

    private async toolGetSiteInfo(topic: string): Promise<string> {
        const [basicPriceRow, premiumPriceRow] = await Promise.all([
            this.prisma.setting.findUnique({ where: { key: 'price.basic' } }),
            this.prisma.setting.findUnique({ where: { key: 'price.premium' } }),
        ]);

        const basicPrice = parseFloat(basicPriceRow?.value || '29.90');
        const premiumPrice = parseFloat(premiumPriceRow?.value || '89.90');

        const info: any = {
            prices: {
                ebook_basic: {
                    price: basicPrice,
                    original_price: 69.90,
                    label: `📘 Ebook — Acesso Vitalício`,
                    description: 'O Código Secreto dos Peptídeos — Guia completo com 70 peptídeos, indicações, dosagens e protocolos de uso.',
                },
                premium: {
                    price: premiumPrice,
                    original_price: 129.90,
                    label: '🚀 Plano Premium',
                    description: 'Ebook + IA com protocolos personalizados por biotipo + análise específica para seu perfil + acesso à plataforma completa.',
                },
            },
            ebook: {
                title: 'O Código Secreto dos Peptídeos',
                topics: 70,
                description: 'Guia científico completo sobre peptídeos bioativos: o que são, como funcionam, protocolos de uso, indicações e contraindicações. Acesso vitalício, atualizado constantemente.',
                benefits: [
                    '70 peptídeos detalhados com dosagem e protocolo',
                    'Linguagem acessível com base científica',
                    'Protocolos por objetivo (emagrecimento, muscle, longevidade, hormonal)',
                    'Acesso imediato após o pagamento',
                    'Atualizações gratuitas inclusas',
                ],
                access_url: 'https://peptideosbio.com/ebook',
            },
            premium: {
                extra_benefits: [
                    '🤖 IA especializada em peptídeos disponível 24h',
                    '📊 Análise personalizada por biotipo',
                    '🧬 Protocolos específicos por objetivo do seu corpo',
                    '💬 Interações ilimitadas com o assistente',
                    '🔬 Recomendações baseadas no seu histórico',
                    '📱 Acesso à plataforma completa',
                ],
            },
            catalog: {
                description: 'Catálogo de produtos BioPeptídeos com suplementos, peptídeos e protocolos.',
                url: 'https://peptideosbio.com/catalog',
            },
        };

        if (topic === 'all') return JSON.stringify(info, null, 2);
        return JSON.stringify(info[topic] || info, null, 2);
    }

    private async toolSearchPeptides(query: string): Promise<string> {
        try {
            const results = await this.prisma.peptide.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { category: { contains: query, mode: 'insensitive' } },
                    ],
                },
                take: 3,
                select: { name: true, slug: true, description: true, category: true, isPro: true },
            });

            if (!results.length) {
                return `Nenhum peptídeo encontrado para "${query}". Tente: BPC-157, TB-500, GHK-Cu, emagrecimento, sono, hormonal.`;
            }

            return results.map(p =>
                `**${p.name}** (${p.category || 'Peptídeo'}): ${p.description || 'Ver detalhes em peptideosbio.com/library/' + p.slug}`
            ).join('\n\n');
        } catch {
            return 'Base de peptídeos temporariamente indisponível.';
        }
    }

    private async toolGetUserProfile(leadId: string): Promise<string> {
        try {
            const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
            if (!lead) return 'Usuário ainda não cadastrado no sistema.';

            // Busca compras pelo email do lead se disponivel
            const purchases = lead.email ? await this.prisma.ebookPurchase.findMany({
                where: { profile: { email: lead.email } },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { plan: true, amount: true, status: true, createdAt: true },
            }) : [];

            return JSON.stringify({
                name: lead.name || 'Não informado',
                email: lead.email,
                phone: lead.phone,
                purchases,
                score: lead.score,
                status: lead.status,
            }, null, 2);
        } catch {
            return 'Perfil não encontrado.';
        }
    }

    private async toolCreateCheckoutLink(plan: string, name?: string, phone?: string): Promise<string> {
        const baseUrl = process.env.APP_URL || 'https://peptideosbio.com';
        const params = new URLSearchParams({ plan, product: 'ebook' });
        if (name) params.set('name', name);
        if (phone) params.set('whatsapp', phone);

        const url = `${baseUrl}/checkout?${params.toString()}`;
        return JSON.stringify({
            checkout_url: url,
            plan,
            price: plan === 'premium' ? 'R$ 89,90' : 'R$ 29,90',
            message: `Aqui está seu link de acesso direto ao checkout: ${url}`,
        });
    }

    private async toolSaveLeadData(leadId: string, data: { name?: string; email?: string; interest?: string }): Promise<string> {
        try {
            const updates: any = {};
            if (data.name) updates.name = data.name;
            if (data.email) updates.email = data.email;
            if (data.interest) updates.source = data.interest;

            await this.prisma.lead.update({ where: { id: leadId }, data: updates });
            return `Dados salvos com sucesso: ${JSON.stringify(updates)}`;
        } catch {
            return 'Não foi possível salvar os dados.';
        }
    }

    private async toolGetProtocols(goal: string): Promise<string> {
        const protocols: Record<string, any> = {
            emagrecimento: {
                title: 'Protocolo de Emagrecimento',
                peptides: ['AOD-9604', 'CJC-1295', 'MOTS-c', 'Semaglutide'],
                approach: 'Combinação de peptídeos lipolíticos com controle de apetite e melhora da sensibilidade à insulina.',
                notes: 'Resultados melhores combinados com dieta adequada e atividade física.',
            },
            ganho_muscular: {
                title: 'Protocolo de Ganho Muscular',
                peptides: ['BPC-157', 'TB-500', 'IGF-1 LR3', 'CJC-1295/Ipamorelin'],
                approach: 'Estímulo à síntese proteica, recuperação muscular acelerada e aumento do GH endógeno.',
            },
            longevidade: {
                title: 'Protocolo de Longevidade',
                peptides: ['Epithalon', 'Semax', 'MOTS-c', 'GHK-Cu', 'Thymalin'],
                approach: 'Ativação de telomerase, neuroproteção, otimização mitocondrial e modulação imune.',
            },
            sono: {
                title: 'Protocolo de Melhora do Sono',
                peptides: ['DSIP', 'Epitalon', 'Selank'],
                approach: 'Regulação do ciclo circadiano, redução de cortisol e melhora da qualidade do sono profundo.',
            },
            saude_hormonal: {
                title: 'Protocolo de Saúde Hormonal',
                peptides: ['Kisspeptin', 'Gonadorelin', 'Ipamorelin', 'CJC-1295'],
                approach: 'Estímulo endógeno ao eixo HPG para otimização natural de testosterona e GH.',
            },
        };

        const key = goal.toLowerCase().replace(/\s+/g, '_');
        const protocol = protocols[key] || Object.values(protocols).find(() => true);

        if (!protocol) return `Protocolo para "${goal}" não encontrado. Objetivos disponíveis: emagrecimento, ganho muscular, longevidade, sono, saúde hormonal.`;

        return JSON.stringify(protocol, null, 2);
    }

    // ─── MAIN AGENT LOOP (com tool calling) ──────────────────────────────────

    async chat(context: AgentContext): Promise<string> {
        const openai = await this.getOpenAI();

        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: 'system', content: context.config.systemPrompt },
            ...context.conversationHistory.slice(-10), // últimas 10 mensagens
            { role: 'user', content: context.userMessage },
        ];

        let response = await openai.chat.completions.create({
            model: context.config.model || 'gpt-4o-mini',
            messages,
            tools: context.config.enableTools ? this.TOOLS : undefined,
            tool_choice: context.config.enableTools ? 'auto' : undefined,
            temperature: context.config.temperature ?? 0.7,
            max_tokens: context.config.maxTokens ?? 500,
        });

        let finalContent = '';
        let iterations = 0;
        const MAX_ITERATIONS = 5;

        // Agentic loop — processa tool calls até ter resposta final
        while (iterations < MAX_ITERATIONS) {
            iterations++;
            const choice = response.choices[0];

            if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls) {
                messages.push(choice.message as any);

                // Executa todas as tools em paralelo
                const toolResults = await Promise.all(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (choice.message.tool_calls as any[]).map(async (tc: any) => {
                        const args = JSON.parse(tc.function?.arguments || '{}');
                        const result = await this.executeTool(tc.function?.name, args, context);
                        return { role: 'tool' as const, tool_call_id: tc.id, content: result };
                    })
                );

                messages.push(...toolResults);

                // Nova chamada com resultados das tools
                response = await openai.chat.completions.create({
                    model: context.config.model || 'gpt-4o-mini',
                    messages,
                    tools: this.TOOLS,
                    tool_choice: 'auto',
                    temperature: context.config.temperature ?? 0.7,
                    max_tokens: context.config.maxTokens ?? 500,
                });
            } else {
                finalContent = choice.message.content || '';
                break;
            }
        }

        this.logger.log(`Agent: ${iterations} iterações para "${context.userMessage.slice(0, 50)}"`);
        return finalContent || 'Desculpe, não consegui processar sua mensagem.';
    }
}
