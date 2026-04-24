"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2, X, Loader2, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

type Address = { id: string; label?: string; recipientName: string; phone?: string; street: string; number: string; complement?: string; neighborhood: string; city: string; state: string; cep: string; isDefault: boolean };

const STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
const emptyForm = { recipientName: "", label: "", phone: "", cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", isDefault: false };

export default function MeusEnderecosPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<any>(emptyForm);
    const [cepLoading, setCepLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const token = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

    async function load() {
        if (!token()) { router.push("/auth/login"); return; }
        setLoading(true);
        const r = await fetch(`${API}/api/auth/addresses`, { headers: headers() });
        if (r.ok) setAddresses(await r.json());
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function lookupCEP(cep: string) {
        const digits = cep.replace(/\D/g, "");
        if (digits.length !== 8) return;
        setCepLoading(true);
        try {
            const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
            const d = await r.json();
            if (!d.erro) setForm((f: any) => ({ ...f, street: d.logradouro, neighborhood: d.bairro, city: d.localidade, state: d.uf }));
        } finally { setCepLoading(false); }
    }

    async function save() {
        setSaving(true);
        try {
            const r = await fetch(`${API}/api/auth/addresses`, { method: "POST", headers: headers(), body: JSON.stringify({ ...form, cep: form.cep.replace(/\D/g, "") }) });
            if (r.ok) { setShowForm(false); setForm(emptyForm); load(); }
            else { const e = await r.json(); alert(e.message || "Erro ao salvar endereço"); }
        } finally { setSaving(false); }
    }

    async function setDefault(id: string) {
        await fetch(`${API}/api/auth/addresses/${id}`, { method: "PATCH", headers: headers(), body: JSON.stringify({ isDefault: true }) });
        load();
    }

    async function remove(id: string) {
        if (!confirm("Excluir este endereço?")) return;
        await fetch(`${API}/api/auth/addresses/${id}`, { method: "DELETE", headers: headers() });
        load();
    }

    if (loading) return <div className="min-h-screen bg-[#050d1a] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full" /></div>;

    return (
        <div className="min-h-screen bg-[#050d1a] text-white">
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3"><MapPin className="w-7 h-7 text-brand-400" /> Meus Endereços</h1>
                    <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Novo Endereço</button>
                </div>

                {addresses.length === 0 && !showForm ? (
                    <div className="glass-card p-12 text-center space-y-4">
                        <MapPin className="w-12 h-12 text-slate-600 mx-auto" />
                        <p className="text-slate-400">Nenhum endereço cadastrado.</p>
                        <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Adicionar Endereço</button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {addresses.map(a => (
                            <div key={a.id} className={`glass-card p-5 flex items-start gap-4 ${a.isDefault ? "border-brand-500/40" : ""}`}>
                                <MapPin className={`w-5 h-5 mt-0.5 ${a.isDefault ? "text-brand-400" : "text-slate-400"}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {a.label && <span className="text-xs font-bold text-brand-400">{a.label}</span>}
                                        {a.isDefault && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 flex items-center gap-1"><Star className="w-3 h-3" /> Padrão</span>}
                                    </div>
                                    <div className="font-semibold text-white mt-0.5">{a.recipientName}</div>
                                    <div className="text-sm text-slate-400">{a.street}, {a.number}{a.complement ? ` — ${a.complement}` : ""}</div>
                                    <div className="text-sm text-slate-400">{a.neighborhood} · {a.city}/{a.state} · CEP {a.cep.replace(/(\d{5})(\d{3})/, "$1-$2")}</div>
                                    {a.phone && <div className="text-xs text-slate-500 mt-1">{a.phone}</div>}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    {!a.isDefault && <button onClick={() => setDefault(a.id)} className="p-1.5 text-slate-400 hover:text-brand-300 transition-colors" title="Definir como padrão"><Star className="w-4 h-4" /></button>}
                                    <button onClick={() => remove(a.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors" title="Remover"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add form modal */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
                        <div className="bg-[#0f1f35] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white">Novo Endereço</h2>
                                <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate-400" /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2"><label className="text-xs text-slate-400 mb-1 block">Nome do Destinatário *</label><input className="glass-card w-full p-3 text-white text-sm" placeholder="João Silva" value={form.recipientName} onChange={e => setForm((f: any) => ({ ...f, recipientName: e.target.value }))} /></div>
                                <div className="col-span-2"><label className="text-xs text-slate-400 mb-1 block">Telefone</label><input className="glass-card w-full p-3 text-white text-sm" placeholder="(11) 99999-9999" value={form.phone} onChange={e => setForm((f: any) => ({ ...f, phone: e.target.value }))} /></div>
                                <div><label className="text-xs text-slate-400 mb-1 block">CEP *</label>
                                    <div className="relative"><input className="glass-card w-full p-3 text-white text-sm pr-8" placeholder="00000-000" value={form.cep} onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"); setForm((f: any) => ({ ...f, cep: v })); if (v.replace(/\D/g, "").length === 8) lookupCEP(v); }} />
                                        {cepLoading && <Loader2 className="absolute right-2.5 top-3.5 w-4 h-4 text-slate-400 animate-spin" />}</div>
                                </div>
                                <div><label className="text-xs text-slate-400 mb-1 block">Número *</label><input className="glass-card w-full p-3 text-white text-sm" placeholder="42" value={form.number} onChange={e => setForm((f: any) => ({ ...f, number: e.target.value }))} /></div>
                                <div className="col-span-2"><label className="text-xs text-slate-400 mb-1 block">Rua</label><input className="glass-card w-full p-3 text-white text-sm" placeholder="Preenchido via CEP" value={form.street} onChange={e => setForm((f: any) => ({ ...f, street: e.target.value }))} /></div>
                                <div><label className="text-xs text-slate-400 mb-1 block">Complemento</label><input className="glass-card w-full p-3 text-white text-sm" placeholder="Ap. 12" value={form.complement} onChange={e => setForm((f: any) => ({ ...f, complement: e.target.value }))} /></div>
                                <div><label className="text-xs text-slate-400 mb-1 block">Bairro</label><input className="glass-card w-full p-3 text-white text-sm" value={form.neighborhood} onChange={e => setForm((f: any) => ({ ...f, neighborhood: e.target.value }))} /></div>
                                <div><label className="text-xs text-slate-400 mb-1 block">Cidade</label><input className="glass-card w-full p-3 text-white text-sm" value={form.city} onChange={e => setForm((f: any) => ({ ...f, city: e.target.value }))} /></div>
                                <div><label className="text-xs text-slate-400 mb-1 block">Estado</label><select className="glass-card w-full p-3 text-white text-sm" value={form.state} onChange={e => setForm((f: any) => ({ ...f, state: e.target.value }))}><option value="">—</option>{STATES.map(s => <option key={s}>{s}</option>)}</select></div>
                                <div><label className="text-xs text-slate-400 mb-1 block">Apelido (ex: Casa)</label><input className="glass-card w-full p-3 text-white text-sm" placeholder="Casa" value={form.label} onChange={e => setForm((f: any) => ({ ...f, label: e.target.value }))} /></div>
                                <div className="flex items-center gap-2 pt-2"><input type="checkbox" id="isDefault" checked={form.isDefault} onChange={e => setForm((f: any) => ({ ...f, isDefault: e.target.checked }))} /><label htmlFor="isDefault" className="text-sm text-slate-300">Definir como padrão</label></div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 text-sm">Cancelar</button>
                                <button onClick={save} disabled={saving || !form.recipientName || !form.cep || !form.number} className="flex-1 btn-primary disabled:opacity-50">{saving ? "Salvando..." : "Salvar Endereço"}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
