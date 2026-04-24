"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, Tag, X } from "lucide-react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

type CartItem = { id: string; qty: number; product: { id: string; name: string; price: number; imageUrl?: string; category: string } };

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState<{ code: string; discountApplied: number; finalAmount: number } | null>(null);
    const [couponError, setCouponError] = useState("");
    const [validating, setValidating] = useState(false);
    const router = useRouter();

    const token = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

    async function loadCart() {
        if (!token()) { router.push("/auth/login"); return; }
        setLoading(true);
        const r = await fetch(`${API}/api/ecommerce/cart`, { headers: headers() });
        if (r.ok) { const d = await r.json(); setItems(d.items || []); }
        setLoading(false);
    }

    useEffect(() => { loadCart(); }, []);

    async function updateQty(itemId: string, qty: number) {
        if (qty < 1) { removeItem(itemId); return; }
        await fetch(`${API}/api/ecommerce/cart/${itemId}`, { method: "PUT", headers: headers(), body: JSON.stringify({ qty }) });
        loadCart();
    }

    async function removeItem(itemId: string) {
        await fetch(`${API}/api/ecommerce/cart/${itemId}`, { method: "DELETE", headers: headers() });
        setDiscount(null);
        loadCart();
    }

    async function validateCoupon() {
        if (!coupon.trim()) return;
        setValidating(true);
        setCouponError("");
        try {
            const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
            const r = await fetch(`${API}/coupons/validate`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: coupon.trim(), plan: "product", amount: subtotal }),
            });
            if (r.ok) {
                const d = await r.json();
                setDiscount({ code: coupon.trim().toUpperCase(), discountApplied: d.discountApplied, finalAmount: d.finalAmount });
            } else {
                const e = await r.json();
                setCouponError(e.message || "Cupom inválido");
            }
        } finally { setValidating(false); }
    }

    const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
    const finalTotal = discount ? discount.finalAmount : subtotal;
    const totalItems = items.reduce((s, i) => s + i.qty, 0);

    if (loading) return (
        <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050d1a] text-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <ShoppingCart className="w-7 h-7 text-brand-400" />
                    Meu Carrinho
                    {totalItems > 0 && <span className="text-sm font-normal text-slate-400">({totalItems} {totalItems === 1 ? "item" : "itens"})</span>}
                </h1>

                {items.length === 0 ? (
                    <div className="glass-card p-16 text-center space-y-4">
                        <Package className="w-16 h-16 text-slate-600 mx-auto" />
                        <h2 className="text-xl font-semibold text-slate-300">Carrinho vazio</h2>
                        <p className="text-slate-500">Adicione produtos do catálogo para continuar</p>
                        <a href="/catalog" className="btn-primary inline-flex items-center gap-2 mt-2">Ver Catálogo <ArrowRight className="w-4 h-4" /></a>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Items */}
                        <div className="lg:col-span-2 space-y-3">
                            {items.map(item => (
                                <div key={item.id} className="glass-card p-4 flex items-center gap-4">
                                    {item.product.imageUrl
                                        ? <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-white/5 shrink-0" />
                                        : <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center shrink-0"><Package className="w-6 h-6 text-slate-500" /></div>}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] text-brand-400 uppercase tracking-wider">{item.product.category}</div>
                                        <div className="font-semibold text-white truncate">{item.product.name}</div>
                                        <div className="text-sm text-slate-400 mt-0.5">R$ {item.product.price.toFixed(2)} / unid.</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"><Minus className="w-3 h-3" /></button>
                                        <span className="w-8 text-center text-sm font-bold text-white">{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"><Plus className="w-3 h-3" /></button>
                                    </div>
                                    <div className="text-right w-20 shrink-0">
                                        <div className="font-bold text-white">R$ {(item.product.price * item.qty).toFixed(2)}</div>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1.5"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="space-y-4">
                            {/* Coupon */}
                            <div className="glass-card p-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-white"><Tag className="w-4 h-4 text-brand-400" /> Cupom de desconto</div>
                                {discount ? (
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <div>
                                            <div className="font-mono text-sm font-bold text-emerald-300">{discount.code}</div>
                                            <div className="text-xs text-emerald-400">-R$ {discount.discountApplied.toFixed(2)}</div>
                                        </div>
                                        <button onClick={() => { setDiscount(null); setCoupon(""); }} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input className="flex-1 glass-card px-3 py-2 text-sm text-white uppercase placeholder-slate-500" placeholder="CUPOM15" value={coupon} onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); }} onKeyDown={e => e.key === "Enter" && validateCoupon()} />
                                        <button onClick={validateCoupon} disabled={validating || !coupon.trim()} className="px-3 py-2 rounded-xl bg-brand-600 text-white text-sm hover:bg-brand-500 disabled:opacity-50 transition-colors">{validating ? "..." : "OK"}</button>
                                    </div>
                                )}
                                {couponError && <p className="text-xs text-red-400">{couponError}</p>}
                            </div>

                            {/* Order Summary */}
                            <div className="glass-card p-4 space-y-3">
                                <div className="text-sm font-semibold text-white mb-2">Resumo do Pedido</div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
                                    {discount && <div className="flex justify-between text-emerald-400"><span>Desconto ({discount.code})</span><span>-R$ {discount.discountApplied.toFixed(2)}</span></div>}
                                    <div className="flex justify-between text-slate-400"><span>Frete</span><span className="text-emerald-400">A calcular</span></div>
                                    <div className="flex justify-between font-bold text-white text-base border-t border-white/10 pt-2"><span>Total</span><span>R$ {finalTotal.toFixed(2)}</span></div>
                                </div>
                                <button onClick={() => router.push(`/checkout${discount ? `?coupon=${discount.code}` : ""}`)} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                                    Finalizar Pedido <ArrowRight className="w-4 h-4" />
                                </button>
                                <a href="/catalog" className="block text-center text-xs text-slate-500 hover:text-slate-300 mt-1">Continuar comprando</a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
