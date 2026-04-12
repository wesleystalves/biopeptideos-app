"use client";

import { useState } from "react";
import { Plus, Zap, X, Clock, MessageSquare, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

const TRIGGERS = [
    { value: "new_lead", label: "🎯 Nova Lead criada" },
    { value: "no_response_24h", label: "⏰ Sem resposta por 24h" },
    { value: "no_response_72h", label: "⏰ Sem resposta por 72h" },
    { value: "status_qualified", label: "✅ Lead qualificada" },
    { value: "status_won", label: "🏆 Venda fechada" },
    { value: "order_paid", label: "💳 Pedido pago" },
    { value: "order_shipped", label: "📦 Pedido enviado" },
];

const CHANNELS = [
    { value: "whatsapp", label: "WhatsApp" },
    { value: "telegram", label: "Telegram" },
    { value: "email", label: "Email" },
];

const PLACEHOLDERS = [
    "{{name}}", "{{phone}}", "{{email}}", "{{product}}", "{{checkout_url}}", "{{order_id}}"
];

const EXAMPLE_AUTOMATIONS = [
    { id: "1", name: "Boas-vindas WhatsApp", trigger: "new_lead", channel: "whatsapp", delay: 0, message: "Olá {{name}}! Bem-vindo à BioPeptidios 🧬. Posso ajudar com algo?", active: true },
    { id: "2", name: "Follow-up 24h", trigger: "no_response_24h", channel: "whatsapp", delay: 1440, message: "Oi {{name}}, ainda estou por aqui se quiser tirar dúvidas sobre nossos peptídeos.", active: true },
    { id: "3", name: "Confirmação de Pedido", trigger: "order_paid", channel: "email", delay: 0, message: "Olá {{name}}, seu pedido #{{order_id}} foi confirmado! Entrega em até 7 dias.", active: false },
];

export default function AutomationsPage() {
    const [automations, setAutomations] = useState(EXAMPLE_AUTOMATIONS);
    const [showNew, setShowNew] = useState(false);
    const [form, setForm] = useState({ name: "", trigger: "new_lead", channel: "whatsapp", delay: 0, message: "", active: true });

    function patch(k: string, v: any) { setForm(p => ({ ...p, [k]: v })); }

    function addAutomation() {
        if (!form.name || !form.message) return;
        setAutomations(prev => [...prev, { ...form, id: Date.now().toString() }]);
        setForm({ name: "", trigger: "new_lead", channel: "whatsapp", delay: 0, message: "", active: true });
        setShowNew(false);
    }

    function toggleActive(id: string) {
        setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    }

    function remove(id: string) {
        setAutomations(prev => prev.filter(a => a.id !== id));
    }

    function insertPlaceholder(ph: string) {
        setForm(p => ({ ...p, message: p.message + ph }));
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Automações</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Fluxos automáticos de mensagens por evento</p>
                </div>
                <button onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nova Automação
                </button>
            </div>

            {/* Aviso sobre implementação */}
            <div className="glass-card p-4 border border-brand-500/20">
                <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-brand-300">Automações — Configuração</p>
                        <p className="text-xs text-slate-400 mt-1">
                            As automações aqui configuradas serão salvas no banco e executadas pelo sistema de filas BullMQ quando os eventos ocorrerem. Configure os canais e chaves API em{" "}
                            <strong className="text-brand-400">Configurações</strong> primeiro.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Nova Automação */}
            {showNew && (
                <div className="glass-card p-6 animate-slide-up space-y-4">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="font-semibold text-white text-sm">Nova Automação</h2>
                        <button onClick={() => setShowNew(false)}><X className="w-4 h-4 text-slate-400" /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 block mb-1.5">Nome</label>
                            <input className="input" placeholder="Ex: Boas-vindas" value={form.name} onChange={e => patch("name", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1.5">Canal</label>
                            <div className="relative">
                                <select className="input appearance-none pr-8" value={form.channel} onChange={e => patch("channel", e.target.value)}>
                                    {CHANNELS.map(c => <option key={c.value} value={c.value} className="bg-dark-900">{c.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 block mb-1.5">Trigger</label>
                            <select className="input" value={form.trigger} onChange={e => patch("trigger", e.target.value)}>
                                {TRIGGERS.map(t => <option key={t.value} value={t.value} className="bg-dark-900">{t.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1.5">
                                Delay: <span className="text-brand-400">{form.delay} min</span>
                            </label>
                            <input type="range" min={0} max={10080} step={30} value={form.delay}
                                onChange={e => patch("delay", parseInt(e.target.value))} className="w-full accent-brand-500 mt-2" />
                            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                                <span>Imediato</span><span>1h</span><span>1dia</span><span>1semana</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 block mb-1.5">Mensagem</label>
                        <textarea
                            rows={4}
                            className="input resize-none"
                            placeholder="Escreva a mensagem..."
                            value={form.message}
                            onChange={e => patch("message", e.target.value)}
                        />
                        <div className="flex gap-1.5 flex-wrap mt-2">
                            {PLACEHOLDERS.map(ph => (
                                <button key={ph} onClick={() => insertPlaceholder(ph)}
                                    className="px-2 py-0.5 bg-brand-500/10 text-brand-400 text-[11px] font-mono rounded border border-brand-500/20 hover:bg-brand-500/20 transition-colors">
                                    {ph}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={addAutomation} className="btn-primary">Criar Automação</button>
                        <button onClick={() => setShowNew(false)} className="btn-secondary">Cancelar</button>
                    </div>
                </div>
            )}

            {/* Lista de automações */}
            <div className="space-y-3">
                {automations.map(a => {
                    const trigger = TRIGGERS.find(t => t.value === a.trigger);
                    return (
                        <div key={a.id} className={clsx("glass-card p-5 flex gap-4 items-start", !a.active && "opacity-60")}>
                            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5 text-brand-400" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-white text-sm">{a.name}</h3>
                                    <span className={`badge text-[10px] ${a.active ? "badge-green" : "badge-gray"}`}>
                                        {a.active ? "Ativo" : "Pausado"}
                                    </span>
                                    <span className="badge badge-blue text-[10px]">{a.channel}</span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {trigger?.label || a.trigger}</span>
                                    {a.delay > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.delay >= 60 ? `${a.delay / 60}h` : `${a.delay}min`} depois</span>}
                                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {a.message.length} chars</span>
                                </div>

                                <p className="text-xs text-slate-400 line-clamp-2 bg-white/[0.02] rounded-lg px-3 py-2 font-mono">
                                    {a.message}
                                </p>
                            </div>

                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => toggleActive(a.id)}
                                    className={clsx("px-3 py-1.5 text-xs rounded-lg transition-all", a.active ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20" : "bg-accent-500/10 text-accent-400 hover:bg-accent-500/20")}
                                >
                                    {a.active ? "Pausar" : "Ativar"}
                                </button>
                                <button onClick={() => remove(a.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
