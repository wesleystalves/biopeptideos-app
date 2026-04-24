"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, ChevronDown, ChevronUp, Package } from "lucide-react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

type OrderItem = { id: string; name: string; qty: number; price: number };
type Order = {
    id: string; amount: number; discountAmount: number; status: string;
    paymentMethod?: string; couponCode?: string; createdAt: string;
    items: OrderItem[];
};

const STATUS_LABELS: Record<string, string> = {
    pending: "Aguardando Pagamento", paid: "Pago", shipped: "Enviado",
    delivered: "Entregue", cancelled: "Cancelado", refunded: "Estornado",
};
const STATUS_COLORS: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    paid: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    shipped: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    delivered: "text-emerald-500 bg-emerald-500/15 border-emerald-500/30",
    cancelled: "text-red-400 bg-red-500/10 border-red-500/20",
    refunded: "text-orange-400 bg-orange-500/10 border-orange-500/20",
};

export default function MeusPedidosPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/auth/login"); return; }
        fetch(`${API}/api/ecommerce/orders`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setOrders(d.orders || d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="min-h-screen bg-[#050d1a] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full" /></div>;

    return (
        <div className="min-h-screen bg-[#050d1a] text-white">
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><ShoppingBag className="w-7 h-7 text-brand-400" /> Meus Pedidos</h1>

                {orders.length === 0 ? (
                    <div className="glass-card p-16 text-center space-y-4">
                        <Package className="w-12 h-12 text-slate-600 mx-auto" />
                        <h2 className="text-xl font-semibold text-slate-300">Nenhum pedido ainda</h2>
                        <p className="text-slate-500">Explore nosso catálogo de peptídeos</p>
                        <a href="/catalog" className="btn-primary inline-flex items-center gap-2 mt-2">Ver Catálogo</a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(o => (
                            <div key={o.id} className="glass-card overflow-hidden">
                                <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-mono text-sm text-slate-400">#{o.id.slice(-8).toUpperCase()}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[o.status] || ""}`}>{STATUS_LABELS[o.status] || o.status}</span>
                                            {o.couponCode && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">🎫 {o.couponCode}</span>}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">{new Date(o.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })} · {o.paymentMethod === "pix" ? "PIX" : "Cartão"}</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="font-bold text-white">R$ {o.amount.toFixed(2)}</div>
                                        {o.discountAmount > 0 && <div className="text-xs text-emerald-400">economizou R$ {o.discountAmount.toFixed(2)}</div>}
                                    </div>
                                    {expanded === o.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </div>
                                {expanded === o.id && (
                                    <div className="border-t border-white/5 px-5 pb-5 pt-3 space-y-2">
                                        {o.items.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm p-3 rounded-xl bg-white/3">
                                                <span className="text-slate-300">{item.name} × {item.qty}</span>
                                                <span className="text-white font-medium">R$ {(item.price * item.qty).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
