"use client";

import { useEffect, useState } from "react";
import { Plus, Tag, Edit2, Trash2, Users, Eye, X, CheckCircle, XCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

type Coupon = {
    id: string; code: string; description?: string;
    discountType: string; discountValue: number; scope?: string;
    maxUses?: number; usedCount: number; minAmount?: number;
    allowedPlans?: string; startsAt?: string; expiresAt?: string;
    isActive: boolean; createdAt: string;
};

type Usage = { id: string; discount: number; createdAt: string; profile?: { name: string; email: string }; orderId?: string };

const emptyForm = { code: "", description: "", discountType: "percent", discountValue: 10, scope: "", maxUses: "", minAmount: "", expiresAt: "", isActive: true };

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Coupon | null>(null);
    const [form, setForm] = useState<any>(emptyForm);
    const [usageModal, setUsageModal] = useState<{ coupon: Coupon; usages: Usage[] } | null>(null);
    const [saving, setSaving] = useState(false);

    const token = () => typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

    async function load() {
        setLoading(true);
        try {
            const r = await fetch(`${API}/api/coupons`, { headers: headers() });
            if (r.ok) setCoupons(await r.json());
        } finally { setLoading(false); }
    }

    useEffect(() => { load(); }, []);

    function openCreate() { setEditing(null); setForm(emptyForm); setShowModal(true); }
    function openEdit(c: Coupon) {
        setEditing(c);
        setForm({ code: c.code, description: c.description || "", discountType: c.discountType, discountValue: c.discountValue, scope: c.scope || "", maxUses: c.maxUses ?? "", minAmount: c.minAmount ?? "", expiresAt: c.expiresAt ? c.expiresAt.split("T")[0] : "", isActive: c.isActive });
        setShowModal(true);
    }

    async function viewUsages(c: Coupon) {
        const r = await fetch(`${API}/api/coupons/${c.id}/usage`, { headers: headers() });
        const usages = r.ok ? await r.json() : [];
        setUsageModal({ coupon: c, usages });
    }

    async function save() {
        setSaving(true);
        try {
            const body = { ...form, discountValue: Number(form.discountValue), maxUses: form.maxUses ? Number(form.maxUses) : null, minAmount: form.minAmount ? Number(form.minAmount) : null, expiresAt: form.expiresAt || null };
            const url = editing ? `${API}/api/coupons/${editing.id}` : `${API}/api/coupons`;
            const method = editing ? "PATCH" : "POST";
            const r = await fetch(url, { method, headers: headers(), body: JSON.stringify(body) });
            if (r.ok) { setShowModal(false); load(); }
            else { const e = await r.json(); alert(e.message || "Erro ao salvar"); }
        } finally { setSaving(false); }
    }

    async function deleteCoupon(id: string) {
        if (!confirm("Excluir este cupom?")) return;
        await fetch(`${API}/api/coupons/${id}`, { method: "DELETE", headers: headers() });
        load();
    }

    async function toggleActive(c: Coupon) {
        await fetch(`${API}/api/coupons/${c.id}`, { method: "PATCH", headers: headers(), body: JSON.stringify({ isActive: !c.isActive }) });
        load();
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Tag className="w-6 h-6 text-brand-400" /> Cupons de Desconto</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Gerencie cupons para produtos, ebooks e planos</p>
                </div>
                <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Novo Cupom</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="stat-card"><div className="text-2xl font-bold text-white">{coupons.length}</div><div className="text-xs text-slate-500 mt-1">Total de Cupons</div></div>
                <div className="stat-card"><div className="text-2xl font-bold text-emerald-400">{coupons.filter(c => c.isActive).length}</div><div className="text-xs text-slate-500 mt-1">Ativos</div></div>
                <div className="stat-card"><div className="text-2xl font-bold text-brand-400">{coupons.reduce((s, c) => s + c.usedCount, 0)}</div><div className="text-xs text-slate-500 mt-1">Usos Totais</div></div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center gap-2"><Tag className="w-4 h-4 text-brand-400" /><span className="font-semibold text-white">Todos os Cupons</span></div>
                {loading ? <div className="p-12 text-center text-slate-400">Carregando...</div> : (
                    <div className="divide-y divide-white/5">
                        {coupons.length === 0 && <div className="p-12 text-center text-slate-500">Nenhum cupom cadastrado. Crie o primeiro!</div>}
                        {coupons.map(c => (
                            <div key={c.id} className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-brand-300">{c.code}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${c.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>{c.isActive ? "Ativo" : "Inativo"}</span>
                                        {c.scope && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{c.scope}</span>}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5">{c.description || "—"}</div>
                                </div>
                                <div className="text-sm font-bold text-white">{c.discountType === "percent" ? `${c.discountValue}%` : `R$ ${c.discountValue.toFixed(2)}`}</div>
                                <div className="text-xs text-slate-400">{c.usedCount}/{c.maxUses ?? "∞"} usos</div>
                                {c.expiresAt && <div className="text-xs text-slate-400">{new Date(c.expiresAt).toLocaleDateString("pt-BR")}</div>}
                                <div className="flex items-center gap-1">
                                    <button onClick={() => viewUsages(c)} className="p-1.5 text-slate-400 hover:text-brand-300" title="Ver usos"><Users className="w-4 h-4" /></button>
                                    <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-white" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => toggleActive(c)} className="p-1.5 text-slate-400 hover:text-white" title="Ativar/Desativar">{c.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}</button>
                                    <button onClick={() => deleteCoupon(c.id)} className="p-1.5 text-slate-400 hover:text-red-400" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-[#0f1f35] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">{editing ? "Editar Cupom" : "Novo Cupom"}</h2>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <label className="text-xs text-slate-400 mb-1 block">Código *</label>
                                <input className="glass-card w-full p-3 text-white text-sm uppercase" placeholder="EX: LAUNCH50" value={form.code} onChange={e => setForm((f: any) => ({ ...f, code: e.target.value.toUpperCase() }))} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-slate-400 mb-1 block">Descrição</label>
                                <input className="glass-card w-full p-3 text-white text-sm" placeholder="Campanha de Lançamento..." value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Tipo de desconto</label>
                                <select className="glass-card w-full p-3 text-white text-sm" value={form.discountType} onChange={e => setForm((f: any) => ({ ...f, discountType: e.target.value }))}>
                                    <option value="percent">Porcentagem (%)</option>
                                    <option value="fixed">Valor fixo (R$)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Valor *</label>
                                <input type="number" className="glass-card w-full p-3 text-white text-sm" min={0.01} value={form.discountValue} onChange={e => setForm((f: any) => ({ ...f, discountValue: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Escopo</label>
                                <select className="glass-card w-full p-3 text-white text-sm" value={form.scope} onChange={e => setForm((f: any) => ({ ...f, scope: e.target.value }))}>
                                    <option value="">Todos</option>
                                    <option value="product">Produtos</option>
                                    <option value="subscription">Planos</option>
                                    <option value="ebook">Ebooks</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Max. de usos</label>
                                <input type="number" className="glass-card w-full p-3 text-white text-sm" placeholder="Ilimitado" value={form.maxUses} onChange={e => setForm((f: any) => ({ ...f, maxUses: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Valor mínimo (R$)</label>
                                <input type="number" className="glass-card w-full p-3 text-white text-sm" placeholder="Sem mínimo" value={form.minAmount} onChange={e => setForm((f: any) => ({ ...f, minAmount: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Expira em</label>
                                <input type="date" className="glass-card w-full p-3 text-white text-sm" value={form.expiresAt} onChange={e => setForm((f: any) => ({ ...f, expiresAt: e.target.value }))} />
                            </div>
                            {editing && <div className="col-span-2 flex items-center gap-2">
                                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm((f: any) => ({ ...f, isActive: e.target.checked }))} />
                                <label htmlFor="isActive" className="text-sm text-slate-300">Cupom ativo</label>
                            </div>}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 text-sm">Cancelar</button>
                            <button onClick={save} disabled={saving || !form.code} className="flex-1 btn-primary disabled:opacity-50">{saving ? "Salvando..." : editing ? "Salvar" : "Criar Cupom"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Usage Modal */}
            {usageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setUsageModal(null)}>
                    <div className="bg-[#0f1f35] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white">Usos — <span className="text-brand-300">{usageModal.coupon.code}</span></h2>
                            <button onClick={() => setUsageModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        {usageModal.usages.length === 0 ? (
                            <p className="text-slate-400 text-sm text-center py-8">Nenhum uso registrado ainda.</p>
                        ) : (
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {usageModal.usages.map((u: Usage) => (
                                    <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                                        <div>
                                            <div className="text-sm font-medium text-white">{u.profile?.name || "—"}</div>
                                            <div className="text-xs text-slate-400">{u.profile?.email}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-emerald-400 font-bold">-R$ {u.discount.toFixed(2)}</div>
                                            <div className="text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
