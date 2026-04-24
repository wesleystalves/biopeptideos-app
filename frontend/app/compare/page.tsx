"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ClientLayout from "@/components/client-layout";
import { Plus, X, GitCompare, Search, ChevronRight, CheckCircle, AlertCircle, Activity } from "lucide-react";
import { PEPTIDES } from "@/lib/peptides-data";
import { PEPTIDE_DETAILS } from "@/lib/peptides-detail-data";

// ─── Popular comparisons ──────────────────────────────────────────────────────

const POPULAR = [
    { label: "Recuperação", desc: "Os dois peptídeos de recuperação mais populares", tags: ["BPC-157", "TB-500"] },
    { label: "Secretagogos de GH", desc: "Compare os liberadores de GH", tags: ["CJC-1295 NO DAC", "Ipamorelin"] },
    { label: "Emagrecimento", desc: "Líderes em perda de peso", tags: ["Semaglutide", "Tirzepatide"] },
    { label: "Nootrópicos", desc: "Peptídeos russos nootropicos", tags: ["Semax", "Selank"] },
    { label: "Anti-aging", desc: "Peptídeos para longevidade", tags: ["Epithalon", "GHK-Cu"] },
    { label: "Stack Completo", desc: "Recuperação completa", tags: ["BPC-157", "TB-500", "GHK-Cu"] },
];

type Peptide = { id: number; name: string; slug: string; category: string; imageUrl: string; description?: string };
const MAX_COMPARE = 3;

// ─── Evidence level badge ─────────────────────────────────────────────────────

