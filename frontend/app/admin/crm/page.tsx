"use client";

import { useEffect, useState } from "react";
import { Users, Search, Filter, MoreHorizontal, Star, Tag } from "lucide-react";
import { clsx } from "clsx";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dev.aiwhatsapp.com.br";

const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
    new: { label: "Novo", badge: "badge-blue" },
    contacted: { label: "Contato", badge: "badge-gray" },
    qualified: { label: "Qualificado", badge: "badge-yellow" },
    proposal: { label: "Proposta", badge: "badge-yellow" },
    negotiation: { label: "Negociação", badge: "badge-yellow" },
    won: { label: "Fechado ✓", badge: "badge-green" },
    lost: { label: "Perdido", badge: "badge-red" },
};

const CHANNEL_ICONS: Record<string, string> = {
    whatsapp: "💬",
    telegram: "✈️",
    email: "📧",
    chat: "🌐",
};

export default function CRMPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filter !== "all") params.set("status", filter);
        fetch(`${API}/api/crm/leads?${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => { setLeads(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => { setLeads([]); setLoading(false); });
    }, [filter, token]);

    const filtered = leads.filter(
        (l) =>
            !search ||
            l.name?.toLowerCase().includes(search.toLowerCase()) ||
            l.phone?.includes(search) ||
            l.email?.toLowerCase().includes(search.toLowerCase())
    );

    async function updateStatus(id: string, status: string) {
        await fetch(`${API}/api/crm/leads/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status }),
        });
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">CRM — Leads</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{filtered.length} leads encontrados</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        className="input pl-9 w-60"
                        placeholder="Buscar por nome, email, telefone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["all", "new", "contacted", "qualified", "won", "lost"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={clsx(
                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                filter === s
                                    ? "bg-brand-600 text-white"
                                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                            )}
                        >
                            {s === "all" ? "Todos" : STATUS_LABELS[s]?.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                        <Users className="w-10 h-10 mb-3 opacity-30" />
                        <p>Nenhum lead encontrado</p>
                        <p className="text-xs mt-1 text-slate-600">Leads aparecem quando clientes entram em contato via WhatsApp, Telegram ou Chat</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Lead</th>
                                <th>Canal</th>
                                <th>Score</th>
                                <th>Status</th>
                                <th>Tags</th>
                                <th>Criado em</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((lead) => {
                                const s = STATUS_LABELS[lead.status] || { label: lead.status, badge: "badge-gray" };
                                return (
                                    <tr key={lead.id}>
                                        <td>
                                            <div className="font-medium text-white">{lead.name || "—"}</div>
                                            <div className="text-xs text-slate-500">{lead.phone || lead.email || "Sem contato"}</div>
                                        </td>
                                        <td>
                                            <span title={lead.channel}>{CHANNEL_ICONS[lead.channel] || "?"} {lead.channel}</span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-yellow-400" />
                                                <span className="text-yellow-400 font-semibold">{lead.score}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateStatus(lead.id, e.target.value)}
                                                className="bg-transparent text-xs border-none outline-none cursor-pointer"
                                            >
                                                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                                    <option key={k} value={k} className="bg-dark-900">{v.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap gap-1">
                                                {(Array.isArray(lead.tags) ? lead.tags : []).map((t: string) => (
                                                    <span key={t} className="badge badge-blue text-[10px]">
                                                        <Tag className="w-2.5 h-2.5 mr-0.5" />{t}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="text-slate-500 text-xs">
                                            {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                                        </td>
                                        <td>
                                            <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                                                <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
