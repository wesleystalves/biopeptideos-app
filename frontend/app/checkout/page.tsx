"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CreditCard, ArrowRight, Loader2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

const EBOOK_PRICES: Record<string, number> = {
    basic: 9.90,
    premium: 29.90,
};
const EBOOK_NAMES: Record<string, string> = {
    basic: "📘 Ebook — O Código Secreto dos Peptídeos",
    premium: "🚀 Plano Premium — Ebook + IA + Plataforma",
};

function CheckoutInner() {
    const searchParams = useSearchParams();
    const planParam = searchParams.get("plan") || "";
    const emailParam = searchParams.get("email") || "";
    const productParam = searchParams.get("product") || "";
    const isEbookFlow = productParam === "ebook" && !!planParam;

    const [form, setForm] = useState({
        name: "", email: emailParam, phone: "", country: "BR", address: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [prices, setPrices] = useState<Record<string, number>>(EBOOK_PRICES);

    // Carregar preços editáveis do backend
    useEffect(() => {
        fetch(`${API}/api/checkout/ebook/prices`)
            .then(r => r.json())
            .then(data => {
                if (data?.basic?.price && data?.premium?.price) {
                    setPrices({ basic: data.basic.price, premium: data.premium.price });
                }
            })
            .catch(() => { });
    }, []);

    // Pré-preencher com dados do usuário logado
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const u = JSON.parse(userStr);
                setForm(p => ({
                    ...p,
                    name: u.name || u.displayName || p.name,
                    email: u.email || emailParam,
                    phone: u.phone || p.phone,
                }));
            } catch { }
        }
        if (token && !userStr) {
            fetch(`${API}/api/profiles/me`, { headers: { Authorization: `Bearer ${token}` } })
                .then(r => r.json())
                .then(data => {
                    setForm(p => ({
                        ...p,
                        name: data.name || p.name,
                        email: data.email || p.email,
                        phone: data.phone || p.phone,
                    }));
                }).catch(() => { });
        }
    }, [emailParam]);

    function patch(k: string, v: string) { setForm(p => ({ ...p, [k]: v })); }

    // ── Fluxo ebook: chama POST /api/checkout/ebook diretamente ──────
    async function checkoutEbook() {
        if (!form.email) { setError("Informe seu email."); return; }
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API}/api/checkout/ebook`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan: planParam,
                    email: form.email,
                    name: form.name || form.email.split("@")[0],
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erro ao criar pedido");
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error("Link de pagamento não retornado");
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    // ── Fluxo genérico (carrinho) ─────────────────────────────────────
    const [cart, setCart] = useState<any[]>([]);
    useEffect(() => {
        if (!isEbookFlow) {
            const raw = localStorage.getItem("bp_cart");
            if (raw) setCart(JSON.parse(raw));
        }
    }, [isEbookFlow]);

    async function checkoutCart() {
        if (!form.name || !form.email) { setError("Nome e email são obrigatórios."); return; }
        if (cart.length === 0) { setError("Carrinho vazio."); return; }
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token") || "";
        const currency = form.country === "BR" ? "BRL" : (cart[0]?.currency || "USD");
        const gateway = form.country === "BR" ? "asaas" : "stripe";
        const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
        try {
            const res = await fetch(`${API}/api/payments/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    items: cart, customerName: form.name, customerEmail: form.email,
                    customerPhone: form.phone, countryCode: form.country,
                    currency, gateway, totalAmount: subtotal,
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

    const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const ebookPrice = prices[planParam] ?? EBOOK_PRICES[planParam] ?? 0;
    const currency = form.country === "BR" ? "BRL" : "USD";
    const gateway = form.country === "BR" ? "asaas" : "stripe";

    return (
        <div className="min-h-screen" style={{ background: "#050d1a" }}>
            <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-40" style={{ background: "rgba(5,13,26,0.8)" }}>
                <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
                    <Link href={isEbookFlow ? "/ebook" : "/cart"} className="text-sm" style={{ color: "#94a3b8" }}>
                        ← {isEbookFlow ? "Voltar" : "Carrinho"}
                    </Link>
                    <div className="flex-1 text-center font-semibold text-white text-sm">Checkout</div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="grid md:grid-cols-5 gap-8">
                    {/* Formulário */}
                    <div className="md:col-span-3 space-y-5">
                        <div className="glass-card p-6 space-y-4">
                            <h2 className="font-semibold text-white text-sm">Dados do cliente</h2>
                            {error && (
                                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                                    {error}
                                </div>
                            )}
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
                                        <option value="BR">🇧🇷 Brasil (PIX)</option>
                                        <option value="US">🇺🇸 Estados Unidos</option>
                                        <option value="PT">🇵🇹 Portugal</option>
                                        <option value="AR">🇦🇷 Argentina</option>
                                        <option value="MX">🇲🇽 México</option>
                                        <option value="OTHER">🌍 Outro</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Gateway info */}
                        <div className="glass-card p-4 flex items-center gap-3" style={{ border: "1px solid rgba(14,165,233,0.15)" }}>
                            <CreditCard className="w-5 h-5 shrink-0" style={{ color: "#0ea5e9" }} />
                            <div>
                                <div className="text-sm font-medium text-white">
                                    {gateway === "asaas" ? "PIX + Boleto + Cartão (Asaas)" : "Cartão de Crédito (Stripe)"}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                                    {gateway === "asaas"
                                        ? "Escolha PIX, Boleto ou Cartão na próxima página"
                                        : "Cartão de crédito internacional — processado pelo Stripe"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resumo */}
                    <div className="md:col-span-2">
                        <div className="glass-card p-5 sticky top-20 space-y-4">
                            <h2 className="font-semibold text-white">Resumo do pedido</h2>

                            {isEbookFlow ? (
                                <div className="flex justify-between text-sm">
                                    <span style={{ color: "#94a3b8" }}>{EBOOK_NAMES[planParam] || "Ebook"}</span>
                                    <span className="text-white">{currency} {ebookPrice.toFixed(2)}</span>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span style={{ color: "#94a3b8" }}>{item.name} × {item.qty}</span>
                                        <span className="text-white">{currency} {(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))
                            )}

                            <div className="section-divider" />
                            <div className="flex justify-between font-bold">
                                <span className="text-white">Total</span>
                                <span style={{ color: "#34d399" }}>
                                    {currency} {isEbookFlow ? ebookPrice.toFixed(2) : cartSubtotal.toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={isEbookFlow ? checkoutEbook : checkoutCart}
                                disabled={loading || (!isEbookFlow && cart.length === 0)}
                                className="btn-success w-full justify-center flex items-center gap-2 py-3"
                            >
                                {loading
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <>Pagar agora <ArrowRight className="w-4 h-4" /></>}
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

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#050d1a" }}>
                <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
        }>
            <CheckoutInner />
        </Suspense>
    );
}