function EvidenceBadge({ level }: { level?: string }) {
    if (!level) return <span className="text-slate-500">—</span>;
    const color =
        level.includes("Fase III") || level.includes("FDA") ? "text-green-400 bg-green-500/10 border-green-500/30" :
            level.includes("Fase II") ? "text-blue-400 bg-blue-500/10 border-blue-500/30" :
                level.includes("Fase I") ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" :
                    "text-orange-400 bg-orange-500/10 border-orange-500/30";
    return (
        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${color}`}>{level}</span>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ComparePage() {
    const [selected, setSelected] = useState<Peptide[]>([]);
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

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
        if (selected.find(s => s.id === p.id) || selected.length >= MAX_COMPARE) return;
        setSelected(prev => [...prev, p]);
        setSearch(""); setShowDropdown(false); setShowSearch(false);
    }

    function removePeptide(id: number) {
        setSelected(prev => prev.filter(p => p.id !== id));
    }

    function loadPopular(tags: string[]) {
        const found = tags
            .map(tag => PEPTIDES.find(p =>
                p.name.toLowerCase() === tag.toLowerCase() ||
                p.slug.toLowerCase() === tag.toLowerCase().replace(/\s/g, "-")
            ))
            .filter(Boolean) as Peptide[];
        setSelected(found.slice(0, MAX_COMPARE));
        setShowSearch(false);
    }

    function getDetail(p: Peptide) { return PEPTIDE_DETAILS?.[p.id]; }

    // Extract route string from protocol
    function getRoute(p: Peptide) {
        const d = getDetail(p);
        return d?.protocol?.route || "—";
    }

    // Get dosage summary from dosageByIndication
    function getDosage(p: Peptide) {
        const d = getDetail(p);
        if (!d?.dosageByIndication?.length) return "—";
        const main = d.dosageByIndication[0];
        return `${main.dose}, ${main.frequency}`;
    }

    const canAdd = selected.length < MAX_COMPARE;

    // ── Comparison rows ────────────────────────────────────────────────────────
    const ROWS: { label: string; render: (p: Peptide) => React.ReactNode }[] = [
        { label: "Categoria", render: p => <span className="text-xs px-2 py-0.5 rounded-full bg-brand-600/15 text-brand-400 border border-brand-500/20 font-medium">{getDetail(p)?.classification || p.category || "—"}</span> },
        { label: "Nível de Evidência", render: p => <EvidenceBadge level={getDetail(p)?.evidenceLevel} /> },
        { label: "Meia-vida", render: p => <span className="text-slate-200 font-medium">{getDetail(p)?.halfLife || "—"}</span> },
        {
            label: "Benefícios",
            render: p => {
                const b = getDetail(p)?.benefits?.slice(0, 5);
                return b?.length ? (
                    <ul className="space-y-1">
                        {b.map(item => (
                            <li key={item} className="flex items-start gap-1.5 text-sm text-slate-300">
                                <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                ) : <span className="text-slate-500">—</span>;
            }
        },
        {
            label: "Mecanismo",
            render: p => {
                const m = getDetail(p)?.mechanism?.slice(0, 3);
                return m?.length ? (
                    <ul className="space-y-1">
                        {m.map(item => (
                            <li key={item} className="flex items-start gap-1.5 text-sm text-slate-300">
                                <Activity className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                ) : <span className="text-slate-500">—</span>;
            }
        },
        { label: "Via de Administração", render: p => <span className="text-slate-200">{getRoute(p)}</span> },
        { label: "Dosagem", render: p => <span className="text-slate-200">{getDosage(p)}</span> },
        { label: "Reconstituição", render: p => <span className="text-slate-200">{getDetail(p)?.reconstitutionDifficulty || "—"}</span> },
        {
            label: "Referências",
            render: p => {
                const count = getDetail(p)?.references?.length;
                return count
                    ? <span className="text-slate-300">{count} estudo{count !== 1 ? "s" : ""}</span>
                    : <span className="text-slate-500">—</span>;
            }
        },
    ];

    return (
        <ClientLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <GitCompare className="w-6 h-6 text-brand-400" />
                        Comparar Peptídeos
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Compare até {MAX_COMPARE} peptídeos lado a lado — mecanismos, dosagens, benefícios e compatibilidade.
                    </p>
                </div>

                {/* Selected peptides as chips + Add button */}
                <div className="flex flex-wrap items-center gap-3">
                    {selected.map(p => (
                        <div key={p.id} className="flex items-center gap-2 glass-card px-3 py-2 border-brand-500/40">
                            {p.imageUrl && (
                                <div className="w-7 h-7 rounded-lg overflow-hidden bg-white/5 shrink-0">
                                    <Image
                                        src={p.imageUrl}
                                        alt={p.name}
                                        width={28}
                                        height={28}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <div className="font-semibold text-white text-sm leading-tight">{p.name}</div>
                                <div className="text-[10px] text-slate-400">{p.category}</div>
                            </div>
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
                                                        className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                                                    >
                                                        {p.imageUrl && (
                                                            <div className="w-6 h-6 rounded overflow-hidden bg-white/5 shrink-0">
                                                                <Image src={p.imageUrl} alt={p.name} width={24} height={24} className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                        <span className="flex-1">{p.name}</span>
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
                                    <button onClick={() => { setShowSearch(false); setSearch(""); setShowDropdown(false); }} className="text-slate-400 hover:text-white transition-colors">
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
                        <button onClick={() => setSelected([])} className="text-xs text-slate-500 hover:text-slate-300 transition-colors ml-2">
                            Limpar tudo
                        </button>
                    )}
                </div>

                {/* COMPARISON TABLE */}
                {selected.length >= 2 ? (
                    <div className="glass-card overflow-hidden">
                        {/* Header row with images */}
                        <div
                            className="grid border-b border-white/5"
                            style={{ gridTemplateColumns: `180px ${selected.map(() => "1fr").join(" ")}` }}
                        >
                            <div className="p-4 text-xs text-slate-500 font-semibold uppercase tracking-wide">Propriedade</div>
                            {selected.map(p => (
                                <div key={p.id} className="p-4 border-l border-white/5">
                                    {p.imageUrl && (
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 mb-3">
                                            <Image src={p.imageUrl} alt={p.name} width={48} height={48} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="font-bold text-white">{p.name}</div>
                                    <div className="text-xs text-brand-400 mt-0.5">{p.category}</div>
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        {ROWS.map(row => (
                            <div
                                key={row.label}
                                className="grid border-b border-white/5 hover:bg-white/2 transition-colors"
                                style={{ gridTemplateColumns: `180px ${selected.map(() => "1fr").join(" ")}` }}
                            >
                                <div className="p-4 text-xs text-slate-500 font-medium self-start pt-4">{row.label}</div>
                                {selected.map(p => (
                                    <div key={p.id} className="p-4 border-l border-white/5">
                                        {row.render(p)}
                                    </div>
                                ))}
                            </div>
                        ))}

                        {/* Links row */}
                        <div
                            className="grid border-t border-white/10"
                            style={{ gridTemplateColumns: `180px ${selected.map(() => "1fr").join(" ")}` }}
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
                        {/* Popular comparisons */}
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
                                                <span key={t} className="px-2 py-0.5 bg-brand-600/15 text-brand-400 text-[10px] rounded-full border border-brand-500/20">{t}</span>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selected.length === 1 && (
                            <div className="glass-card p-5 border-dashed border-brand-500/20 text-center space-y-2">
                                <AlertCircle className="w-8 h-8 text-brand-400 mx-auto" />
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
