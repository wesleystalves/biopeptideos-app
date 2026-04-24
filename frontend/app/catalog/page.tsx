"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingCart, Search, Package, Star, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

type Product = {
    id: string; name: string; slug: string; description?: string;
    price: number; currency: string; category: string; imageUrl?: string;
    featured: boolean; stockQty: number; tags: string[];
};

export default function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
    const router = useRouter();

    const token = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

    const loadProducts = useCallback(async () => {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (search) params.set("search", search);
        const r = await fetch(`${API}/api/products?${params}`);
        const data = await r.json();
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
    }, [category, search]);

    useEffect(() => {
        setLoading(true);
        const t = setTimeout(loadProducts, 300);
        return () => clearTimeout(t);
    }, [loadProducts]);

    useEffect(() => {
        fetch(`${API}/api/products/categories`)
            .then(r => r.json())
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(() => { });
    }, []);

    async function addToCart(product: Product) {
        const t = token();
        if (!t) { router.push("/auth/login"); return; }
        const r = await fetch(`${API}/api/ecommerce/cart`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ productId: product.id, qty: 1 }),
        });
        if (r.ok) {
            setAddedIds(prev => new Set([...prev, product.id]));
            setTimeout(() => setAddedIds(prev => { const s = new Set(prev); s.delete(product.id); return s; }), 2000);
        }
    }

    const featured = products.filter(p => p.featured);
    const regular = products.filter(p => !p.featured);

    return (
        <div className="min-h-screen bg-[#050d1a] text-white">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-3">Catálogo de <span className="gradient-text">Produtos</span></h1>
                    <p className="text-slate-400 text-lg">Peptídeos e suplementos com qualidade farmacêutica</p>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="flex-1 glass-card flex items-center gap-3 px-4 py-3">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input className="flex-1 bg-transparent text-white outline-none placeholder-slate-500 text-sm" placeholder="Buscar produtos..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        <button onClick={() => setCategory("")} className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${!category ? "bg-brand-600 text-white" : "glass-card text-slate-400 hover:text-white"}`}>Todos</button>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors capitalize ${category === cat ? "bg-brand-600 text-white" : "glass-card text-slate-400 hover:text-white"}`}>{cat}</button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => <div key={i} className="glass-card h-72 animate-pulse rounded-2xl" />)}
                    </div>
                ) : (
                    <>
                        {/* Featured banner */}
                        {featured.length > 0 && !search && !category && (
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm font-semibold text-yellow-400">Em Destaque</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {featured.map(p => <ProductCard key={p.id} product={p} added={addedIds.has(p.id)} onAddToCart={() => addToCart(p)} featured />)}
                                </div>
                            </div>
                        )}

                        {/* All products */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {(search || category ? products : regular).map(p => <ProductCard key={p.id} product={p} added={addedIds.has(p.id)} onAddToCart={() => addToCart(p)} />)}
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-20">
                                <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">Nenhum produto encontrado</p>
                            </div>
                        )}
                    </>
                )}

                {/* Cart FAB */}
                <a href="/cart" className="fixed bottom-6 right-6 w-14 h-14 bg-brand-600 rounded-full flex items-center justify-center shadow-2xl shadow-brand-600/40 hover:bg-brand-500 transition-colors z-40">
                    <ShoppingCart className="w-6 h-6 text-white" />
                </a>
            </div>
        </div>
    );
}

function ProductCard({ product, added, onAddToCart, featured = false }: { product: Product; added: boolean; onAddToCart: () => void; featured?: boolean }) {
    return (
        <div className={`glass-card overflow-hidden hover:border-brand-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10 group ${featured ? "sm:col-span-1" : ""}`}>
            {/* Image */}
            <div className="relative aspect-square bg-white/3 overflow-hidden">
                {product.imageUrl
                    ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-slate-600" /></div>
                }
                {featured && <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-yellow-500/90 text-[10px] font-bold text-black">★ DESTAQUE</div>}
                {product.stockQty <= 5 && product.stockQty > 0 && <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-500/90 text-[10px] font-bold text-white">Últimas {product.stockQty} unid.</div>}
            </div>

            <div className="p-4 space-y-3">
                <div>
                    <div className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider">{product.category}</div>
                    <h3 className="font-semibold text-white mt-0.5 leading-snug">{product.name}</h3>
                    {product.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description}</p>}
                </div>

                <div className="flex items-center justify-between pt-1">
                    <div>
                        <div className="text-xl font-bold text-white">R$ {product.price.toFixed(2).replace(".", ",")}</div>
                        <div className="text-[10px] text-slate-500">à vista</div>
                    </div>
                    <button
                        onClick={onAddToCart}
                        disabled={product.stockQty === 0}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${added ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : product.stockQty === 0 ? "bg-slate-600/20 text-slate-500 cursor-not-allowed" : "bg-brand-600/80 text-white hover:bg-brand-500"}`}
                    >
                        {added ? <><Check className="w-4 h-4" /> Adicionado</> : product.stockQty === 0 ? "Esgotado" : <><Plus className="w-4 h-4" /> Carrinho</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
