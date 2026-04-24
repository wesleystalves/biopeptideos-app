"use client";

import { useState, useEffect, useRef } from "react";
import ClientLayout from "@/components/client-layout";
import { Plus, X, GitCompare, Search, ChevronRight } from "lucide-react";
import { PEPTIDES } from "@/lib/peptides-data";
import { PEPTIDE_DETAILS } from "@/lib/peptides-detail-data";

const POPULAR = [
    { label: "Recuperação", desc: "Os dois peptídeos de recuperação mais populares", tags: ["BPC-157", "TB-500"] },
    { label: "Secretagogos de GH", desc: "Compare os liberadores de GH", tags: ["CJC-1295 NO DAC", "Ipamorelin"] },
    { label: "Emagrecimento", desc: "Líderes em perda de peso", tags: ["Semaglutida", "Tirzepatida"] },
    { label: "Nootrópicos", desc: "Peptídeos russos nootropicos", tags: ["Semax", "Selank"] },
    { label: "Anti-aging", desc: "Peptídeos para longevidade", tags: ["Epithalon", "GHK-Cu"] },
    { label: "Stack Completo", desc: "Recuperação completa", tags: ["BPC-157", "TB-500", "GHK-Cu"] },
];

type Peptide = { id: number; name: string; slug: string; category: string; description?: string; tags?: string[] };

const MAX_COMPARE = 3;

