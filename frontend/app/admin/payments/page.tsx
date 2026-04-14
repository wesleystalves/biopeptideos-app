"use client";

import { useState, useEffect } from "react";
import ClientLayout from "@/components/client-layout";
import { CheckCircle2, AlertCircle, Loader2, Eye, EyeOff, RefreshCw, Save, Zap } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dw.peptideosbio.com";

/* ── Tipos de campo ─────────────────────────────────────── */
type FieldDef = {
    key: string; label: string; type: "text" | "select" | "toggle" | "url";
    placeholder?: string; options?: { value: string; label: string }[];
    help?: string; sensitive?: boolean;
};

const FIELDS: FieldDef[] = [
    {
        key: "asaas.env", label: "Ambiente", type: "select",
        options: [{ value: "sandbox", label: "🧪 Sandbox (testes)" }, { value: "production", label: "🚀 Produção" }],
        help: "Sandbox: use para testar. Produção: cobranças reais."
    },
    {
        key: "asaas.api_key", label: "API Key (Sandbox)", type: "text",
        placeholder: "$aact_...", sensitive: true,
        help: "Disponível em: app.sandbox.asaas.com → Minha Conta → API"
    },
    {
        key: "asaas.api_key_prod", label: "API Key (Produção)", type: "text",
        placeholder: "$aact_...", sensitive: true,
        help: "Disponível em: app.asaas.com → Minha Conta → API"
    },
    {
        key: "asaas.webhook_url", label: "Webhook URL", type: "url",
        placeholder: "https://api.biopeptidios.dw.peptideosbio.com/api/payments/webhook/asaas",
        help: "Configure esta URL no painel Asaas → Configurações → Webhooks"
    },
    {
        key: "asaas.webhook_token", label: "Token do Webhook", type: "text",
        placeholder: "Token secreto para validar notificações", sensitive: true,
        help: "Token que o Asaas envia no header para validar a requisição"
    },
    {
        key: "asaas.pix_key", label: "Chave Pix", type: "text",
        placeholder: "CPF, CNPJ, email ou chave aleatória",
        help: "Chave Pix cadastrada no Asaas para identificar o recebedor"
    },
    {
        key: "asaas.default_methods", label: "Métodos de pagamento aceitos", type: "text",
        placeholder: '["PIX","BOLETO","CREDIT_CARD"]',
        help: 'JSON: ["PIX","BOLETO","CREDIT_CARD"] — todos ou alguns'
    },
    {
        key: "asaas.due_days", label: "Dias de vencimento do boleto", type: "text",
        placeholder: "3",
        help: "Número de dias úteis para vencimento após emissão do boleto"
    },
    {
        key: "asaas.fine_pct", label: "% Multa pós-vencimento", type: "text",
        placeholder: "2",
        help: "Porcentagem de multa aplicada após vencimento (ex: 2 = 2%)"
    },
    {
        key: "asaas.interest_pct", label: "% Juros ao mês", type: "text",
        placeholder: "1",
        help: "Juros mensais após vencimento (ex: 1 = 1% ao mês)"
    },
    {
        key: "asaas.split_enabled", label: "Split de pagamento ativo", type: "select",
        options: [{ value: "false", label: "Desativado" }, { value: "true", label: "Ativado" }],
        help: "Repasse automático para outro wallet ao receber"
    },
    {
        key: "asaas.split_wallet_id", label: "Wallet ID do Split", type: "text",
        placeholder: "wal_...",
        help: "ID da carteira Asaas destino para o split de pagamento"
    },
    {
        key: "asaas.notifications_email", label: "Email de notificações", type: "text",
        placeholder: "financeiro@empresa.com",
        help: "Email que recebe notificações de pagamentos e alertas"
    },
];

/* ── Principal ──────────────────────────────────────────── */
export default function AdminPaymentsPage() {
    const [values, setValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
    const [saved, setSaved] = useState(false);
    const [hidden, setHidden] = useState<Set<string>>(new Set(FIELDS.filter(f => f.sensitive).map(f => f.key)));

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${API}/api/admin/gateway`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then((data: Record<string, { key: string; value: string | null }>) => {
                const v: Record<string, string> = {};
                for (const [k, row] of Object.entries(data)) {
                    v[k] = row.value ?? "";
                }
                setValues(v);
            })
            .finally(() => setLoading(false));
    }, []);

    async function handleSave() {
        setSaving(true);
        setSaved(false);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/admin/gateway`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        setSaving(false);
        if (res.ok) setSaved(true);
    }

    async function handleTest() {
        setTesting(true);
        setTestResult(null);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/admin/gateway/test`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTestResult(data.ok
            ? { ok: true, msg: `✅ Conexão OK — Ambiente: ${data.env} — Clientes: ${data.customers ?? 0}` }
            : { ok: false, msg: `❌ ${data.error}` }
        );
        setTesting(false);
    }

    const toggleHide = (key: string) => {
        const s = new Set(hidden);
        if (s.has(key)) s.delete(key); else s.add(key);
        setHidden(s);
    };

    if (loading) {
        return (
            <ClientLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
                </div>
            </ClientLayout>
        );
    }

    return (
        <ClientLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">💳 Gateway de Pagamento</h1>
                        <p className="text-slate-400 text-sm">Configurações do Asaas — salvas no banco de dados, nunca em arquivos.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleTest}
                            disabled={testing}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-brand-500/40 text-sm transition-all"
                        >
                            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            Testar conexão
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Salvar configurações
                        </button>
                    </div>
                </div>

                {/* Alerts */}
                {saved && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Configurações salvas com sucesso no banco de dados.
                    </div>
                )}
                {testResult && (
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm border ${testResult.ok ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "bg-red-500/10 border-red-500/25 text-red-400"}`}>
                        {testResult.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {testResult.msg}
                    </div>
                )}

                {/* Env badge */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20">
                    <Zap className="w-5 h-5 text-brand-400" />
                    <div>
                        <div className="text-sm font-medium text-white">
                            Ambiente atual: <span className={values["asaas.env"] === "production" ? "text-emerald-400" : "text-amber-400"}>
                                {values["asaas.env"] === "production" ? "🚀 Produção" : "🧪 Sandbox"}
                            </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">Salve para atualizar o ambiente usado nas transações.</div>
                    </div>
                </div>

                {/* Form fields */}
                <div className="glass-card divide-y divide-white/5">
                    {FIELDS.map(field => (
                        <div key={field.key} className="p-5">
                            <label className="block text-sm font-medium text-white mb-1">{field.label}</label>
                            {field.help && <p className="text-xs text-slate-500 mb-3">{field.help}</p>}

                            {field.type === "select" ? (
                                <select
                                    className="input"
                                    value={values[field.key] ?? ""}
                                    onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                                >
                                    {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            ) : (
                                <div className="relative">
                                    <input
                                        type={field.sensitive && hidden.has(field.key) ? "password" : "text"}
                                        className="input pr-10"
                                        placeholder={field.placeholder}
                                        value={values[field.key] ?? ""}
                                        onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                                    />
                                    {field.sensitive && (
                                        <button
                                            type="button"
                                            onClick={() => toggleHide(field.key)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                        >
                                            {hidden.has(field.key) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer save */}
                <div className="flex justify-end pb-8">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium transition-all"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Salvar configurações
                    </button>
                </div>
            </div>
        </ClientLayout>
    );
}
