"use client";

import { useState, useEffect } from "react";
import ClientLayout from "@/components/client-layout";
import Link from "next/link";
import { Search, FlaskConical, ChevronRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dev.aiwhatsapp.com.br";

const CATEGORIES = ["Todos", "Anti-aging", "Antioxidante", "Biorregulador", "Cardiovascular", "Emagrecimento", "Estética", "GH / Secretagogos", "Hormonal", "Imunidade", "Metabolismo", "Neuroproteção", "Nootrópicos", "Performance", "Recuperação", "Sexual", "Sono / Recuperação"];

type Peptide = {
    id: string; name: string; slug: string; summary?: string;
    categories?: string[]; dosage?: string; imageUrl?: string;
};

export default function LibraryPage() {
    const [peptides, setPeptides] = useState<Peptide[]>([]);
    const [filter, setFilter] = useState("Todos");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${API}/api/peptides`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(d => { setPeptides(Array.isArray(d) ? d : d.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const filtered = peptides.filter(p => {
        const matchCat = filter === "Todos" || p.categories?.includes(filter);
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <ClientLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Peptídeos Individuais</h1>
                    <p className="text-slate-400 text-sm">Biblioteca completa com protocolos e referências científicas</p>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar peptídeo por nome, categoria ou variante..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input w-full pl-11"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === cat
                                    ? "bg-brand-600 text-white shadow-glow"
                                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="glass-card h-56 animate-pulse bg-white/5" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <FlaskConical className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">Nenhum peptídeo encontrado</p>
                        <p className="text-slate-500 text-sm mt-1">Os dados estão sendo importados</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map(p => (
                            <Link
                                key={p.id}
                                href={`/library/${p.slug || p.id}`}
                                className="glass-card group overflow-hidden hover:border-brand-500/30 hover:scale-[1.02] transition-all duration-200"
                            >
                                {/* Image */}
                                <div className="h-36 bg-gradient-to-br from-brand-900/40 to-brand-800/20 relative overflow-hidden">
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FlaskConical className="w-10 h-10 text-brand-500/40" />
                                        </div>
                                    )}
                                    {p.categories?.[0] && (
                                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-brand-600/80 backdrop-blur-sm text-white text-[10px] font-medium rounded-full">
                                            {p.categories[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="p-3">
                                    <div className="font-semibold text-white text-sm mb-1">{p.name}</div>
                                    {p.dosage && <div className="text-xs text-slate-500">{p.dosage}</div>}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
