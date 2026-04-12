"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, ShoppingBag, LogOut, ArrowRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dev.aiwhatsapp.com.br";

const STATUS_BADGE: Record<string, string> = {
    pending: "badge-yellow", paid: "badge-green",
    shipped: "badge-blue", cancelled: "badge-red",
};
const STATUS_LABEL: Record<string, string> = {
    pending: "Aguardando pagamento", paid: "Pago ✓",
    shipped: "Enviado 📦", cancelled: "Cancelado",
};

export default function AccountPage() {
    const [profile, setProfile] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { window.location.href = "/auth/login"; return; }

        Promise.all([
            fetch(`${API}/api/profiles/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
            fetch(`${API}/api/payments/my-orders`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        ]).then(([prof, ords]) => {
            setProfile(prof);
            setOrders(Array.isArray(ords) ? ords : []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    function logout() {
        localStorage.removeItem("token");
        window.location.href = "/";
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#050d1a" }}>
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen" style={{ background: "#050d1a" }}>
            <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-40" style={{ background: "rgba(5,13,26,0.8)" }}>
                <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-3">
                    <Link href="/" className="font-bold text-sm">
                        <span style={{ color: "white" }}>Bio</span>
                        <span className="gradient-text">Peptidios</span>
                    </Link>
                    <div className="flex-1" />
                    <button onClick={logout} className="flex items-center gap-1.5 text-xs" style={{ color: "#94a3b8" }}>
                        <LogOut className="w-3.5 h-3.5" /> Sair
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
                {/* Perfil */}
                <div className="glass-card p-6 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                        style={{ background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.25)" }}>
                        {profile?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                        <div className="font-semibold text-white">{profile?.name || "—"}</div>
                        <div className="text-sm mt-0.5" style={{ color: "#64748b" }}>{profile?.email}</div>
                        <div className="mt-1">
                            <span className="badge badge-blue text-[10px]">{profile?.plan || "free"}</span>
                        </div>
                    </div>
                </div>

                {/* Pedidos */}
                <div>
                    <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-brand-400" /> Meus Pedidos
                    </h2>

                    {orders.length === 0 ? (
                        <div className="glass-card flex flex-col items-center justify-center h-40" style={{ color: "#475569" }}>
                            <ShoppingBag className="w-8 h-8 mb-2 opacity-30" />
                            <p className="text-sm">Você ainda não fez nenhum pedido</p>
                            <Link href="/catalog" className="btn-primary mt-3 text-xs flex items-center gap-1">
                                Ver catálogo <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map(o => (
                                <div key={o.id} className="glass-card p-4 flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white">{o.product?.name || "Pedido"}</div>
                                        <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                                            #{o.id.slice(0, 8)} · {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                                        </div>
                                    </div>
                                    <div className="font-semibold" style={{ color: "#34d399" }}>
                                        {o.currency} {Number(o.amount).toFixed(2)}
                                    </div>
                                    <span className={`badge ${STATUS_BADGE[o.status] || "badge-gray"}`}>
                                        {STATUS_LABEL[o.status] || o.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
