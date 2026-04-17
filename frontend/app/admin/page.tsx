"use client";

import { useEffect, useState } from "react";
import {
    TrendingUp, Users, ShoppingBag, MessageSquare,
    DollarSign, ArrowUpRight, Activity, Zap
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

const revenueData = [
    { day: "Seg", value: 0 }, { day: "Ter", value: 0 }, { day: "Qua", value: 0 },
    { day: "Qui", value: 0 }, { day: "Sex", value: 0 }, { day: "Sáb", value: 0 },
    { day: "Dom", value: 0 },
];

const channelData = [
    { name: "WhatsApp", leads: 0 },
    { name: "Telegram", leads: 0 },
    { name: "Email", leads: 0 },
    { name: "Chat", leads: 0 },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch(`${API}/api/analytics/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then(setStats)
            .catch(console.error);
    }, []);

    const kpis = [
        {
            label: "Leads Totais",
            value: stats?.leads?.total ?? "—",
            sub: `${stats?.leads?.today ?? 0} hoje`,
            icon: Users,
            color: "text-brand-400",
            bg: "bg-brand-500/10",
        },
        {
            label: "Taxa de Conversão",
            value: stats?.leads?.conversionRate ?? "—",
            sub: `${stats?.leads?.won ?? 0} fechados`,
            icon: TrendingUp,
            color: "text-accent-400",
            bg: "bg-accent-500/10",
        },
        {
            label: "Receita Total",
            value: stats?.revenue?.total ? `$${stats.revenue.total.toFixed(2)}` : "—",
            sub: `$${stats?.revenue?.thisMonth?.toFixed(2) ?? 0} este mês`,
            icon: DollarSign,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
        },
        {
            label: "Conversas Hoje",
            value: stats?.conversations?.today ?? "—",
            sub: "Todos os canais",
            icon: MessageSquare,
            color: "text-rose-400",
            bg: "bg-rose-500/10",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Visão geral da plataforma BioPeptidios</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/25">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-xs font-semibold text-yellow-400">PRE-LAUNCH MODE</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((k) => (
                    <div key={k.label} className="stat-card">
                        <div className="flex items-start justify-between">
                            <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center`}>
                                <k.icon className={`w-5 h-5 ${k.color}`} />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="mt-2">
                            <div className="text-2xl font-bold text-white">{k.value}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
                            <div className="text-xs text-slate-600 mt-1">{k.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue chart */}
                <div className="glass-card p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-semibold text-white">Receita — últimos 7 dias</h2>
                        <Activity className="w-4 h-4 text-slate-500" />
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: "#0f1f35", border: "1px solid rgba(14,165,233,0.15)", borderRadius: 12 }}
                                labelStyle={{ color: "#94a3b8" }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="url(#revenueGrad)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Channels chart */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-semibold text-white">Leads por Canal</h2>
                        <Zap className="w-4 h-4 text-slate-500" />
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={channelData} layout="vertical">
                            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                            <Tooltip
                                contentStyle={{ background: "#0f1f35", border: "1px solid rgba(14,165,233,0.15)", borderRadius: 12 }}
                            />
                            <Bar dataKey="leads" fill="#10b981" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pipeline stats */}
            <div className="glass-card p-6">
                <h2 className="font-semibold text-white mb-5">Pipeline de Vendas</h2>
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: "Novos", key: "new", color: "badge-blue" },
                        { label: "Contato", key: "contacted", color: "badge-gray" },
                        { label: "Qualificado", key: "qualified", color: "badge-yellow" },
                        { label: "Proposta", key: "proposal", color: "badge-yellow" },
                        { label: "Negociação", key: "negotiation", color: "badge-yellow" },
                        { label: "Fechado", key: "won", color: "badge-green" },
                        { label: "Perdido", key: "lost", color: "badge-red" },
                    ].map((s) => (
                        <div key={s.key} className={`${s.color} flex items-center gap-2`}>
                            {s.label} <span className="font-bold">{stats?.leads?.[s.key] ?? 0}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
