"use client";

import { useState } from "react";
import { Save, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

const INTEGRATIONS = [
    {
        group: "Pagamentos",
        items: [
            { key: "STRIPE_SECRET_KEY", label: "Stripe Secret Key", placeholder: "sk_live_...", hint: "Pagamentos internacionais (cartão)" },
            { key: "STRIPE_WEBHOOK_SECRET", label: "Stripe Webhook Secret", placeholder: "whsec_...", hint: "Valida webhooks do Stripe" },
            { key: "ASAAS_API_KEY", label: "Asaas API Key", placeholder: "aact_...", hint: "PIX e boleto para Brasil" },
        ],
    },
    {
        group: "IA",
        items: [
            { key: "OPENAI_API_KEY", label: "OpenAI API Key", placeholder: "sk-...", hint: "Respostas automáticas da IA" },
        ],
    },
    {
        group: "WhatsApp",
        items: [
            { key: "EVOLUTION_API_URL", label: "Evolution API URL", placeholder: "https://...", hint: "URL base da sua instância Evolution" },
            { key: "EVOLUTION_API_KEY", label: "Evolution API Key", placeholder: "API Key da Evolution", hint: "Chave de acesso da Evolution API" },
        ],
    },
    {
        group: "Telegram",
        items: [
            { key: "TELEGRAM_BOT_TOKEN", label: "Telegram Bot Token", placeholder: "123456:AAbb...", hint: "Token do seu bot Telegram (@BotFather)" },
        ],
    },
    {
        group: "Email (Resend)",
        items: [
            { key: "RESEND_API_KEY", label: "Resend API Key", placeholder: "re_...", hint: "Envio de e-mails transacionais" },
        ],
    },
];

// Detecta se uma var está configurada checando o padrão de env via API de health
// No futuro: checar /api/settings/status
function isConfigured(key: string): boolean | null {
    // Retorna null = desconhecido por ora (sem endpoint de checagem)
    return null;
}

export default function SettingsPage() {
    const [values, setValues] = useState<Record<string, string>>({});
    const [show, setShow] = useState<Record<string, boolean>>({});
    const [saved, setSaved] = useState(false);

    function patch(k: string, v: string) {
        setValues(prev => ({ ...prev, [k]: v }));
    }

    function toggleShow(k: string) {
        setShow(prev => ({ ...prev, [k]: !prev[k] }));
    }

    async function save() {
        // Gera o comando kubectl para atualizar o Secret com as chaves preenchidas
        const args = Object.entries(values)
            .filter(([, v]) => v.trim())
            .map(([k, v]) => `--from-literal=${k}=${v}`)
            .join(" \\\n  ");

        if (!args) {
            alert("Nenhuma chave foi preenchida.");
            return;
        }

        const cmd = `kubectl create secret generic biopeptidios-api-secrets \\\n  -n biopeptidios \\\n  ${args} \\\n  --save-config --dry-run=client -o yaml | kubectl apply -f -`;

        // Copia o comando para a área de transferência
        try { await navigator.clipboard.writeText(cmd); } catch { }

        // Exibe instrução
        alert(`Cole este comando no terminal do servidor para aplicar:\n\n${cmd}\n\n(O comando foi copiado para a área de transferência)`);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Configurações</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Integrações e chaves de API da plataforma</p>
                </div>
                <button onClick={save} className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {saved ? "Comando copiado ✓" : "Gerar comando kubectl"}
                </button>
            </div>

            {/* Aviso */}
            <div className="glass-card p-4 border border-yellow-500/20">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-yellow-300">Como aplicar as chaves</p>
                        <p className="text-xs text-slate-400 mt-1">
                            Preencha os campos abaixo e clique em "Gerar comando kubectl". O sistema vai copiar o comando para atualizar o Secret do Kubernetes. Cole no terminal do servidor e o backend reiniciará automaticamente com as novas variáveis.
                        </p>
                    </div>
                </div>
            </div>

            {INTEGRATIONS.map(group => (
                <div key={group.group} className="glass-card p-6 space-y-4">
                    <h2 className="font-semibold text-white text-sm border-b border-white/5 pb-3">{group.group}</h2>
                    {group.items.map(item => {
                        const configured = isConfigured(item.key);
                        return (
                            <div key={item.key} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs text-slate-400 font-medium font-mono">{item.key}</label>
                                    {configured === true && (
                                        <span className="flex items-center gap-1 text-[10px] text-accent-400">
                                            <CheckCircle className="w-3 h-3" /> Configurado
                                        </span>
                                    )}
                                    {configured === false && (
                                        <span className="flex items-center gap-1 text-[10px] text-yellow-400">
                                            <AlertCircle className="w-3 h-3" /> Pendente
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type={show[item.key] ? "text" : "password"}
                                        className="input pr-10"
                                        placeholder={item.placeholder}
                                        value={values[item.key] || ""}
                                        onChange={e => patch(item.key, e.target.value)}
                                    />
                                    <button
                                        onClick={() => toggleShow(item.key)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                    >
                                        {show[item.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-600">{item.hint}</p>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
