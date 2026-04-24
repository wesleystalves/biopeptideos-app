"use client";

import { useEffect, useState, useCallback } from "react";
import { MapPin, CreditCard, Loader2, CheckCircle, Plus, QrCode, Copy, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

type Address = { id: string; label?: string; recipientName: string; street: string; number: string; complement?: string; neighborhood: string; city: string; state: string; cep: string; isDefault: boolean };
type CartItem = { id: string; qty: number; product: { id: string; name: string; price: number } };

const STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const couponParam = searchParams.get("coupon") || "";

    const [step, setStep] = useState<"address" | "payment" | "pix" | "success">("address");
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card">("pix");
    const [processing, setProcessing] = useState(false);
    const [pixData, setPixData] = useState<{ pixQr?: string; pixCode?: string; orderId: string } | null>(null);
    const [copied, setCopied] = useState(false);

    // New address form
    const [addrForm, setAddrForm] = useState({ recipientName: "", label: "", phone: "", cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", isDefault: false });
    const [cepLoading, setCepLoading] = useState(false);

    const token = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

    const loadData = useCallback(async () => {
        const [addrRes, cartRes] = await Promise.all([
            fetch(`${API}/api/ecommerce/addresses`, { headers: headers() }),
            fetch(`${API}/api/ecommerce/cart`, { headers: headers() }),
        ]);
        if (addrRes.ok) { const d = await addrRes.json(); setAddresses(d); setSelectedAddressId(d.find((a: Address) => a.isDefault)?.id || d[0]?.id || ""); }
        if (cartRes.ok) { const d = await cartRes.json(); setCartItems(d.items || []); }
    }, []);

    useEffect(() => { if (!token()) { router.push("/auth/login"); return; } loadData(); }, []);

    async function lookupCEP(cep: string) {
        const digits = cep.replace(/\D/g, "");
        if (digits.length !== 8) return;
        setCepLoading(true);
        try {
            const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
            const d = await r.json();
            if (!d.erro) setAddrForm(f => ({ ...f, street: d.logradouro, neighborhood: d.bairro, city: d.localidade, state: d.uf }));
        } finally { setCepLoading(false); }
    }

    async function saveAddress() {
        const r = await fetch(`${API}/api/ecommerce/addresses`, { method: "POST", headers: headers(), body: JSON.stringify({ ...addrForm, cep: addrForm.cep.replace(/\D/g, "") }) });
        if (r.ok) { const a = await r.json(); setAddresses(prev => [...prev, a]); setSelectedAddressId(a.id); setShowAddAddress(false); }
    }

    const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);

    async function placeOrder() {
        setProcessing(true);
        try {
            const body: any = { paymentMethod, couponCode: couponParam || undefined, addressId: selectedAddressId || undefined };
            const r = await fetch(`${API}/api/ecommerce/checkout`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
            const d = await r.json();
            if (!r.ok) throw new Error(d.message || "Erro no pagamento");
            if (paymentMethod === "pix") {
                setPixData({ pixQr: d.pixQr, pixCode: d.pixCode, orderId: d.order?.id });
                setStep("pix");
            } else {
                setStep("success");
            }
        } catch (err: any) {
            alert(err.message);
        } finally { setProcessing(false); }
    }

    function copyPixCode() {
        if (pixData?.pixCode) { navigator.clipboard.writeText(pixData.pixCode); setCopied(true); setTimeout(() => setCopied(false), 3000); }
    }

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);

    if (step === "success") return (
        <div className="min-h-screen bg-[#050d1a] flex items-center justify-center p-4">
            <div className="glass-card p-12 text-center max-w-md space-y-4">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
                <h2 className="text-2xl font-bold text-white">Pagamento Confirmado!</h2>
                <p className="text-slate-400">Seu pedido foi realizado com sucesso. Você receberá um email de confirmação.</p>
                <div className="flex gap-3 mt-4">
                    <button onClick={() => router.push("/conta/pedidos")} className="flex-1 py-3 rounded-xl text-sm border border-white/10 text-slate-300 hover:bg-white/5">Ver Pedidos</button>
                    <button onClick={() => router.push("/catalog")} className="flex-1 btn-primary">Continuar Comprando</button>
                </div>
            </div>
        </div>
    );

    if (step === "pix" && pixData) return (
        <div className="min-h-screen bg-[#050d1a] flex items-center justify-center p-4">
            <div className="glass-card p-8 text-center max-w-md space-y-6 w-full">
                <QrCode className="w-8 h-8 text-brand-400 mx-auto" />
                <h2 className="text-xl font-bold text-white">Pague via PIX</h2>
                <p className="text-slate-400 text-sm">Escaneie o QR code ou copie o código PIX</p>
                {pixData.pixQr && <img src={`data:image/png;base64,${pixData.pixQr}`} alt="QR Code PIX" className="w-48 h-48 mx-auto rounded-xl bg-white p-2" />}
                <button onClick={copyPixCode} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${copied ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "glass-card text-slate-300 hover:bg-white/5"}`}>
                    {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar Código PIX</>}
                </button>
                <p className="text-xs text-slate-500">Após o pagamento, seu pedido será confirmado automaticamente via webhook.</p>
                <button onClick={() => setStep("success")} className="text-xs text-slate-500 hover:text-slate-300">Já paguei →</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050d1a] text-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Step 1: Address */}
                        <div className="glass-card p-6 space-y-4">
                            <div className="flex items-center gap-2 text-white font-semibold"><MapPin className="w-5 h-5 text-brand-400" /> Endereço de Entrega</div>
                            {addresses.length === 0 && !showAddAddress && (
                                <button onClick={() => setShowAddAddress(true)} className="btn-primary w-full flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Cadastrar Endereço</button>
                            )}
                            {addresses.length > 0 && (
                                <div className="space-y-2">
                                    {addresses.map(a => (
                                        <label key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedAddressId === a.id ? "border-brand-500 bg-brand-500/10" : "border-white/10 hover:border-white/20"}`}>
                                            <input type="radio" name="address" value={a.id} checked={selectedAddressId === a.id} onChange={() => setSelectedAddressId(a.id)} className="mt-1 accent-brand-400" />
                                            <div>
                                                {a.label && <div className="text-xs font-bold text-brand-400 mb-0.5">{a.label}</div>}
                                                <div className="text-sm text-white font-medium">{a.recipientName}</div>
                                                <div className="text-xs text-slate-400">{a.street}, {a.number}{a.complement ? ` - ${a.complement}` : ""}</div>
                                                <div className="text-xs text-slate-400">{a.neighborhood} — {a.city}/{a.state} — CEP {a.cep}</div>
                                            </div>
                                        </label>
                                    ))}
                                    <button onClick={() => setShowAddAddress(!showAddAddress)} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"><Plus className="w-3 h-3" /> Adicionar novo endereço</button>
                                </div>
                            )}

                            {/* Add Address Form */}
                            {showAddAddress && (
                                <div className="border border-white/10 rounded-xl p-4 space-y-3 mt-2 bg-white/2">
                                    <div className="text-sm font-medium text-white mb-2">Novo Endereço</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2"><label className="text-xs text-slate-400 mb-1 block">Nome do Destinatário *</label><input className="glass-card w-full p-2.5 text-white text-sm" placeholder="João Silva" value={addrForm.recipientName} onChange={e => setAddrForm(f => ({ ...f, recipientName: e.target.value }))} /></div>
                                        <div><label className="text-xs text-slate-400 mb-1 block">CEP *</label>
                                            <div className="relative"><input className="glass-card w-full p-2.5 text-white text-sm pr-8" placeholder="00000-000" value={addrForm.cep} onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"); setAddrForm(f => ({ ...f, cep: v })); if (v.replace(/\D/g, "").length === 8) lookupCEP(v); }} />
                                                {cepLoading && <Loader2 className="absolute right-2 top-3 w-4 h-4 text-slate-400 animate-spin" />}</div>
                                        </div>
                                        <div><label className="text-xs text-slate-400 mb-1 block">Número *</label><input className="glass-card w-full p-2.5 text-white text-sm" placeholder="42" value={addrForm.number} onChange={e => setAddrForm(f => ({ ...f, number: e.target.value }))} /></div>
                                        <div className="col-span-2"><label className="text-xs text-slate-400 mb-1 block">Rua</label><input className="glass-card w-full p-2.5 text-white text-sm" placeholder="Autopreenchido pelo CEP" value={addrForm.street} onChange={e => setAddrForm(f => ({ ...f, street: e.target.value }))} /></div>
                                        <div><label className="text-xs text-slate-400 mb-1 block">Complemento</label><input className="glass-card w-full p-2.5 text-white text-sm" placeholder="Ap. 12" value={addrForm.complement} onChange={e => setAddrForm(f => ({ ...f, complement: e.target.value }))} /></div>
                                        <div><label className="text-xs text-slate-400 mb-1 block">Bairro</label><input className="glass-card w-full p-2.5 text-white text-sm" value={addrForm.neighborhood} onChange={e => setAddrForm(f => ({ ...f, neighborhood: e.target.value }))} /></div>
                                        <div><label className="text-xs text-slate-400 mb-1 block">Cidade</label><input className="glass-card w-full p-2.5 text-white text-sm" value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} /></div>
                                        <div><label className="text-xs text-slate-400 mb-1 block">Estado</label><select className="glass-card w-full p-2.5 text-white text-sm" value={addrForm.state} onChange={e => setAddrForm(f => ({ ...f, state: e.target.value }))}><option value="">—</option>{STATES.map(s => <option key={s}>{s}</option>)}</select></div>
                                        <div><label className="text-xs text-slate-400 mb-1 block">Apelido (ex: Casa)</label><input className="glass-card w-full p-2.5 text-white text-sm" placeholder="Casa" value={addrForm.label} onChange={e => setAddrForm(f => ({ ...f, label: e.target.value }))} /></div>
                                        <div className="flex items-center gap-2"><input type="checkbox" id="isDefault" checked={addrForm.isDefault} onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))} /><label htmlFor="isDefault" className="text-xs text-slate-300">Endereço padrão</label></div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => setShowAddAddress(false)} className="flex-1 py-2 rounded-xl border border-white/10 text-slate-300 text-sm">Cancelar</button>
                                        <button onClick={saveAddress} disabled={!addrForm.recipientName || !addrForm.cep || !addrForm.number} className="flex-1 btn-primary py-2 text-sm disabled:opacity-50">Salvar</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Payment */}
                        <div className="glass-card p-6 space-y-4">
                            <div className="flex items-center gap-2 text-white font-semibold"><CreditCard className="w-5 h-5 text-brand-400" /> Forma de Pagamento</div>
                            <div className="grid grid-cols-2 gap-3">
                                {([["pix", "🔵 PIX", "Aprovação instantânea"], ["credit_card", "💳 Cartão de Crédito", "Aprovação imediata"]] as const).map(([method, label, desc]) => (
                                    <label key={method} className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === method ? "border-brand-500 bg-brand-500/10" : "border-white/10 hover:border-white/20"}`}>
                                        <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="hidden" />
                                        <div className="text-base font-semibold text-white">{label}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                                    </label>
                                ))}
                            </div>
                            {paymentMethod === "credit_card" && (
                                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-300">
                                    💡 Para cartão de crédito, o token será gerado via Asaas no checkout. Seus dados de cartão são processados diretamente pelo gateway — nunca armazenamos dados de cartão.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className="space-y-4">
                        <div className="glass-card p-5 space-y-4">
                            <div className="text-sm font-semibold text-white">Resumo</div>
                            <div className="space-y-2">
                                {cartItems.map(i => (
                                    <div key={i.id} className="flex justify-between text-xs text-slate-400">
                                        <span className="truncate pr-2">{i.product.name} × {i.qty}</span>
                                        <span className="shrink-0">R$ {(i.product.price * i.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            {couponParam && <div className="flex justify-between text-xs text-emerald-400 border-t border-white/5 pt-2"><span>Cupom {couponParam}</span><span>Aplicado ✓</span></div>}
                            <div className="flex justify-between font-bold text-white border-t border-white/10 pt-2">
                                <span>Total</span><span>R$ {subtotal.toFixed(2)}</span>
                            </div>
                            {selectedAddress && (
                                <div className="text-xs text-slate-500 border-t border-white/5 pt-2">
                                    📦 {selectedAddress.street}, {selectedAddress.number} — {selectedAddress.city}/{selectedAddress.state}
                                </div>
                            )}
                            <button
                                onClick={placeOrder}
                                disabled={processing || cartItems.length === 0 || (!selectedAddressId && addresses.length > 0)}
                                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processando...</> : paymentMethod === "pix" ? "Gerar PIX" : "Pagar com Cartão"}
                            </button>
                            <p className="text-[10px] text-slate-500 text-center">🔒 Pagamento seguro via Asaas</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutEcommercePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050d1a] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full" /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
