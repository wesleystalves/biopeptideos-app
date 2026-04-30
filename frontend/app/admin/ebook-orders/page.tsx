"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen, Search, Filter, Download, RefreshCw, TrendingUp, DollarSign, CheckCircle, Clock } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

type Purchase = {
    id: string;
    plan: string;
    amount: number;
    gateway: string;
    gatewayId: string;
    status: string;
    createdAt: string;
    profile?: { name?: string; email: string; phone?: string };
};

const STATUS_STYLE: Record<string, string> = {
    paid: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
    refunded: "bg-red-500/15 text-red-400 border border-red-500/25",
};

const PLAN_STYLE: Record<string, string> = {
    basic: "bg-brand-500/15 text-brand-400 border border-brand-500/25",
    premium: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
};

function exportCSV(purchases: Purchase[]) {
    const headers = ["ID", "Data", "Status", "Plano", "Valor", "Nome", "Email", "WhatsApp", "Gateway ID"];
    const rows = purchases.map(p => [
        p.id,
        new Date(p.createdAt).toLocaleString("pt-BR"),
        p.status,
        p.plan,
        `R$ ${p.amount.toFixed(2)}`,
        p.profile?.name || "",
        p.profile?.email || "",
        p.profile?.phone || "",
        p.gatewayId,
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `ebook-compras-${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
}

export default function AdminEbookOrders() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [plan, setPlan] = useState("");
    const [page, setPage] = useState(1);

    const token = () => typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const h = () => ({ Authorization: `Bearer ${token()}` });

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "50" });
            if (status) params.set("status", status);
            if (plan) params.set("plan", plan);
            const r = await fetch(`${API}/api/analytics/ebook-purchases?${params}`, { headers: h() });
            const d = await r.json();
            setData(d);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [page, status, plan]); // eslint-disable-line

    useEffect(() => { load(); }, [load]);
    useEffect(() => { setPage(1); }, [status, plan, search]);

    const purchases: Purchase[] = data?.purchases || [];
    const filtered = purchases.filter(p =>
        !search || p.profile?.email?.toLowerCase().includes(search.toLowerCase()) ||
        p.profile?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.gatewayId?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-brand-400" /> Compras do Ebook
                    </h1>
                    <p className="text-slate-400 text-sm mt-0.5">Histórico completo de todas as transações</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} className="glass-card px-3 py-2 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-1.5 text-sm">
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
                    </button>
                    <button onClick={() => exportCSV(filtered)} className="btn-success px-4 py-2 flex items-center gap-1.5 text-sm">
                        <Download className="w-4 h-4" /> Exportar CSV
                    </button>
                </div>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    {
                        label: "Total Vendas", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10",
                        value: data?.summary?.totalPaid ?? 0,
                        sub: `de ${data?.total ?? 0} registros`,
                    },
                    {
                        label: "Receita Total", icon: DollarSign, color: "text-brand-400", bg: "bg-brand-500/10",
                        value: data?.summary?.totalRevenue != null ? `R$ ${data.summary.totalRevenue.toFixed(2).replace(".", ",")}` : "R$ 0",
                        sub: "pagamentos confirmados",
                    },
                    {
                        label: "Basic", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10",
                        value: purchases.filter(p => p.plan === "basic" && p.status === "paid").length,
                        sub: "R$ 29,90 cada",
                    },
                    {
                        label: "Premium", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10",
                        value: purchases.filter(p => p.plan === "premium" && p.status === "paid").length,
                        sub: "R$ 89,90 cada",
                    },
                ].map(k => (
                    <div key={k.label} className="glass-card p-4">
                        <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
                            <k.icon className={`w-4 h-4 ${k.color}`} />
                        </div>
                        <div className="text-xl font-black text-white">{k.value}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{k.label}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{k.sub}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="glass-card p-4 flex flex-wrap gap-3">
                <div className="flex-1 min-w-48 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <input className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-500"
                        placeholder="Buscar por email, nome, ID..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <select value={status} onChange={e => setStatus(e.target.value)}
                        className="bg-white/5 border border-white/10 text-sm text-slate-300 rounded-xl px-3 py-2 outline-none">
                        <option value="">Todos status</option>
                        <option value="paid">Pago</option>
                        <option value="pending">Pendente</option>
                        <option value="refunded">Reembolsado</option>
                    </select>
                    <select value={plan} onChange={e => setPlan(e.target.value)}
                        className="bg-white/5 border border-white/10 text-sm text-slate-300 rounded-xl px-3 py-2 outline-none">
                        <option value="">Todos planos</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" /> Carregando...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center">
                        <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-400">Nenhuma compra encontrada</p>
                        <p className="text-slate-600 text-sm mt-1">As compras aparecerão aqui após os primeiros pagamentos</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        {["Data", "Usuário", "Plano", "Valor", "Status", "Gateway ID"].map(h => (
                                            <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.map(p => (
                                        <tr key={p.id} className="hover:bg-white/2 transition-colors group">
                                            <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                                                {new Date(p.createdAt).toLocaleDateString("pt-BR")}<br />
                                                <span className="text-xs text-slate-600">{new Date(p.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-white">{p.profile?.name || "—"}</div>
                                                <div className="text-xs text-slate-500">{p.profile?.email}</div>
                                                {p.profile?.phone && <div className="text-xs text-slate-600">{p.profile.phone}</div>}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${PLAN_STYLE[p.plan] || "bg-white/5 text-slate-400"}`}>
                                                    {p.plan === "basic" ? "📘 Basic" : "🚀 Premium"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-bold text-emerald-400 whitespace-nowrap">
                                                R$ {p.amount.toFixed(2).replace(".", ",")}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[p.status] || "bg-white/5 text-slate-400"}`}>
                                                    {p.status === "paid" ? "✅ Pago" : p.status === "pending" ? "⏳ Pendente" : p.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <code className="text-xs text-slate-500 font-mono bg-white/5 px-2 py-0.5 rounded">
                                                    {p.gatewayId?.slice(0, 16)}...
                                                </code>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {data?.pages > 1 && (
                            <div className="p-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs text-slate-500">
                                    Página {data.page} de {data.pages} · {data.total} registros
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                        className="glass-card px-3 py-1.5 rounded-lg text-sm text-slate-400 disabled:opacity-30">← Anterior</button>
                                    <button onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages}
                                        className="glass-card px-3 py-1.5 rounded-lg text-sm text-slate-400 disabled:opacity-30">Próxima →</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
