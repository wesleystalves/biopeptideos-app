"use client";

import { useState, useMemo } from "react";
import ClientLayout from "@/components/client-layout";
import { PEPTIDES } from "@/lib/peptides-data";
import Link from "next/link";
import { Search } from "lucide-react";

const CATEGORIES = ["Todos", "Anti-aging", "Antioxidante", "Biorregulador", "Cardiovascular",
    "Emagrecimento", "Estética", "GH / Secretagogos", "Hormonal", "Imunidade",
    "Metabolismo", "Neuroproteção", "Nootrópicos", "Performance", "Recuperação",
    "Sexual", "Sono / Recuperação"];

export default function LibraryPage() {
    const [filter, setFilter] = useState("Todos");
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => PEPTIDES.filter(p => {
        const matchCat = filter === "Todos" || p.category === filter;
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
            || p.description.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    }), [filter, search]);

    return (
        <ClientLayout>
            <div className="max-w-6xl mx-auto space-y-5">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-0.5">Peptídeos Individuais</h1>
                    <p className="text-brand-400 text-sm">
                        Biblioteca completa com{" "}
                        <span className="underline decoration-dotted cursor-help" title="Protocolos baseados em evidências">
                            protocolos e referências científicas
                        </span>
                    </p>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar peptídeo por nome, categoria ou variante..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input w-full pl-10"
                    />
                </div>

                {/* Category filters */}
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${filter === cat
                                ? "bg-brand-600 text-white border-brand-500 shadow-glow"
                                : "bg-transparent text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Count */}
                <p className="text-slate-500 text-xs">{filtered.length} peptídeos encontrados</p>

                {/* Grid — fiel ao clone: 5 colunas em desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filtered.map(p => (
                        <Link
                            key={p.id}
                            href={`/library/${p.slug}`}
                            className="glass-card group overflow-hidden hover:border-brand-500/40 hover:scale-[1.02] transition-all duration-200"
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden" style={{ paddingBottom: "66%" }}>
                                <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                                {/* Category badge */}
                                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-medium rounded">
                                    {p.category}
                                </span>
                            </div>
                            <div className="p-2.5">
                                <div className="font-semibold text-white text-xs leading-tight mb-0.5">{p.name}</div>
                                {p.description && (
                                    <div className="text-[10px] text-slate-500 leading-tight line-clamp-2">{p.description}</div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </ClientLayout>
    );
}
