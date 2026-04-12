"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from "lucide-react";

export default function CartPage() {
    const [cart, setCart] = useState<any[]>([]);

    function loadCart() {
        const raw = localStorage.getItem("bp_cart");
        setCart(raw ? JSON.parse(raw) : []);
    }

    useEffect(() => { loadCart(); }, []);

    function updateQty(id: string, delta: number) {
        const updated = cart.map(item =>
            item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        );
        setCart(updated);
        localStorage.setItem("bp_cart", JSON.stringify(updated));
    }

    function remove(id: string) {
        const updated = cart.filter(item => item.id !== id);
        setCart(updated);
        localStorage.setItem("bp_cart", JSON.stringify(updated));
    }

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const currency = cart[0]?.currency || "USD";

    return (
        <div className="min-h-screen" style={{ background: "#050d1a" }}>
            <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-40" style={{ background: "rgba(5,13,26,0.8)" }}>
                <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-3">
                    <Link href="/catalog" className="text-sm" style={{ color: "#94a3b8" }}>← Continuar comprando</Link>
                    <div className="flex-1" />
                    <ShoppingCart className="w-5 h-5" style={{ color: "#0ea5e9" }} />
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold text-white mb-8">Carrinho</h1>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64" style={{ color: "#475569" }}>
                        <Package className="w-12 h-12 mb-3 opacity-30" />
                        <p className="text-sm">Seu carrinho está vazio</p>
                        <Link href="/catalog" className="btn-primary mt-4 text-sm">Ver Catálogo</Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Items */}
                        <div className="md:col-span-2 space-y-3">
                            {cart.map(item => (
                                <div key={item.id} className="glass-card p-4 flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.15)" }}>
                                        <Package className="w-7 h-7" style={{ color: "rgba(14,165,233,0.4)" }} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-white text-sm">{item.name}</div>
                                        <div className="text-xs mt-0.5" style={{ color: "#34d399" }}>
                                            {item.currency} {Number(item.price).toFixed(2)} / unidade
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors border border-white/10">
                                            <Minus className="w-3 h-3 text-white" />
                                        </button>
                                        <span className="text-white font-medium w-6 text-center">{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors border border-white/10">
                                            <Plus className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                    <div className="font-semibold text-white w-20 text-right">
                                        {currency} {(item.price * item.qty).toFixed(2)}
                                    </div>
                                    <button onClick={() => remove(item.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Resumo */}
                        <div className="glass-card p-5 h-fit space-y-4">
                            <h2 className="font-semibold text-white">Resumo</h2>
                            <div className="section-divider" />
                            <div className="flex justify-between text-sm" style={{ color: "#94a3b8" }}>
                                <span>Subtotal ({cart.reduce((a, i) => a + i.qty, 0)} itens)</span>
                                <span className="font-semibold text-white">{currency} {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs" style={{ color: "#64748b" }}>
                                <span>Frete</span>
                                <span>Calculado no checkout</span>
                            </div>
                            <div className="section-divider" />
                            <div className="flex justify-between font-bold">
                                <span className="text-white">Total</span>
                                <span style={{ color: "#34d399" }}>{currency} {subtotal.toFixed(2)}</span>
                            </div>
                            <Link href="/checkout" className="btn-primary w-full justify-center flex items-center gap-2 py-3">
                                Finalizar Compra <ArrowRight className="w-4 h-4" />
                            </Link>
                            <p className="text-center text-xs" style={{ color: "#475569" }}>Pagamento seguro via Stripe ou PIX</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
