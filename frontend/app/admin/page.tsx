"use client";

import { useEffect, useState, useCallback } from "react";
import {
    TrendingUp, Users, ShoppingBag, MessageSquare,
    DollarSign, ArrowUpRight, BookOpen, Crown,
    RefreshCw, Calendar, Activity, Package, Zap
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend, CartesianGrid,
    ComposedChart, Line
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";
const COLORS = ["#5b8af5", "#00e5cc", "#f59e0b", "#ef4444", "#a78bfa", "#34d399"];

const fmtBRL = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;
const fmtShort = (v: number) => v >= 1000 ? `R$ ${(v / 1000).toFixed(1)}k` : fmtBRL(v);

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "#0d1f35", border: "1px solid rgba(91,138,245,0.2)", borderRadius: 10, padding: "10px 14px" }}>
            <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color, fontSize: 13, fontWeight: 700 }}>
                    {p.name}: {typeof p.value === "number" && p.name.toLowerCase().includes("receita") || p.name.toLowerCase().includes("total") || p.name.toLowerCase().includes("ebook") || p.name.toLowerCase().includes("catálogo")
                        ? fmtBRL(p.value) : p.value}
                </p>
            ))}
        </div>
    );
}

function KpiCard({ label, value, sub, icon: Icon, color, bg, trend }: any) {
    return (
        <div className="glass-card p-5 hover:border-white/10 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                {trend !== undefined && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                        {trend >= 0 ? "+" : ""}{trend}%
                    </span>
                )}
            </div>
            <div className="text-2xl font-black text-white mb-0.5">{value}</div>
            <div className="text-xs text-slate-400 font-medium">{label}</div>
            {sub && <div className="text-xs text-slate-600 mt-1">{sub}</div>}
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [revenue, setRevenue] = useState<any[]>([]);
    const [usersByDay, setUsersByDay] = useState<any[]>([]);
    const [planDist, setPlanDist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(30);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const token = () => typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const h = () => ({ Authorization: `Bearer ${token()}` });

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [s, r, u, p] = await Promise.all([
                fetch(`${API}/api/analytics/dashboard`, { headers: h() }).then(r => r.json()),
                fetch(`${API}/api/analytics/revenue?days=${days}`, { headers: h() }).then(r => r.json()),
                fetch(`${API}/api/analytics/users-by-day?days=${days}`, { headers: h() }).then(r => r.json()),
                fetch(`${API}/api/analytics/plan-distribution`, { headers: h() }).then(r => r.json()),
            ]);
            setStats(s);
            setRevenue(Array.isArray(r) ? r : []);
            setUsersByDay(Array.isArray(u) ? u : []);
            setPlanDist(Array.isArray(p) ? p.map((x: any) => ({ name: x.plan, value: x.count })) : []);
            setLastRefresh(new Date());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [days]); // eslint-disable-line

    useEffect(() => { load(); }, [load]);

    const kpis = [
        {
            label: "Receita Total",
            value: stats?.revenue?.total != null ? fmtShort(stats.revenue.total) : "R$ 0",
            sub: `${fmtBRL(stats?.revenue?.thisMonth ?? 0)} este mês`,
            icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10",
        },
        {
            label: "Vendas Ebook",
            value: stats?.ebook?.paid ?? 0,
            sub: `${fmtBRL(stats?.ebook?.revenue ?? 0)} total`,
            icon: BookOpen, color: "text-brand-400", bg: "bg-brand-500/10",
        },
        {
            label: "Usuários",
            value: stats?.users?.total ?? 0,
            sub: `+${stats?.users?.today ?? 0} hoje · +${stats?.users?.thisMonth ?? 0} este mês`,
            icon: Users, color: "text-accent-400", bg: "bg-accent-500/10",
        },
        {
            label: "Pedidos Catálogo",
            value: stats?.orders?.paid ?? 0,
            sub: `${stats?.orders?.pendingPayment ?? 0} pendentes`,
            icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-500/10",
        },
        {
            label: "Leads CRM",
            value: stats?.leads?.total ?? 0,
            sub: `Taxa: ${stats?.leads?.conversionRate ?? "0%"}`,
            icon: TrendingUp, color: "text-yellow-400", bg: "bg-yellow-500/10",
        },
        {
            label: "Premium Ativos",
            value: stats?.ebook?.premium ?? 0,
            sub: `${stats?.ebook?.basic ?? 0} básicos`,
            icon: Crown, color: "text-rose-400", bg: "bg-rose-500/10",
        },
        {
            label: "Conversas Hoje",
            value: stats?.conversations?.today ?? 0,
            sub: "Todos os canais",
            icon: MessageSquare, color: "text-cyan-400", bg: "bg-cyan-500/10",
        },
        {
            label: "Rec. Catálogo",
            value: fmtShort(stats?.revenue?.catalog ?? 0),
            sub: `${fmtBRL(stats?.revenue?.catalogMonth ?? 0)} este mês`,
            icon: Package, color: "text-orange-400", bg: "bg-orange-500/10",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-0.5">
                        Atualizado às {lastRefresh.toLocaleTimeString("pt-BR")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Period selector */}
                    {[7, 14, 30, 90].map(d => (
                        <button key={d} onClick={() => setDays(d)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${days === d ? "bg-brand-600 text-white" : "glass-card text-slate-400 hover:text-white"}`}>
                            {d}d
                        </button>
                    ))}
                    <button onClick={load} className="glass-card px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all" title="Atualizar">
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {kpis.map(k => <KpiCard key={k.label} {...k} />)}
            </div>

            {/* Revenue Chart */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="font-semibold text-white">Receita Consolidada</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Ebook + Catálogo · últimos {days} dias</p>
                    </div>
                    <Activity className="w-4 h-4 text-slate-500" />
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={revenue}>
                        <defs>
                            <linearGradient id="ebookGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5b8af5" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#5b8af5" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="catalogGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00e5cc" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#00e5cc" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={v => `R$${v}`} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 8 }} />
                        <Area type="monotone" dataKey="ebook" name="Ebook" stroke="#5b8af5" fill="url(#ebookGrad)" strokeWidth={2} />
                        <Area type="monotone" dataKey="catalog" name="Catálogo" stroke="#00e5cc" fill="url(#catalogGrad)" strokeWidth={2} />
                        <Line type="monotone" dataKey="total" name="Total" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Users + Plan Distribution */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Users by day */}
                <div className="glass-card p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-semibold text-white">Novos Usuários</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Cadastros por dia · {days} dias</p>
                        </div>
                        <Users className="w-4 h-4 text-slate-500" />
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={usersByDay}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 8 }} />
                            <Bar dataKey="basic" name="Básico" stackId="a" fill="#5b8af5" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="premium" name="Premium" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Plan distribution */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-semibold text-white">Planos</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Distribuição atual</p>
                        </div>
                        <Crown className="w-4 h-4 text-slate-500" />
                    </div>
                    {planDist.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie data={planDist} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                                        paddingAngle={3} dataKey="value" nameKey="name">
                                        {planDist.map((_: any, i: number) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: "#0d1f35", border: "1px solid rgba(91,138,245,0.2)", borderRadius: 10 }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 mt-2">
                                {planDist.map((d: any, i: number) => (
                                    <div key={d.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                            <span className="text-slate-400 capitalize">{d.name}</span>
                                        </div>
                                        <span className="text-white font-semibold">{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 text-slate-500 text-sm">Sem dados</div>
                    )}
                </div>
            </div>

            {/* Ebook revenue split */}
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h2 className="font-semibold text-white mb-5">Receita Ebook por Plano</h2>
                    <div className="space-y-4">
                        {[
                            { label: "📘 Ebook Basic", count: stats?.ebook?.basic ?? 0, price: 29.9, color: "#5b8af5" },
                            { label: "🚀 Premium", count: stats?.ebook?.premium ?? 0, price: 89.9, color: "#f59e0b" },
                        ].map(p => {
                            const total = p.count * p.price;
                            const max = Math.max((stats?.ebook?.basic ?? 0) * 29.9, (stats?.ebook?.premium ?? 0) * 89.9, 1);
                            const pct = (total / max) * 100;
                            return (
                                <div key={p.label}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-slate-300">{p.label} ({p.count})</span>
                                        <span className="font-bold text-white">{fmtBRL(total)}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-white/5">
                                        <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: p.color }} />
                                    </div>
                                </div>
                            );
                        })}
                        <div className="pt-2 border-t border-white/5 flex justify-between text-sm">
                            <span className="text-slate-400">Total Ebook</span>
                            <span className="font-black text-emerald-400">{fmtBRL(stats?.ebook?.revenue ?? 0)}</span>
                        </div>
                    </div>
                </div>

                {/* Pipeline */}
                <div className="glass-card p-6">
                    <h2 className="font-semibold text-white mb-5">Pipeline de Vendas CRM</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Novos", key: "new", color: "#5b8af5" },
                            { label: "Contatado", key: "contacted", color: "#64748b" },
                            { label: "Qualificado", key: "qualified", color: "#f59e0b" },
                            { label: "Proposta", key: "proposal", color: "#a78bfa" },
                            { label: "Negociação", key: "negotiation", color: "#f59e0b" },
                            { label: "Fechado ✅", key: "won", color: "#34d399" },
                        ].map(s => (
                            <div key={s.key} className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-slate-400">{s.label}</div>
                                    <div className="text-lg font-black text-white">{stats?.leads?.[s.key] ?? 0}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
