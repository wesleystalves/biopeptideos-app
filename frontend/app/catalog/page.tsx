"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, ShieldCheck, Package, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

const CATEGORIES = ["Todos", "peptides", "sarms", "hormones", "nootropics", "supplements", "stacks"];

export default function CatalogPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todos");

    useEffect(() => {
        const params = new URLSearchParams();
        if (category !== "Todos") params.set("category", category);
        if (search) params.set("search", search);

        // Debounce
        const t = setTimeout(() => {
            fetch(`${API}/api/products?${params}`)
                .then(r => r.json())
                .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
                .catch(() => { setProducts([]); setLoading(false); });
        }, 300);
        return () => clearTimeout(t);
    }, [search, category]);

    return (
        <div className="min-h-screen" style={{ background: "#050d1a" }}>
            {/* Nav */}
            <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-40" style={{ background: "rgba(5,13,26,0.8)" }}>
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-4">
                    <Link href="/" className="font-bold text-sm">
                        <span style={{ color: "white" }}>Bio</span>
                        <span className="gradient-text">Peptidios</span>
                    </Link>
                    <div className="flex-1" />
                    <Link href="/auth/login" className="text-sm" style={{ color: "#94a3b8" }}>Minha Conta</Link>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Catálogo</h1>
                    <p style={{ color: "#64748b" }} className="text-sm flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-accent-400" />
                        Produtos filtrados automaticamente para sua região
                    </p>
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748b" }} />
                        <input
                            className="input pl-9 w-full"
                            placeholder="Buscar peptídeo..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={clsx(
                                    "px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all",
                                    category === cat ? "btn-primary" : "btn-secondary"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid de produtos */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64" style={{ color: "#475569" }}>
                        <Package className="w-12 h-12 mb-3 opacity-30" />
                        <p className="text-sm">Nenhum produto encontrado</p>
                        <p className="text-xs mt-1" style={{ color: "#334155" }}>Volte em breve — nosso catálogo está sendo preparado.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {products.map(p => (
                            <Link
                                key={p.id}
                                href={`/catalog/${p.slug || p.id}`}
                                className="glass-card-hover overflow-hidden group block"
                            >
                                {/* Imagem */}
                                <div className="h-48 flex items-center justify-center relative overflow-hidden"
                                    style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(10,20,40,0.9) 100%)" }}>
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-16 h-16" style={{ color: "rgba(14,165,233,0.2)" }} />
                                    )}
                                </div>

                                <div className="p-5">
                                    <div className="text-xs font-medium uppercase tracking-wide mb-1.5 capitalize" style={{ color: "#0ea5e9" }}>
                                        {p.category}
                                    </div>
                                    <h3 className="font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
                                        {p.name}
                                    </h3>
                                    <p className="text-xs line-clamp-2 mb-4" style={{ color: "#64748b" }}>
                                        {p.description || "Formulação de alta pureza para performance e longevidade."}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold" style={{ color: "#34d399" }}>
                                            {p.currency} {Number(p.price).toFixed(2)}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs" style={{ color: "#0ea5e9" }}>
                                            Ver produto <ChevronRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
