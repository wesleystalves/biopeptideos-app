"use client";

import { useEffect, useState } from "react";
import { Plus, Package, Edit2, Power, Search, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

type Product = {
    id: string; name: string; slug: string; description?: string;
    price: number; currency: string; category: string; imageUrl?: string;
    isActive: boolean; stockQty: number; featured: boolean; createdAt: string;
};

const emptyForm = { name: "", slug: "", description: "", longDescription: "", price: "", currency: "BRL", category: "", imageUrl: "", stockQty: 999, weight: "", featured: false };

export default function AdminProdutos() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [form, setForm] = useState<any>(emptyForm);
    const [saving, setSaving] = useState(false);

    const token = () => typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

    async function load() {
        setLoading(true);
        try {
            const r = await fetch(`${API}/api/products/admin`, { headers: headers() });
            if (r.ok) setProducts(await r.json());
            else {
                // fallback: public endpoint
                const r2 = await fetch(`${API}/api/products?all=true`, { headers: headers() });
                if (r2.ok) setProducts(await r2.json());
            }
        } finally { setLoading(false); }
    }

    useEffect(() => { load(); }, []);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    function openCreate() { setEditing(null); setForm(emptyForm); setShowModal(true); }
    function openEdit(p: Product) {
        setEditing(p);
        setForm({ name: p.name, slug: p.slug, description: p.description || "", price: p.price, currency: p.currency, category: p.category, imageUrl: p.imageUrl || "", stockQty: p.stockQty, featured: p.featured });
        setShowModal(true);
    }

    function autoSlug(name: string) {
        return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    async function save() {
        setSaving(true);
        try {
            const body = { ...form, price: Number(form.price), stockQty: Number(form.stockQty), weight: form.weight ? Number(form.weight) : undefined, slug: form.slug || autoSlug(form.name) };
            const url = editing ? `${API}/api/products/${editing.id}` : `${API}/api/products`;
            const method = editing ? "PATCH" : "POST";
            const r = await fetch(url, { method, headers: headers(), body: JSON.stringify(body) });
            if (r.ok) { setShowModal(false); load(); }
            else { const e = await r.json(); alert(e.message || "Erro ao salvar"); }
        } finally { setSaving(false); }
    }

    async function toggleActive(p: Product) {
        await fetch(`${API}/api/products/${p.id}/toggle`, { method: "PATCH", headers: headers() });
        load();
    }

    const categories = [...new Set(products.map(p => p.category))];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Package className="w-6 h-6 text-brand-400" /> Produtos</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Gerencie o catálogo de produtos do e-commerce</p>
                </div>
                <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Novo Produto</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="stat-card"><div className="text-2xl font-bold text-white">{products.length}</div><div className="text-xs text-slate-500 mt-1">Total</div></div>
                <div className="stat-card"><div className="text-2xl font-bold text-emerald-400">{products.filter(p => p.isActive).length}</div><div className="text-xs text-slate-500 mt-1">Ativos</div></div>
                <div className="stat-card"><div className="text-2xl font-bold text-brand-400">{products.filter(p => p.featured).length}</div><div className="text-xs text-slate-500 mt-1">Em Destaque</div></div>
                <div className="stat-card"><div className="text-2xl font-bold text-yellow-400">{categories.length}</div><div className="text-xs text-slate-500 mt-1">Categorias</div></div>
            </div>

            {/* Search */}
            <div className="glass-card p-4 flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400" />
                <input className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-500" placeholder="Buscar produto ou categoria..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                {loading ? <div className="p-12 text-center text-slate-400">Carregando...</div> : (
                    <div className="divide-y divide-white/5">
                        {filtered.length === 0 && <div className="p-12 text-center text-slate-500">{search ? "Nenhum produto encontrado" : "Nenhum produto cadastrado. Crie o primeiro!"}</div>}
                        {filtered.map(p => (
                            <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors">
                                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-white/5" /> : <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center"><Package className="w-5 h-5 text-slate-500" /></div>}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-white truncate">{p.name}</span>
                                        {p.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Destaque</span>}
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${p.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>{p.isActive ? "Ativo" : "Inativo"}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5">{p.category}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-white">R$ {p.price.toFixed(2)}</div>
                                    <div className="text-xs text-slate-400">{p.stockQty} em estoque</div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-white" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => toggleActive(p)} className={`p-1.5 ${p.isActive ? "text-emerald-400 hover:text-red-400" : "text-slate-400 hover:text-emerald-400"}`} title={p.isActive ? "Desativar" : "Ativar"}><Power className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-[#0f1f35] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">{editing ? "Editar Produto" : "Novo Produto"}</h2>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="space-y-3">
                            {[{ label: "Nome *", key: "name", type: "text", placeholder: "BPC-157 500mcg" }, { label: "Slug (URL)", key: "slug", type: "text", placeholder: "bpc-157-500mcg (auto)" }, { label: "Categoria *", key: "category", type: "text", placeholder: "Peptídeo Recuperação" }, { label: "Imagem (URL)", key: "imageUrl", type: "url", placeholder: "https://..." }].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
                                    <input type={f.type} className="glass-card w-full p-3 text-white text-sm" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm((ff: any) => ({ ...ff, [f.key]: e.target.value, ...(f.key === "name" && !editing ? { slug: autoSlug(e.target.value) } : {}) }))} />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs text-slate-400 mb-1 block">Descrição curta</label>
                                <textarea className="glass-card w-full p-3 text-white text-sm resize-none" rows={2} placeholder="Descrição breve do produto" value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Preço (R$) *</label>
                                    <input type="number" min={0} step={0.01} className="glass-card w-full p-3 text-white text-sm" placeholder="0.00" value={form.price} onChange={e => setForm((f: any) => ({ ...f, price: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Estoque</label>
                                    <input type="number" min={0} className="glass-card w-full p-3 text-white text-sm" value={form.stockQty} onChange={e => setForm((f: any) => ({ ...f, stockQty: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Peso (kg)</label>
                                    <input type="number" min={0} step={0.01} className="glass-card w-full p-3 text-white text-sm" placeholder="0.10" value={form.weight} onChange={e => setForm((f: any) => ({ ...f, weight: e.target.value }))} />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                    <input type="checkbox" checked={form.featured} onChange={e => setForm((f: any) => ({ ...f, featured: e.target.checked }))} />
                                    Produto em Destaque
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 text-sm">Cancelar</button>
                            <button onClick={save} disabled={saving || !form.name || !form.category || !form.price} className="flex-1 btn-primary disabled:opacity-50">{saving ? "Salvando..." : editing ? "Salvar" : "Criar Produto"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