export default function ComparePage() {
    const [selected, setSelected] = useState<Peptide[]>([]);
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = search.trim().length >= 1
        ? PEPTIDES.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) &&
            !selected.find(s => s.id === p.id)
        ).slice(0, 10)
        : [];

    function addPeptide(p: Peptide) {
        if (selected.find(s => s.id === p.id)) return;
        if (selected.length >= MAX_COMPARE) return;
        setSelected(prev => [...prev, p]);
        setSearch("");
        setShowDropdown(false);
        setShowSearch(false);
    }

    function removePeptide(id: number) {
        setSelected(prev => prev.filter(p => p.id !== id));
    }

    // Load a popular comparison
    function loadPopular(tags: string[]) {
        const found = tags
            .map(tag => PEPTIDES.find(p => p.name.toLowerCase() === tag.toLowerCase() || p.slug.toLowerCase() === tag.toLowerCase().replace(/\s/g, "-")))
            .filter(Boolean) as Peptide[];
        setSelected(found.slice(0, MAX_COMPARE));
        setShowSearch(false);
    }

    function getDetail(p: Peptide) {
        return PEPTIDE_DETAILS?.[p.id];
    }

    const canAdd = selected.length < MAX_COMPARE;

    return (
        <ClientLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <GitCompare className="w-6 h-6 text-brand-400" />
                            Comparar Peptídeos
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Compare até {MAX_COMPARE} peptídeos lado a lado — mecanismos, dosagens, benefícios e compatibilidade.
                        </p>
                    </div>
                </div>

                {/* Selected peptides as chips + Add button */}
                <div className="flex flex-wrap items-center gap-3">
                    {selected.map(p => (
                        <div key={p.id} className="flex items-center gap-2 glass-card px-4 py-2.5 border-brand-500/40">
                            <span className="font-semibold text-white text-sm">{p.name}</span>
                            <button
                                onClick={() => removePeptide(p.id)}
                                className="text-slate-500 hover:text-red-400 transition-colors ml-1"
                                aria-label={`Remover ${p.name}`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {canAdd && (
                        <div ref={searchRef} className="relative">
                            {showSearch ? (
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            autoFocus
                                            className="glass-card pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 w-64 outline-none border-brand-500/40"
                                            placeholder="Buscar peptídeo..."
                                            value={search}
                                            onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
                                            onFocus={() => setShowDropdown(true)}
                                        />
                                        {showDropdown && filtered.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 glass-card z-20 max-h-52 overflow-y-auto shadow-xl border border-white/10">
                                                {filtered.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => addPeptide(p)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                                                    >
                                                        <span>{p.name}</span>
                                                        <span className="text-xs text-slate-500">{p.category}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {showDropdown && search.trim().length >= 1 && filtered.length === 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 glass-card z-20 px-4 py-3 text-sm text-slate-500">
                                                Nenhum peptídeo encontrado
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => { setShowSearch(false); setSearch(""); setShowDropdown(false); }}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowSearch(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-brand-500/40 text-brand-400 text-sm hover:bg-brand-500/10 hover:border-brand-400 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar Peptídeo
                                </button>
                            )}
                        </div>
                    )}

                    {selected.length > 0 && (
                        <button
                            onClick={() => setSelected([])}
                            className="text-xs text-slate-500 hover:text-slate-300 transition-colors ml-2"
                        >
                            Limpar tudo
                        </button>
                    )}
                </div>

                {/* COMPARISON TABLE */}
                {selected.length >= 2 ? (
                    <div className="glass-card overflow-hidden">
                        {/* Header row */}
                        <div className={`grid border-b border-white/5`} style={{ gridTemplateColumns: `1fr ${selected.map(() => "1fr").join(" ")}` }}>
                            <div className="p-4 text-xs text-slate-500 font-semibold uppercase tracking-wide">Propriedade</div>
                            {selected.map(p => (
                                <div key={p.id} className="p-4 border-l border-white/5">
                                    <div className="font-bold text-white">{p.name}</div>
                                    <div className="text-xs text-brand-400 mt-0.5">{p.category}</div>
                                </div>
                            ))}
                        </div>
                        {/* Rows */}
                        {[
                            { label: "Categoria", get: (p: Peptide) => p.category || "—" },
                            { label: "O que é", get: (p: Peptide) => { const d = getDetail(p); const txt = d?.whatIs || p.description || ""; return txt.slice(0, 160) + (txt.length > 160 ? "..." : "") || "—"; } },
                            { label: "Mecanismo", get: (p: Peptide) => { const d = getDetail(p); const m = d?.mechanism; return m ? (Array.isArray(m) ? m[0]?.slice(0, 120) : String(m).slice(0, 120)) || "—" : "—"; } },
                            { label: "Benefícios", get: (p: Peptide) => { const d = getDetail(p); return d?.benefits?.slice(0, 3).join(" • ") || "—"; } },
                            { label: "Linha do tempo", get: (p: Peptide) => { const d = getDetail(p); const t = d?.timeline?.[0]; return t ? `${t.period}: ${t.description.slice(0, 100)}` : "—"; } },
                            { label: "Meia-vida", get: (p: Peptide) => { const d = getDetail(p); return d?.halfLife || "—"; } },
                            { label: "Compatível com", get: (p: Peptide) => { const d = getDetail(p); return d?.stacks?.slice(0, 3).map((s: any) => s.name).join(", ") || "—"; } },
                        ].map(row => (
                            <div
                                key={row.label}
                                className={`grid border-b border-white/5 hover:bg-white/2 transition-colors`}
                                style={{ gridTemplateColumns: `1fr ${selected.map(() => "1fr").join(" ")}` }}
                            >
                                <div className="p-4 text-xs text-slate-500 font-medium self-start pt-5">{row.label}</div>
                                {selected.map(p => (
                                    <div key={p.id} className="p-4 text-sm text-slate-300 border-l border-white/5 leading-relaxed">
                                        {row.get(p)}
                                    </div>
                                ))}
                            </div>
                        ))}
                        {/* Links */}
                        <div
                            className={`grid border-t border-white/10`}
                            style={{ gridTemplateColumns: `1fr ${selected.map(() => "1fr").join(" ")}` }}
                        >
                            <div className="p-4 text-xs text-slate-500 font-medium">Ver detalhes</div>
                            {selected.map(p => (
                                <div key={p.id} className="p-4 border-l border-white/5">
                                    <a
                                        href={`/library/${p.slug}`}
                                        className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                                    >
                                        Abrir {p.name} <ChevronRight className="w-3 h-3" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Comparações populares */}
                        <div>
                            <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">Comparações Populares</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {POPULAR.map(({ label, desc, tags }) => (
                                    <button
                                        key={label}
                                        onClick={() => loadPopular(tags)}
                                        className="glass-card p-4 text-left hover:border-brand-500/40 hover:scale-[1.02] active:scale-100 transition-all cursor-pointer group"
                                    >
                                        <div className="font-semibold text-white text-sm mb-1 group-hover:text-brand-300 transition-colors">{label}</div>
                                        <div className="text-xs text-slate-500 mb-2">{desc}</div>
                                        <div className="flex gap-1 flex-wrap">
                                            {tags.map(t => (
                                                <span key={t} className="px-2 py-0.5 bg-brand-600/15 text-brand-400 text-[10px] rounded-full border border-brand-500/20">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selected.length === 1 && (
                            <div className="glass-card p-5 border-dashed border-brand-500/20 text-center space-y-2">
                                <p className="text-sm text-slate-400">
                                    <span className="text-brand-300 font-semibold">{selected[0].name}</span> selecionado.
                                    Adicione mais um peptídeo para comparar.
                                </p>
                                <button
                                    onClick={() => setShowSearch(true)}
                                    className="btn-primary text-sm flex items-center gap-2 mx-auto"
                                >
                                    <Plus className="w-4 h-4" /> Adicionar segundo peptídeo
                                </button>
                            </div>
                        )}

                        {selected.length === 0 && (
                            <div className="text-center py-8 text-slate-500 flex flex-col items-center gap-2">
                                <GitCompare className="w-10 h-10 text-slate-700" />
                                <p className="text-sm">
                                    Clique em uma comparação popular ou use o botão{" "}
                                    <span className="text-brand-400">+ Adicionar Peptídeo</span>
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </ClientLayout>
    );
}
