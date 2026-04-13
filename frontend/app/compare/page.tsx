"use client";

import { useState, useEffect } from "react";
import ClientLayout from "@/components/client-layout";
import { Plus, X, GitCompare } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dev.aiwhatsapp.com.br";

type Peptide = { id: string; name: string; slug: string; mechanism?: string; dosage?: string; categories?: string[]; summary?: string; };

const POPULAR = [
    { label: "Recuperação", desc: "Os dois peptídeos de recuperação mais populares", tags: ["BPC-157", "TB-500"] },
    { label: "Secretagogos de GH", desc: "Compare os liberadores de GH", tags: ["CJC-1295 NO DAC", "Ipamorelin"] },
    { label: "Emagrecimento", desc: "Líderes em perda de peso", tags: ["Semaglutida", "Tirzepatida"] },
    { label: "Nootrópicos", desc: "Peptídeos russos nootropicos", tags: ["Semax", "Selank"] },
    { label: "Anti-aging", desc: "Peptídeos para longevidade", tags: ["Epithalon", "GHK-Cu"] },
    { label: "Stack Completo", desc: "Recuperação completa", tags: ["BPC-157", "TB-500", "GHK-Cu"] },
];

export default function ComparePage() {
    const [all, setAll] = useState<Peptide[]>([]);
    const [picks, setPicks] = useState<(Peptide | null)[]>([null, null]);
    const [search, setSearch] = useState<string[]>(["", ""]);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

    useEffect(() => {
        fetch(`${API}/api/peptides`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(d => setAll(Array.isArray(d) ? d : d.data || []))
            .catch(() => { });
    }, []);

    function pick(idx: number, p: Peptide) {
        setPicks(prev => { const n = [...prev]; n[idx] = p; return n; });
        setSearch(prev => { const n = [...prev]; n[idx] = ""; return n; });
    }
    function clear(idx: number) { setPicks(prev => { const n = [...prev]; n[idx] = null; return n; }); }

    const filtered = (idx: number) =>
        search[idx] ? all.filter(p => p.name.toLowerCase().includes(search[idx].toLowerCase())) : [];

    const compared = picks.filter(Boolean) as Peptide[];

    return (
        <ClientLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Comparar Peptídeos</h1>
                    <p className="text-slate-400 text-sm">Compare até 2 peptídeos lado a lado — mecanismos, dosagens, benefícios e compatibilidade.</p>
                </div>

                {/* Selectors */}
                <div className="grid grid-cols-2 gap-4">
                    {[0, 1].map(idx => (
                        <div key={idx} className="relative">
                            {picks[idx] ? (
                                <div className="glass-card p-4 flex items-center justify-between">
                                    <span className="font-semibold text-white">{picks[idx]!.name}</span>
                                    <button onClick={() => clear(idx)} className="text-slate-500 hover:text-red-400 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <input
                                        className="input w-full"
                                        placeholder="Adicionar peptídeo..."
                                        value={search[idx]}
                                        onChange={e => setSearch(prev => { const n = [...prev]; n[idx] = e.target.value; return n; })}
                                    />
                                    {filtered(idx).length > 0 && (
                                        <div className="absolute top-12 left-0 right-0 glass-card z-10 max-h-48 overflow-y-auto">
                                            {filtered(idx).map(p => (
                                                <button key={p.id} onClick={() => pick(idx, p)} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                                                    {p.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Comparison table */}
                {compared.length === 2 ? (
                    <div className="glass-card overflow-hidden">
                        <div className="grid grid-cols-3 border-b border-white/5">
                            <div className="p-4 text-xs text-slate-500 font-medium uppercase tracking-wide">Propriedade</div>
                            {compared.map(p => <div key={p.id} className="p-4 font-bold text-white border-l border-white/5">{p.name}</div>)}
                        </div>
                        {[
                            { label: "Categorias", key: "categories", fmt: (v: any) => (Array.isArray(v) ? v.join(", ") : v) || "—" },
                            { label: "Dosagem", key: "dosage", fmt: (v: any) => v || "—" },
                            { label: "Mecanismo", key: "mechanism", fmt: (v: any) => v?.slice(0, 120) + (v?.length > 120 ? "..." : "") || "—" },
                            { label: "Resumo", key: "summary", fmt: (v: any) => v?.slice(0, 100) + (v?.length > 100 ? "..." : "") || "—" },
                        ].map(row => (
                            <div key={row.label} className="grid grid-cols-3 border-b border-white/5 hover:bg-white/2 transition-colors">
                                <div className="p-4 text-xs text-slate-500 font-medium self-center">{row.label}</div>
                                {compared.map(p => (
                                    <div key={p.id} className="p-4 text-sm text-slate-300 border-l border-white/5">{row.fmt((p as any)[row.key])}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Comparações populares */}
                        <div>
                            <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">Comparações Populares</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {POPULAR.map(({ label, desc, tags }) => (
                                    <button key={label} className="glass-card p-4 text-left hover:border-brand-500/30 hover:scale-[1.02] transition-all">
                                        <div className="font-semibold text-white text-sm mb-1">{label}</div>
                                        <div className="text-xs text-slate-500 mb-2">{desc}</div>
                                        <div className="flex gap-1 flex-wrap">
                                            {tags.map(t => <span key={t} className="px-2 py-0.5 bg-brand-600/15 text-brand-400 text-[10px] rounded-full">{t}</span>)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="text-center py-6 text-slate-500 flex flex-col items-center gap-2">
                            <GitCompare className="w-8 h-8 text-slate-700" />
                            <p className="text-sm">Selecione 2 peptídeos acima para comparar</p>
                        </div>
                    </>
                )}
            </div>
        </ClientLayout>
    );
}
