"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CreditCard, ArrowRight, Loader2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

const EBOOK_PRICES: Record<string, number> = { basic: 9.90, premium: 29.90 };
const EBOOK_NAMES: Record<string, string> = {
    basic: "📘 Ebook — O Código Secreto dos Peptídeos",
    premium: "🚀 Plano Premium — Ebook + IA + Plataforma",
};

/* ── Máscaras puras em JS ──────────────────────────────────── */
function maskCPF(value: string) {
    return value
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
        return digits
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
}

function unmaskCPF(value: string) { return value.replace(/\D/g, ""); }
function unmaskPhone(value: string) { return value.replace(/\D/g, ""); }

function maskCardNumber(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}
function maskExpiry(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

function CheckoutInner() {
    const searchParams = useSearchParams();
    const planParam = searchParams.get("plan") || "";
    const emailParam = searchParams.get("email") || "";
    const nameParam = searchParams.get("name") || "";
    const whatsappParam = searchParams.get("whatsapp") || "";
    const productParam = searchParams.get("product") || "";
    const isEbookFlow = productParam === "ebook" && !!planParam;

    const [form, setForm] = useState({
        name: nameParam, email: emailParam, phone: whatsappParam, cpf: "", country: "BR",
    });
    const [phoneMasked, setPhoneMasked] = useState(whatsappParam ? maskPhone(whatsappParam) : "");
    const [cpfMasked, setCpfMasked] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pixData, setPixData] = useState<{ qrCode: string; qrCodeImg: string; amount: number; expiresAt: string } | null>(null);
    const [cardSuccess, setCardSuccess] = useState<{ amount: number; method: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'debit_card'>('pix');
    const [card, setCard] = useState({ number: '', holder: '', expiry: '', cvv: '', postalCode: '', addressNumber: '' });
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

    // Pré-preencher com dados do usuário logado (sem sobrescrever o que veio da URL)
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (userStr) {
            try {
                const u = JSON.parse(userStr);
                const phone = whatsappParam || u.phone || u.whatsapp || "";
                const cpf = u.cpfCnpj || u.cpf || "";
                setForm(p => ({
                    ...p,
                    name: u.name || u.displayName || p.name,
                    email: u.email || emailParam,
                    phone,
                    cpf,
                }));
                if (phone) setPhoneMasked(maskPhone(phone));
                if (cpf) setCpfMasked(maskCPF(cpf));
            } catch { }
        } else if (token) {
            fetch(`${API}/api/profiles/me`, { headers: { Authorization: `Bearer ${token}` } })
                .then(r => r.json())
                .then(data => {
                    const phone = whatsappParam || data.phone || data.whatsapp || "";
                    const cpf = data.cpfCnpj || data.cpf || "";
                    setForm(p => ({
                        ...p,
                        name: data.name || p.name,
                        email: data.email || p.email,
                        phone,
                        cpf,
                    }));
                    if (phone) setPhoneMasked(maskPhone(phone));
                    if (cpf) setCpfMasked(maskCPF(cpf));
                }).catch(() => { });
        } else if (whatsappParam) {
            // Sem usuário logado mas tem whatsapp da URL
            setPhoneMasked(maskPhone(whatsappParam));
        }
    }, [emailParam, whatsappParam]);

    function patch(k: string, v: string) { setForm(p => ({ ...p, [k]: v })); }

    function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
        const masked = maskPhone(e.target.value);
        setPhoneMasked(masked);
        patch("phone", unmaskPhone(masked));
    }

    function handleCPFChange(e: React.ChangeEvent<HTMLInputElement>) {
        const masked = maskCPF(e.target.value);
        setCpfMasked(masked);
        patch("cpf", unmaskCPF(masked));
    }

    function validate() {
        if (!form.name.trim()) { setError("Nome completo é obrigatório."); return false; }
        if (!form.email.trim()) { setError("E-mail é obrigatório."); return false; }
        if (form.cpf.length !== 11) { setError("CPF inválido. Informe os 11 dígitos."); return false; }
        if (form.phone.length < 10) { setError("Telefone inválido."); return false; }
        return true;
    }

    // ── Fluxo ebook ─────────────────────────────────────────
    async function checkoutEbook() {
        if (!validate()) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API}/api/checkout/ebook`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan: planParam,
                    email: form.email,
                    name: form.name,
                    cpfCnpj: form.cpf,
                    phone: form.phone,
                    paymentMethod,
                    ...(paymentMethod !== 'pix' ? {
                        cardNumber: card.number.replace(/\s/g, ''),
                        cardHolder: card.holder,
                        cardExpiryMonth: card.expiry.split('/')[0] || '',
                        cardExpiryYear: (() => { const y = card.expiry.split('/')[1] || ''; return y.length === 2 ? `20${y}` : y; })(),
                        cardCvv: card.cvv,
                        postalCode: card.postalCode.replace(/\D/g, ''),
                        addressNumber: card.addressNumber,
                    } : {}),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erro ao criar pedido");

            // Cartão: mostrar confirmação
            if (data.paymentMethod && data.paymentMethod !== 'pix') {
                setCardSuccess({ amount: data.amount, method: data.paymentMethod });
                return;
            }
            // PIX: SEMPRE exibir QR code inline — nunca redirecionar para Asaas
            if (data.pixQrCode) {
                setPixData({
                    qrCode: data.pixQrCode,
                    qrCodeImg: data.pixQrCodeUrl ? `data:image/png;base64,${data.pixQrCodeUrl}` : '',
                    amount: data.amount,
                    expiresAt: data.expiresAt,
                });
                return;
            }
            throw new Error("Não foi possível gerar o pagamento. Tente novamente.");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    function copyPix() {
        if (!pixData) return;
        navigator.clipboard.writeText(pixData.qrCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    }

    // ── Fluxo genérico (carrinho) ────────────────────────────
    const [cart, setCart] = useState<any[]>([]);
    useEffect(() => {
        if (!isEbookFlow) {
            const raw = localStorage.getItem("bp_cart");
            if (raw) setCart(JSON.parse(raw));
        }
    }, [isEbookFlow]);

    async function checkoutCart() {
        if (!validate()) return;
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
                    customerPhone: form.phone, cpfCnpj: form.cpf,
                    countryCode: form.country, currency, gateway, totalAmount: subtotal,
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

    const inputStyle: React.CSSProperties = {
        width: "100%", background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
        padding: "11px 14px", color: "#fff", fontSize: "14px", outline: "none",
        boxSizing: "border-box",
    };

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

            {/* ── Tela PIX ─────────────────────────────────────────────── */}
            {pixData ? (
                <div className="max-w-lg mx-auto px-6 py-14 text-center">
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "36px 28px" }}>
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>📲</div>
                        <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "20px", marginBottom: "6px" }}>Pague via PIX</h2>
                        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
                            Valor: <strong style={{ color: "#34d399" }}>R$ {pixData.amount.toFixed(2)}</strong> — Vence em {pixData.expiresAt}
                        </p>

                        {/* QR code imagem */}
                        {pixData.qrCodeImg ? (
                            <img src={pixData.qrCodeImg} alt="QR Code PIX" style={{ width: "200px", height: "200px", margin: "0 auto 20px", borderRadius: "12px", background: "#fff", padding: "8px" }} />
                        ) : (
                            <div style={{ width: "200px", height: "200px", margin: "0 auto 20px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: "13px" }}>
                                QR Code indisponível
                            </div>
                        )}

                        {/* Código copia-e-cola */}
                        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 14px", marginBottom: "14px", wordBreak: "break-all", color: "#94a3b8", fontSize: "11px", textAlign: "left", maxHeight: "80px", overflowY: "auto" }}>
                            {pixData.qrCode}
                        </div>
                        <button onClick={copyPix} style={{
                            width: "100%", background: copied ? "rgba(52,211,153,0.2)" : "linear-gradient(135deg,#5b8af5,#00e5cc)",
                            color: copied ? "#34d399" : "#fff", border: copied ? "1px solid #34d399" : "none",
                            borderRadius: "10px", padding: "13px", fontWeight: 800, cursor: "pointer", fontSize: "15px", marginBottom: "20px",
                        }}>
                            {copied ? "✅ Copiado!" : "📋 Copiar código PIX"}
                        </button>

                        <div style={{ background: "rgba(91,138,245,0.08)", border: "1px solid rgba(91,138,245,0.2)", borderRadius: "12px", padding: "16px", textAlign: "left" }}>
                            <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "13px", marginBottom: "8px" }}>🔓 Após o pagamento:</p>
                            <ol style={{ color: "#64748b", fontSize: "12px", paddingLeft: "16px", lineHeight: 1.8, margin: 0 }}>
                                <li>Aguarde a confirmação (geralmente instantânea)</li>
                                <li>Faça login com o e-mail <strong style={{ color: "#94a3b8" }}>{form.email}</strong></li>
                                <li>Acesse o reader com conteúdo completo</li>
                            </ol>
                        </div>

                        <Link href="/auth/login" style={{ display: "block", marginTop: "20px", color: "#5b8af5", fontSize: "13px", textDecoration: "none" }}>
                            Já paguei — fazer login →
                        </Link>
                    </div>
                </div>
            ) : cardSuccess ? (
                <div className="max-w-lg mx-auto px-6 py-14 text-center">
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "36px 28px" }}>
                        <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
                        <h2 style={{ color: "#fff", fontWeight: 800, fontSize: "20px", marginBottom: "8px" }}>Pagamento aprovado!</h2>
                        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
                            {cardSuccess.method === 'debit_card' ? '💳 Débito' : '💳 Crédito'} — <strong style={{ color: "#34d399" }}>R$ {cardSuccess.amount.toFixed(2)}</strong>
                        </p>
                        <div style={{ background: "rgba(91,138,245,0.08)", border: "1px solid rgba(91,138,245,0.2)", borderRadius: "12px", padding: "16px", textAlign: "left", marginBottom: "20px" }}>
                            <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "13px", marginBottom: "8px" }}>🔓 Próximos passos:</p>
                            <ol style={{ color: "#64748b", fontSize: "12px", paddingLeft: "16px", lineHeight: 1.8, margin: 0 }}>
                                <li>Faça login com <strong style={{ color: "#94a3b8" }}>{form.email}</strong></li>
                                <li>Acesse o reader com conteúdo completo</li>
                            </ol>
                        </div>
                        <Link href="/auth/login" style={{ display: "block", background: "linear-gradient(135deg,#5b8af5,#00e5cc)", color: "#fff", borderRadius: "10px", padding: "13px", fontWeight: 800, textDecoration: "none" }}>
                            Fazer login →
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto px-6 py-10">
                    <div className="grid md:grid-cols-5 gap-8">
                        {/* Formulário */}
                        <div className="md:col-span-3 space-y-5">
                            <div className="glass-card p-6 space-y-4">
                                {isEbookFlow && (
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                                        <div style={{ flex: 1, height: '3px', borderRadius: '2px', background: 'rgba(91,138,245,0.4)' }} />
                                        <div style={{ flex: 1, height: '3px', borderRadius: '2px', background: 'linear-gradient(90deg,#5b8af5,#00e5cc)' }} />
                                    </div>
                                )}
                                <h2 className="font-semibold text-white text-sm">
                                    {isEbookFlow ? 'Etapa 2 de 2 — Finalizar pagamento' : 'Dados do cliente'}
                                </h2>
                                {isEbookFlow && whatsappParam && (
                                    <div style={{ background: 'rgba(0,229,204,0.07)', border: '1px solid rgba(0,229,204,0.2)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <span>✅ <strong style={{ color: '#94a3b8' }}>{form.name}</strong> — {form.email}</span>
                                        <span>📱 WhatsApp: <strong style={{ color: '#94a3b8' }}>{phoneMasked}</strong></span>
                                    </div>
                                )}

                                {error && (
                                    <div className="px-4 py-3 rounded-xl text-sm"
                                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                                        {error}
                                    </div>
                                )}

                                {/* Nome + Email */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>Nome completo *</label>
                                        <input
                                            style={inputStyle}
                                            value={form.name}
                                            onChange={e => patch("name", e.target.value)}
                                            placeholder="João Silva"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>E-mail *</label>
                                        <input
                                            type="email"
                                            style={inputStyle}
                                            value={form.email}
                                            onChange={e => patch("email", e.target.value)}
                                            placeholder="joao@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* CPF + Telefone */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>CPF *</label>
                                        <input
                                            style={inputStyle}
                                            value={cpfMasked}
                                            onChange={handleCPFChange}
                                            placeholder="000.000.000-00"
                                            inputMode="numeric"
                                            maxLength={14}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>Telefone / WhatsApp *</label>
                                        <input
                                            style={inputStyle}
                                            value={phoneMasked}
                                            onChange={handlePhoneChange}
                                            placeholder="(00) 00000-0000"
                                            inputMode="numeric"
                                            maxLength={15}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* ── Método de pagamento ──────────────────────── */}
                                {isEbookFlow && (
                                    <div>
                                        <label className="text-xs block mb-2" style={{ color: "#64748b" }}>Forma de pagamento</label>
                                        <div className="grid grid-cols-3 gap-2" style={{ marginBottom: "16px" }}>
                                            {([
                                                { key: 'pix', label: '⚡ PIX', sub: 'Instântaneo' },
                                                { key: 'credit_card', label: '💳 Crédito', sub: 'À vista' },
                                                { key: 'debit_card', label: '🏦 Débito', sub: 'À vista' },
                                            ] as const).map(opt => (
                                                <button key={opt.key} type="button" onClick={() => setPaymentMethod(opt.key)}
                                                    style={{
                                                        padding: "10px 8px", borderRadius: "10px", cursor: "pointer", transition: "all .2s",
                                                        background: paymentMethod === opt.key ? "rgba(91,138,245,0.15)" : "rgba(255,255,255,0.03)",
                                                        border: paymentMethod === opt.key ? "1px solid #5b8af5" : "1px solid rgba(255,255,255,0.08)",
                                                        color: paymentMethod === opt.key ? "#e2e8f0" : "#64748b",
                                                        fontWeight: 700, fontSize: "12px", textAlign: "center",
                                                    }}>
                                                    <div>{opt.label}</div>
                                                    <div style={{ fontSize: "10px", fontWeight: 400, opacity: .7 }}>{opt.sub}</div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Campos do cartão */}
                                        {paymentMethod !== 'pix' && (
                                            <div className="space-y-3" style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                                                <div>
                                                    <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>Número do cartão *</label>
                                                    <input style={inputStyle} value={card.number}
                                                        onChange={e => setCard(c => ({ ...c, number: maskCardNumber(e.target.value) }))}
                                                        placeholder="0000 0000 0000 0000" inputMode="numeric" maxLength={19} />
                                                </div>
                                                <div>
                                                    <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>Nome no cartão *</label>
                                                    <input style={inputStyle} value={card.holder}
                                                        onChange={e => setCard(c => ({ ...c, holder: e.target.value.toUpperCase() }))}
                                                        placeholder="NOME COMO NO CARTÃO" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>Validade *</label>
                                                        <input style={inputStyle} value={card.expiry}
                                                            onChange={e => setCard(c => ({ ...c, expiry: maskExpiry(e.target.value) }))}
                                                            placeholder="MM/AA" inputMode="numeric" maxLength={5} />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>CVV *</label>
                                                        <input style={inputStyle} value={card.cvv}
                                                            onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                                                            placeholder="123" inputMode="numeric" maxLength={4} />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>CEP</label>
                                                        <input style={inputStyle} value={card.postalCode}
                                                            onChange={e => setCard(c => ({ ...c, postalCode: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                                                            placeholder="00000-000" inputMode="numeric" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>Nº / Compl.</label>
                                                        <input style={inputStyle} value={card.addressNumber}
                                                            onChange={e => setCard(c => ({ ...c, addressNumber: e.target.value }))}
                                                            placeholder="Ex: 42 / Apto 3" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* País */}
                                <div>
                                    <label className="text-xs block mb-1.5" style={{ color: "#64748b" }}>País</label>
                                    <select style={inputStyle} value={form.country} onChange={e => patch("country", e.target.value)}>
                                        <option value="BR">🇧🇷 Brasil (PIX)</option>
                                        <option value="US">🇺🇸 Estados Unidos</option>
                                        <option value="PT">🇵🇹 Portugal</option>
                                        <option value="AR">🇦🇷 Argentina</option>
                                        <option value="MX">🇲🇽 México</option>
                                        <option value="OTHER">🌍 Outro</option>
                                    </select>
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
            )}
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
