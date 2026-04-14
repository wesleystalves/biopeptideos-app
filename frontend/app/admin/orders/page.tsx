"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Filter } from "lucide-react";
import { clsx } from "clsx";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dw.peptideosbio.com";

const STATUS_BADGE: Record<string, string> = {
    pending: "badge-yellow", paid: "badge-green",
    shipped: "badge-blue", cancelled: "badge-red", refunded: "badge-gray",
};
const STATUS_LABEL: Record<string, string> = {
    pending: "Pendente", paid: "Pago", shipped: "Enviado",
    cancelled: "Cancelado", refunded: "Reembolsado",
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        setLoading(true);
        const params = filter !== "all" ? `?status=${filter}` : "";
        fetch(`${API}/api/payments/orders${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => { setOrders([]); setLoading(false); });
    }, [filter, token]);

    const totalRevenue = orders
        .filter(o => o.status === "paid")
        .reduce((acc, o) => acc + Number(o.amount || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Pedidos</h1>
                    <p className="text-slate-400 text-sm mt-0.5">
                        {orders.length} pedidos · Receita paga:{" "}
                        <span className="text-accent-400 font-semibold">${totalRevenue.toFixed(2)}</span>
                    </p>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-slate-500" />
                {["all", "pending", "paid", "shipped", "cancelled"].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={clsx(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            filter === s ? "bg-brand-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
                        )}
                    >
                        {s === "all" ? "Todos" : STATUS_LABEL[s]}
                    </button>
                ))}
            </div>

            {/* Tabela */}
            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                        <ShoppingBag className="w-10 h-10 mb-3 opacity-30" />
                        <p>Nenhum pedido encontrado</p>
                        <p className="text-xs mt-1 text-slate-600">Pedidos aparecem após clientes realizarem checkout</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Produto</th>
                                <th>Valor</th>
                                <th>Gateway</th>
                                <th>Status</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id}>
                                    <td className="font-mono text-xs text-slate-500">{o.id.slice(0, 8)}...</td>
                                    <td>
                                        <div className="text-sm font-medium text-white">{o.profile?.name || "—"}</div>
                                        <div className="text-xs text-slate-500">{o.profile?.email || "—"}</div>
                                    </td>
                                    <td className="text-sm">{o.product?.name || o.productId?.slice(0, 12) || "—"}</td>
                                    <td className="font-semibold text-accent-400">
                                        {o.currency} {Number(o.amount).toFixed(2)}
                                    </td>
                                    <td>
                                        <span className="badge badge-blue text-[10px] uppercase">{o.gateway || "—"}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${STATUS_BADGE[o.status] || "badge-gray"}`}>
                                            {STATUS_LABEL[o.status] || o.status}
                                        </span>
                                    </td>
                                    <td className="text-xs text-slate-500">
                                        {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
