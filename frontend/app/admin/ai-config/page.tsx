"use client";

import { useEffect, useState } from "react";
import { Bot, Save, RefreshCw, ChevronDown } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dev.aiwhatsapp.com.br";

const DEFAULT_CONFIG = {
    systemPrompt: "",
    temperature: 0.7,
    maxTokens: 500,
    model: "gpt-4o-mini",
    welcomeMessage: "",
    followUpDelay: 30,
    enableAutoCheckout: true,
    enableFollowUp: true,
};

export default function AIConfigPage() {
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (!token) return;
        fetch(`${API}/api/ai-config`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json()).then((data) => { setConfig({ ...DEFAULT_CONFIG, ...data }); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    async function save() {
        setSaving(true);
        await fetch(`${API}/api/ai-config`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(config),
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    async function reset() {
        if (!confirm("Resetar para configurações padrão?")) return;
        const res = await fetch(`${API}/api/ai-config/reset`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setConfig({ ...DEFAULT_CONFIG, ...data });
    }

    function patch(key: string, value: any) {
        setConfig((prev) => ({ ...prev, [key]: value }));
    }

    if (loading) return (
        <div className="flex items-center justify-center h-60">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Configuração da IA</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Personalize o comportamento do assistente de vendas</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={reset} className="btn-secondary flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Resetar
                    </button>
                    <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        {saving ? "Salvando..." : saved ? "✓ Salvo!" : "Salvar Config"}
                    </button>
                </div>
            </div>

            {/* System Prompt */}
            <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-brand-400" />
                    <h2 className="font-semibold text-white text-sm">Prompt System</h2>
                </div>
                <p className="text-xs text-slate-500">
                    Define como a IA se comporta em todas as conversas. Seja específico sobre o tom, objetivos e restrições.
                </p>
                <textarea
                    rows={8}
                    className="input w-full resize-none font-mono text-xs leading-relaxed"
                    value={config.systemPrompt}
                    onChange={(e) => patch("systemPrompt", e.target.value)}
                    placeholder="Você é um consultor especialista em otimização de performance..."
                />
            </div>

            {/* Model & Parameters */}
            <div className="glass-card p-6 space-y-4">
                <h2 className="font-semibold text-white text-sm mb-4">Modelo & Parâmetros</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-medium">Modelo OpenAI</label>
                        <div className="relative">
                            <select
                                className="input w-full appearance-none pr-8"
                                value={config.model}
                                onChange={(e) => patch("model", e.target.value)}
                            >
                                <option value="gpt-4o-mini">GPT-4o Mini (rápido)</option>
                                <option value="gpt-4o">GPT-4o (poderoso)</option>
                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-medium">
                            Temperatura: <span className="text-brand-400">{config.temperature}</span>
                        </label>
                        <input
                            type="range" min={0} max={1} step={0.1}
                            value={config.temperature}
                            onChange={(e) => patch("temperature", parseFloat(e.target.value))}
                            className="w-full accent-brand-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-600">
                            <span>Preciso</span><span>Criativo</span>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-medium">Max Tokens</label>
                        <input
                            type="number" min={100} max={2000} step={50}
                            className="input w-full"
                            value={config.maxTokens}
                            onChange={(e) => patch("maxTokens", parseInt(e.target.value))}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-medium">Follow-up (minutos)</label>
                        <input
                            type="number" min={5} max={120}
                            className="input w-full"
                            value={config.followUpDelay}
                            onChange={(e) => patch("followUpDelay", parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="glass-card p-6 space-y-4">
                <h2 className="font-semibold text-white text-sm">Mensagens Automáticas</h2>
                <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-medium">Mensagem de Boas-vindas</label>
                    <input
                        className="input w-full"
                        value={config.welcomeMessage}
                        onChange={(e) => patch("welcomeMessage", e.target.value)}
                        placeholder="Olá! Seja bem-vindo. Como posso ajudar?"
                    />
                </div>
            </div>

            {/* Toggles */}
            <div className="glass-card p-6">
                <h2 className="font-semibold text-white text-sm mb-4">Recursos Automáticos</h2>
                <div className="space-y-3">
                    {[
                        { key: "enableAutoCheckout", label: "Checkout automático", desc: "IA envia link de compra quando detectar intenção de compra" },
                        { key: "enableFollowUp", label: "Follow-up automático", desc: "Reenvia mensagem se cliente não responder após o delay configurado" },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                            <div>
                                <div className="text-sm font-medium text-white">{item.label}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                            </div>
                            <button
                                onClick={() => patch(item.key, !(config as any)[item.key])}
                                className={`w-11 h-6 rounded-full transition-colors ${(config as any)[item.key] ? "bg-brand-600" : "bg-slate-700"}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${(config as any)[item.key] ? "translate-x-5" : "translate-x-0"}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
