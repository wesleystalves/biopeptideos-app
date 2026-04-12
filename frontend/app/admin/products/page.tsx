"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, ToggleLeft, ToggleRight, X, Package } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dev.aiwhatsapp.com.br";

const CATEGORIES = ["peptides", "sarms", "hormones", "nootropics", "supplements", "stacks"];

const EMPTY_FORM = {
    name: "", slug: "", description: "", price: 0, currency: "USD",
    category: "peptides", imageUrl: "", stock: 0, isActive: true,
};

export default function ProductsAdminPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    async function load() {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/products`);
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch { setProducts([]); }
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    function openCreate() {
        setEditing(null);
        setForm({ ...EMPTY_FORM });
        setShowModal(true);
    }

    function openEdit(p: any) {
        setEditing(p);
        setForm({ name: p.name, slug: p.slug, description: p.description || "", price: p.price, currency: p.currency || "USD", category: p.category, imageUrl: p.imageUrl || "", stock: p.stock || 0, isActive: p.isActive });
        setShowModal(true);
    }

    async function save() {
        setSaving(true);
        const url = editing ? `${API}/api/products/${editing.id}` : `${API}/api/products`;
        const method = editing ? "PUT" : "POST";
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-") }),
        });
        await load();
        setShowModal(false);
        setSaving(false);
    }

    async function toggle(id: string) {
        await fetch(`${API}/api/products/${id}/toggle`, {
            method: "PUT", headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    }

    function patch(k: string, v: any) { setForm(p => ({ ...p, [k]: v })); }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Produtos</h1>
                    <p className="text-slate-400 text-sm mt-0.5">{products.length} produtos no catálogo</p>
                </div>
                <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Novo Produto
                </button>
            </div>

            {/* Grid de produtos */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : products.length === 0 ? (
                <div className="glass-card flex flex-col items-center justify-center h-48 text-slate-500">
                    <Package className="w-10 h-10 mb-3 opacity-30" />
                    <p>Nenhum produto cadastrado</p>
                    <p className="text-xs mt-1 text-slate-600">Clique em "Novo Produto" para começar</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map(p => (
                        <div key={p.id} className="glass-card overflow-hidden group">
                            {/* Imagem */}
                            <div className="h-40 bg-gradient-to-br from-brand-900/40 to-dark-900 flex items-center justify-center relative overflow-hidden">
                                {p.imageUrl ? (
                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Package className="w-12 h-12 text-brand-700/50" />
                                )}
                                <div className="absolute top-2 right-2 flex gap-1.5">
                                    <span className={`badge text-[10px] ${p.isActive ? "badge-green" : "badge-gray"}`}>
                                        {p.isActive ? "Ativo" : "Inativo"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="text-xs text-brand-400 font-medium uppercase tracking-wide mb-1">{p.category}</div>
                                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">{p.name}</h3>
                                <p className="text-slate-500 text-xs line-clamp-2 mb-3">{p.description || "—"}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-accent-400 font-bold">
                                        {p.currency} {Number(p.price).toFixed(2)}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                                            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                        </button>
                                        <button onClick={() => toggle(p.id)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                                            {p.isActive
                                                ? <ToggleRight className="w-4 h-4 text-accent-400" />
                                                : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal criar/editar */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card w-full max-w-lg p-6 animate-slide-up">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-semibold text-white">{editing ? "Editar Produto" : "Novo Produto"}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/5 rounded-lg">
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1.5">Nome *</label>
                                    <input className="input" value={form.name} onChange={e => patch("name", e.target.value)} placeholder="BPC-157" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1.5">Categoria</label>
                                    <select className="input" value={form.category} onChange={e => patch("category", e.target.value)}>
                                        {CATEGORIES.map(c => <option key={c} className="bg-dark-900">{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1.5">Preço *</label>
                                    <input type="number" min={0} step={0.01} className="input" value={form.price} onChange={e => patch("price", parseFloat(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1.5">Moeda</label>
                                    <select className="input" value={form.currency} onChange={e => patch("currency", e.target.value)}>
                                        {["USD", "BRL", "EUR", "GBP"].map(c => <option key={c} className="bg-dark-900">{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1.5">Descrição</label>
                                <textarea rows={3} className="input resize-none" value={form.description} onChange={e => patch("description", e.target.value)} placeholder="Descreva o produto..." />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1.5">URL da Imagem</label>
                                <input className="input" value={form.imageUrl} onChange={e => patch("imageUrl", e.target.value)} placeholder="https://..." />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1.5">Estoque</label>
                                    <input type="number" min={0} className="input" value={form.stock} onChange={e => patch("stock", parseInt(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1.5">Slug (URL)</label>
                                    <input className="input font-mono text-xs" value={form.slug} onChange={e => patch("slug", e.target.value)} placeholder="bpc-157" />
                                </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer mt-1">
                                <input type="checkbox" checked={form.isActive} onChange={e => patch("isActive", e.target.checked)} />
                                <span className="text-sm text-slate-400">Produto ativo (visível na loja)</span>
                            </label>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button onClick={save} disabled={saving} className="btn-primary flex-1 justify-center">
                                {saving ? "Salvando..." : editing ? "Salvar alterações" : "Criar produto"}
                            </button>
                            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
