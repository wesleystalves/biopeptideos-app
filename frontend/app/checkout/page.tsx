"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, CreditCard, ArrowRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dw.peptideosbio.com";

export default function CheckoutPage() {
    const [cart, setCart] = useState<any[]>([]);
    const [form, setForm] = useState({ name: "", email: "", phone: "", country: "BR", address: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const raw = localStorage.getItem("bp_cart");
        if (raw) setCart(JSON.parse(raw));
        const token = localStorage.getItem("token");
        if (token) {
            // Pre-fill com dados do usuário logado
            fetch(`${API}/api/profiles/me`, { headers: { Authorization: `Bearer ${token}` } })
                .then(r => r.json())
                .then(data => {
                    setForm(p => ({
                        ...p,
                        name: data.name || p.name,
                        email: data.email || p.email,
                        phone: data.phone || p.phone,
                        country: data.countryCode || p.country,
                    }));
                }).catch(() => { });
        }
    }, []);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const currency = form.country === "BR" ? "BRL" : (cart[0]?.currency || "USD");
    const gateway = form.country === "BR" ? "asaas" : "stripe";

    async function checkout() {
        if (!form.name || !form.email) { setError("Nome e email são obrigatórios."); return; }
        if (cart.length === 0) { setError("Carrinho vazio."); return; }
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token") || "";

        try {
            const res = await fetch(`${API}/api/payments/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    items: cart,
                    customerName: form.name,
                    customerEmail: form.email,
                    customerPhone: form.phone,
                    countryCode: form.country,
                    currency,
                    gateway,
                    totalAmount: subtotal,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Erro ao criar pedido");
            }

            const data = await res.json();
            localStorage.removeItem("bp_cart");

            if (data.paymentUrl || data.url) {
                window.location.href = data.paymentUrl || data.url;
            } else {
                window.location.href = `/checkout/success?order=${data.orderId}`;
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    function patch(k: string, v: string) { setForm(p => ({ ...p, [k]: v })); }

    return (
        <div className="min-h-screen" style={{ background: "#050d1a" }}>
            <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-40" style={{ background: "rgba(5,13,26,0.8)" }}>
                <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
                    <Link href="/cart" className="text-sm" style={{ color: "#94a3b8" }}>← Carrinho</Link>
                    <div className="flex-1 text-center font-semibold text-white text-sm">Checkout</div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="grid md:grid-cols-5 gap-8">
                    {/* Formulário */}
                    <div className="md:col-span-3 space-y-5">
                        <div className="glass-card p-6 space-y-4">
                            <h2 className="font-semibold text-white text-sm">Dados do cliente</h2>
                            {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>{error}</div>}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>Nome completo *</label>
                                    <input className="input" value={form.name} onChange={e => patch("name", e.target.value)} placeholder="João Silva" />
                                </div>
                                <div>
                                    <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>Email *</label>
                                    <input type="email" className="input" value={form.email} onChange={e => patch("email", e.target.value)} placeholder="joao@email.com" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>Telefone / WhatsApp</label>
                                    <input className="input" value={form.phone} onChange={e => patch("phone", e.target.value)} placeholder="+55 11 99999-9999" />
                                </div>
                                <div>
                                    <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>País</label>
                                    <select className="input" value={form.country} onChange={e => patch("country", e.target.value)}>
                                        <option value="BR" className="bg-dark-900">🇧🇷 Brasil (PIX)</option>
                                        <option value="US" className="bg-dark-900">🇺🇸 Estados Unidos</option>
                                        <option value="PT" className="bg-dark-900">🇵🇹 Portugal</option>
                                        <option value="AR" className="bg-dark-900">🇦🇷 Argentina</option>
                                        <option value="MX" className="bg-dark-900">🇲🇽 México</option>
                                        <option value="OTHER" className="bg-dark-900">🌍 Outro</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Gateway info */}
                        <div className="glass-card p-4 flex items-center gap-3"
                            style={{ border: "1px solid rgba(14,165,233,0.15)" }}>
                            <CreditCard className="w-5 h-5 shrink-0" style={{ color: "#0ea5e9" }} />
                            <div>
                                <div className="text-sm font-medium text-white">
                                    {gateway === "asaas" ? "PIX + Boleto (Asaas)" : "Cartão de Crédito (Stripe)"}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                                    {gateway === "asaas"
                                        ? "Pagamento instantâneo via PIX — confirmação em segundos"
                                        : "Cartão de crédito internacional — processado pelo Stripe"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumo */}
                    <div className="md:col-span-2">
                        <div className="glass-card p-5 sticky top-20 space-y-4">
                            <h2 className="font-semibold text-white">Resumo do pedido</h2>
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span style={{ color: "#94a3b8" }}>{item.name} × {item.qty}</span>
                                    <span className="text-white">{currency} {(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="section-divider" />
                            <div className="flex justify-between font-bold">
                                <span className="text-white">Total</span>
                                <span style={{ color: "#34d399" }}>{currency} {subtotal.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={checkout}
                                disabled={loading || cart.length === 0}
                                className="btn-success w-full justify-center flex items-center gap-2 py-3"
                            >
                                {loading
                                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : <> Pagar agora <ArrowRight className="w-4 h-4" /> </>}
                            </button>

                            <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: "#475569" }}>
                                <ShieldCheck className="w-3.5 h-3.5" /> Pagamento 100% seguro
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
