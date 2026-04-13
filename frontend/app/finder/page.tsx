"use client";

import { useState } from "react";
import ClientLayout from "@/components/client-layout";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const GOALS = [
    { id: "recovery", emoji: "🩹", label: "Recuperação & Cicatrização" },
    { id: "fat-loss", emoji: "⚖️", label: "Emagrecimento & Composição" },
    { id: "cognitive", emoji: "🧠", label: "Desempenho Cognitivo" },
    { id: "anti-aging", emoji: "⏳", label: "Anti-aging & Longevidade" },
    { id: "sleep", emoji: "🌙", label: "Sono & Recuperação Noturna" },
    { id: "immunity", emoji: "💙", label: "Imunidade & Anti-inflamatório" },
    { id: "hormonal", emoji: "❤️", label: "Saúde Hormonal & Sexual" },
    { id: "gh", emoji: "📈", label: "Hormônio do Crescimento (GH)" },
    { id: "aesthetics", emoji: "✨", label: "Estética & Pele" },
    { id: "cardiovascular", emoji: "🫀", label: "Saúde Cardiovascular" },
];

const RECS: Record<string, string[]> = {
    recovery: ["BPC-157", "TB-500", "GHK-Cu"],
    "fat-loss": ["AOD-9604", "Tirzepatida", "Semaglutida"],
    cognitive: ["Semax", "Selank", "Adamax"],
    "anti-aging": ["Epithalon", "GHK-Cu", "Cartalax"],
    sleep: ["DSIP", "Delta Sleep-Inducing Peptide"],
    immunity: ["Thymosin Alpha-1", "BPC-157"],
    hormonal: ["PT-141", "Kisspeptin-10"],
    gh: ["CJC-1295 NO DAC", "Ipamorelin", "GHRP-6"],
    aesthetics: ["GHK-Cu", "Melanotan II"],
    cardiovascular: ["Cardiogen", "SS-31"],
};

export default function FinderPage() {
    const [selected, setSelected] = useState<string[]>([]);
    const [step, setStep] = useState(1);

    function toggleGoal(id: string) {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : prev.length < 4 ? [...prev, id] : prev
        );
    }

    const recs = [...new Set(selected.flatMap(g => RECS[g] || []))];

    return (
        <ClientLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Encontre seu Peptídeo</h1>
                    <p className="text-slate-400 text-sm">Responda algumas perguntas e receba recomendações personalizadas.</p>
                </div>

                {/* Progress */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-500"
                        style={{ width: step === 1 ? "50%" : "100%" }}
                    />
                </div>

                {step === 1 ? (
                    <div className="glass-card p-6 space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-white mb-1">Quais são seus objetivos?</h2>
                            <p className="text-slate-400 text-sm">Selecione de 1 a 4 objetivos que mais importam para você.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {GOALS.map(({ id, emoji, label }) => {
                                const active = selected.includes(id);
                                return (
                                    <button
                                        key={id}
                                        onClick={() => toggleGoal(id)}
                                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${active
                                                ? "bg-brand-600/15 border-brand-500/40 text-white"
                                                : "bg-white/3 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5"
                                            }`}
                                    >
                                        <span className="text-xl">{emoji}</span>
                                        <span className="text-sm font-medium">{label}</span>
                                        {active && <CheckCircle2 className="w-4 h-4 text-brand-400 ml-auto flex-shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => selected.length > 0 && setStep(2)}
                            disabled={selected.length === 0}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            Continuar <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="glass-card p-6 space-y-5">
                        <div>
                            <h2 className="text-lg font-bold text-white mb-1">Seus Peptídeos Recomendados</h2>
                            <p className="text-slate-400 text-sm">Baseado nos seus objetivos: {selected.map(id => GOALS.find(g => g.id === id)?.label).join(", ")}</p>
                        </div>
                        <div className="space-y-3">
                            {recs.map(name => (
                                <div key={name} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-500/30 transition-all">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    <span className="font-medium text-white">{name}</span>
                                    <a href={`/library?q=${encodeURIComponent(name)}`} className="ml-auto text-xs text-brand-400 hover:text-brand-300">
                                        Ver detalhes →
                                    </a>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => { setStep(1); setSelected([]); }}
                            className="btn-secondary w-full"
                        >
                            Recomeçar
                        </button>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
