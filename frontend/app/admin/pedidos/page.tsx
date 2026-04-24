"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Search, ChevronRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

type OrderItem = { id: string; name: string; qty: number; price: number };
type Order = {
    id: string; amount: number; discountAmount: number; currency: string;
    status: string; paymentMethod?: string; couponCode?: string;
    createdAt: string; profile?: { name?: string; email: string };
    items: OrderItem[];
};

const STATUS_COLORS: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    paid: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    shipped: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    delivered: "text-emerald-500 bg-emerald-500/15 border-emerald-500/30",
    cancelled: "text-red-400 bg-red-500/10 border-red-500/20",
    refunded: "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

const STATUS_LABELS: Record<string, string> = {
    pending: "Pendente", paid: "Pago", shipped: "Enviado",
    delivered: "Entregue", cancelled: "Cancelado", refunded: "Reembolsado",
};

const NEXT_STATUS: Record<string, string[]> = {
    pending: ["paid", "cancelled"],
    paid: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
};

export default function AdminPedidos() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [selected, setSelected] = useState<Order | null>(null);

    const token = () => typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

    async function load() {
        setLoading(true);
        try {
            const r = await fetch(`${API}/api/ecommerce/admin/orders`, { headers: headers() });
            if (r.ok) { const d = await r.json(); setOrders(d.orders || d); }
        } finally { setLoading(false); }
    }

    useEffect(() => { load(); }, []);

    const filtered = orders.filter(o => {
        const matchSearch = !search || o.profile?.email?.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    async function updateStatus(orderId: string, status: string) {
        const r = await fetch(`${API}/api/ecommerce/admin/orders/${orderId}/status`, { method: "PATCH", headers: headers(), body: JSON.stringify({ status }) });
        if (r.ok) { load(); setSelected(null); }
    }

    const stats = { total: orders.length, pending: orders.filter(o => o.status === "pending").length, paid: orders.filter(o => o.status === "paid").length, revenue: orders.filter(o => ["paid", "shipped", "delivered"].includes(o.status)).reduce((s, o) => s + o.amount, 0) };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><ShoppingCart className="w-6 h-6 text-brand-400" /> Pedidos</h1>
                    <p className="text-slate-400 text-sm">Gerencie todos os pedidos do e-commerce</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="stat-card"><div className="text-2xl font-bold text-white">{stats.total}</div><div className="text-xs text-slate-500 mt-1">Total de Pedidos</div></div>
                <div className="stat-card"><div className="text-2xl font-bold text-yellow-400">{stats.pending}</div><div className="text-xs text-slate-500 mt-1">Pendentes</div></div>
                <div className="stat-card"><div className="text-2xl font-bold text-emerald-400">{stats.paid}</div><div className="text-xs text-slate-500 mt-1">Pagos</div></div>
                <div className="stat-card"><div className="text-2xl font-bold text-brand-400">R$ {stats.revenue.toFixed(2)}</div><div className="text-xs text-slate-500 mt-1">Receita Total</div></div>
            </div>

            <div className="glass-card p-4 flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-500" placeholder="Buscar por email ou ID do pedido..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="bg-transparent text-sm text-slate-300 outline-none border border-white/10 rounded-lg px-3 py-1.5" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">Todos os status</option>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
            </div>

            <div className="glass-card overflow-hidden">
                {loading ? <div className="p-12 text-center text-slate-400">Carregando...</div> : (
                    <div className="divide-y divide-white/5">
                        {filtered.length === 0 && <div className="p-12 text-center text-slate-500">Nenhum pedido encontrado</div>}
                        {filtered.map(o => (
                            <div key={o.id} className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors cursor-pointer" onClick={() => setSelected(o)}>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-slate-400">#{o.id.slice(-8).toUpperCase()}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status] || ""}`}>{STATUS_LABELS[o.status] || o.status}</span>
                                        {o.couponCode && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">🎫 {o.couponCode}</span>}
                                    </div>
                                    <div className="text-sm text-white mt-0.5">{o.profile?.name || o.profile?.email}</div>
                                    <div className="text-xs text-slate-400">{o.items.length} item(s) · {o.paymentMethod === "pix" ? "PIX" : "Cartão"}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-white">R$ {o.amount.toFixed(2)}</div>
                                    {o.discountAmount > 0 && <div className="text-xs text-emerald-400">-R$ {o.discountAmount.toFixed(2)}</div>}
                                    <div className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString("pt-BR")}</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
                    <div className="bg-[#0f1f35] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-white">Pedido #{selected.id.slice(-8).toUpperCase()}</h2>
                            <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[selected.status]}`}>{STATUS_LABELS[selected.status]}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm text-slate-300"><span className="text-slate-500">Cliente: </span>{selected.profile?.name || "—"} ({selected.profile?.email})</div>
                            <div className="text-sm text-slate-300"><span className="text-slate-500">Pagamento: </span>{selected.paymentMethod === "pix" ? "PIX" : "Cartão"}</div>
                            {selected.couponCode && <div className="text-sm text-slate-300"><span className="text-slate-500">Cupom: </span><span className="text-brand-300 font-mono">{selected.couponCode}</span> (−R$ {selected.discountAmount.toFixed(2)})</div>}
                        </div>
                        <div className="space-y-1.5">
                            <div className="text-xs text-slate-500 font-medium mb-2">ITENS</div>
                            {selected.items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm p-2 rounded-lg bg-white/3">
                                    <span className="text-slate-300">{item.name} × {item.qty}</span>
                                    <span className="text-white">R$ {(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/5">
                                <span className="text-slate-300">Total</span>
                                <span className="text-white">R$ {selected.amount.toFixed(2)}</span>
                            </div>
                        </div>
                        {(NEXT_STATUS[selected.status]?.length || 0) > 0 && (
                            <div>
                                <div className="text-xs text-slate-500 mb-2">ATUALIZAR STATUS</div>
                                <div className="flex gap-2">
                                    {(NEXT_STATUS[selected.status] || []).map(s => (
                                        <button key={s} onClick={() => updateStatus(selected.id, s)} className="flex-1 py-2 rounded-xl text-sm font-medium border border-white/10 text-white hover:bg-white/5">{STATUS_LABELS[s]}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
