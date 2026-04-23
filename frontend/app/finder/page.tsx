"use client";

import { useState } from "react";
import ClientLayout from "@/components/client-layout";
import { ArrowRight, ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import Link from "next/link";

// ── Objectives ─────────────────────────────────────────────────────
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
] as const;

type GoalId = typeof GOALS[number]["id"];

// ── Experience levels ───────────────────────────────────────────────
const LEVELS = [
    {
        id: "beginner",
        label: "Iniciante",
        sub: "Nunca usei peptídeos",
        emoji: "🌱",
    },
    {
        id: "intermediate",
        label: "Intermediário",
        sub: "Já usei 1-3 peptídeos",
        emoji: "⚡",
    },
    {
        id: "advanced",
        label: "Avançado",
        sub: "Experiência com múltiplos protocolos",
        emoji: "🔬",
    },
] as const;

type LevelId = typeof LEVELS[number]["id"];

// ── Recommendations: { name, slug, level }[]  ─────────────────────
// level = minimum experience required ("beginner" = safe for all)
type Rec = { name: string; slug: string; level: LevelId; desc: string };

const RECS: Record<GoalId, Rec[]> = {
    recovery: [
        { name: "BPC-157", slug: "bpc-157", level: "beginner", desc: "Cicatrização acelerada, proteção gástrica e recuperação muscular." },
        { name: "TB-500", slug: "tb-500", level: "beginner", desc: "Reparo de tecidos musculares, tendões e ligamentos." },
        { name: "GHK-Cu", slug: "ghk-cu", level: "beginner", desc: "Tripeptídeo de cobre com potente ação regenerativa tecidual." },
        { name: "Epithalon", slug: "epithalon", level: "intermediate", desc: "Biorregulador de reparo celular e anti-aging profundo." },
    ],
    "fat-loss": [
        { name: "AOD-9604", slug: "aod-9604", level: "beginner", desc: "Fragmento de GH que estimula lipólise sem efeitos colaterais do GH." },
        { name: "Tirzepatida", slug: "tirzepatide", level: "intermediate", desc: "Dual agonista GIP/GLP-1 para perda de peso expressiva." },
        { name: "Semaglutida", slug: "semaglutide", level: "intermediate", desc: "Agonista GLP-1 com poderoso efeito sacietogênico." },
        { name: "5-Amino-1MQ", slug: "5-amino-1mq", level: "advanced", desc: "Inibidor da NNMT que aumenta o metabolismo energético." },
    ],
    cognitive: [
        { name: "Semax", slug: "semax", level: "beginner", desc: "Análogo do ACTH com efeitos nootrópicos e neuroprotetores." },
        { name: "Selank", slug: "selank", level: "beginner", desc: "Ansiolítico peptídico com melhora de foco e memória." },
        { name: "Adamax", slug: "adamax", level: "intermediate", desc: "Derivado do Semax com neuroproteção avançada." },
        { name: "Dihexa - Potenciador Cognitivo", slug: "dihexa-potenciador-cognitivo", level: "advanced", desc: "Um dos nootrópicos mais potentes para sinaptogênese." },
    ],
    "anti-aging": [
        { name: "Epithalon", slug: "epithalon", level: "beginner", desc: "Regulador de telomerase com ação anti-envelhecimento comprovada." },
        { name: "GHK-Cu", slug: "ghk-cu", level: "beginner", desc: "Rejuvenescimento celular, pele e crescimento capilar." },
        { name: "Cartalax", slug: "cartalax", level: "intermediate", desc: "Biorregulador peptídico para cartilagem e articulações." },
        { name: "FOXO4-DRI", slug: "foxo4-dri", level: "advanced", desc: "Peptídeo senolítico que elimina células senescentes." },
    ],
    sleep: [
        { name: "DSIP", slug: "dsip", level: "beginner", desc: "Peptídeo indutor de sono delta e recuperação noturna." },
        { name: "Selank", slug: "selank", level: "beginner", desc: "Reduz ansiedade e melhora a qualidade do sono." },
        { name: "Epithalon", slug: "epithalon", level: "intermediate", desc: "Regula o ciclo circadiano e melhora o sono profundo." },
    ],
    immunity: [
        { name: "Crystagen", slug: "crystagen", level: "beginner", desc: "Imunomodulador peptídico derivado do timo." },
        { name: "BPC-157", slug: "bpc-157", level: "beginner", desc: "Ação anti-inflamatória sistêmica e reparo gastrointestinal." },
        { name: "Thymosin Alpha-1", slug: "thymosin-alpha-1", level: "intermediate", desc: "Potente imunomodulador utilizado contra infecções crônicas." },
    ],
    hormonal: [
        { name: "PT-141", slug: "pt-141", level: "beginner", desc: "Peptídeo para saúde sexual masculina e feminina." },
        { name: "Kisspeptin-10", slug: "kisspeptin", level: "intermediate", desc: "Regulador do eixo hipotalâmico-hipofisário-gonadal." },
        { name: "Gonadorelin", slug: "gonadorelin", level: "intermediate", desc: "Análogo de GnRH para estimulação de LH e FSH." },
        { name: "HCG (5000IU Vial)", slug: "hcg-5000iu-vial", level: "advanced", desc: "Suporte hormonal e preservação da fertilidade." },
    ],
    gh: [
        { name: "CJC-1295 NO DAC", slug: "cjc-1295-no-dac", level: "beginner", desc: "Pulsos naturais de GH com menor retenção hídrica." },
        { name: "Ipamorelin", slug: "ipamorelin", level: "beginner", desc: "Secretagogo seletivo de GH sem efeitos no cortisol." },
        { name: "CJC-1295 DAC", slug: "cjc-1295-dac", level: "intermediate", desc: "Meia-vida estendida para liberação sustentada de GH." },
        { name: "GHRP-6", slug: "ghrp-6", level: "intermediate", desc: "Forte liberação de GH com estímulo do apetite." },
        { name: "HGH 191AA (10IU Vial)", slug: "hgh-191aa-10iu-vial", level: "advanced", desc: "Hormônio do crescimento humano recombinante." },
    ],
    aesthetics: [
        { name: "GHK-Cu", slug: "ghk-cu", level: "beginner", desc: "Rejuvenescimento da pele, crescimento capilar e reparação." },
        { name: "Melanotan II", slug: "melanotan-ii", level: "intermediate", desc: "Bronzeamento sintético e aumento da libido." },
        { name: "Epithalon", slug: "epithalon", level: "intermediate", desc: "Anti-aging profundo e melhora da pele." },
    ],
    cardiovascular: [
        { name: "Cardiogen", slug: "cardiogen", level: "beginner", desc: "Biorregulador peptídico que protege o miocárdio." },
        { name: "BPC-157", slug: "bpc-157", level: "beginner", desc: "Proteção vascular e reparo de tecidos cardíacos." },
        { name: "SS-31", slug: "ss-31-elamipretide", level: "advanced", desc: "Peptídeo protetor mitocondrial com ação cardíaca." },
    ],
};

// ── Level filter ────────────────────────────────────────────────────
const LEVEL_ORDER: Record<LevelId, number> = { beginner: 0, intermediate: 1, advanced: 2 };

function filterByLevel(recs: Rec[], level: LevelId): Rec[] {
    const max = LEVEL_ORDER[level];
    return recs.filter((r) => LEVEL_ORDER[r.level] <= max);
}

// ── Main Page ───────────────────────────────────────────────────────
export default function FinderPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selected, setSelected] = useState<GoalId[]>([]);
    const [level, setLevel] = useState<LevelId | null>(null);

    function toggleGoal(id: GoalId) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : prev.length < 4 ? [...prev, id] : prev
        );
    }

    function goToStep2() {
        if (selected.length > 0) setStep(2);
    }

    function goToStep3(chosenLevel: LevelId) {
        setLevel(chosenLevel);
        setStep(3);
    }

    function restart() {
        setStep(1);
        setSelected([]);
        setLevel(null);
    }

    // Deduplicate and filter results
    const allRecs = [...new Map(
        selected.flatMap((g) => filterByLevel(RECS[g] || [], level ?? "beginner"))
            .map((r) => [r.slug, r])
    ).values()].slice(0, 8);

    const progress = step === 1 ? "33%" : step === 2 ? "66%" : "100%";

    return (
        <ClientLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Encontre seu Peptídeo</h1>
                    <p className="text-slate-400 text-sm">Responda algumas perguntas e receba recomendações personalizadas.</p>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-500"
                        style={{ width: progress }}
                    />
                </div>

                {/* ── STEP 1: Objectives ── */}
                {step === 1 && (
                    <div className="glass-card p-6 space-y-5">
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
                                        type="button"
                                        onClick={() => toggleGoal(id)}
                                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${active
                                            ? "bg-brand-600/20 border-brand-500/50 text-white shadow-glow"
                                            : "bg-white/3 border-white/10 text-slate-300 hover:border-white/25 hover:bg-white/6 hover:text-white"
                                            }`}
                                    >
                                        <span className="text-xl flex-shrink-0">{emoji}</span>
                                        <span className="text-sm font-medium leading-tight">{label}</span>
                                        {active && <CheckCircle2 className="w-4 h-4 text-brand-400 ml-auto flex-shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={goToStep2}
                            disabled={selected.length === 0}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Continuar <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* ── STEP 2: Experience ── */}
                {step === 2 && (
                    <div className="glass-card p-6 space-y-5">
                        <div>
                            <h2 className="text-lg font-bold text-white mb-1">Qual sua experiência com peptídeos?</h2>
                            <p className="text-brand-400 text-sm">Isso nos ajuda a recomendar opções adequadas ao seu nível.</p>
                        </div>

                        <div className="space-y-3">
                            {LEVELS.map(({ id, label, sub, emoji }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => goToStep3(id)}
                                    className="w-full flex items-center gap-4 p-5 rounded-xl border border-white/10 bg-white/3 hover:border-brand-500/50 hover:bg-brand-600/10 text-left transition-all group cursor-pointer"
                                >
                                    <span className="text-2xl">{emoji}</span>
                                    <div className="flex-1">
                                        <div className="font-semibold text-white group-hover:text-brand-300 transition-colors">{label}</div>
                                        <div className="text-sm text-slate-400">{sub}</div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors" />
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" /> Voltar
                        </button>
                    </div>
                )}

                {/* ── STEP 3: Results ── */}
                {step === 3 && (
                    <div className="glass-card p-6 space-y-5">
                        <div>
                            <h2 className="text-lg font-bold text-white mb-1">Seus Peptídeos Recomendados</h2>
                            <p className="text-slate-400 text-sm">
                                Baseado nos seus objetivos:{" "}
                                <span className="text-white">
                                    {selected.map((id) => GOALS.find((g) => g.id === id)?.label).join(", ")}
                                </span>
                            </p>
                        </div>

                        {allRecs.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-slate-400">Nenhuma recomendação para esta combinação. Tente outros objetivos.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {allRecs.map((rec) => (
                                    <div
                                        key={rec.slug}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-500/30 transition-all group"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-white text-sm">{rec.name}</div>
                                            <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{rec.desc}</div>
                                        </div>
                                        <Link
                                            href={`/library/${rec.slug}`}
                                            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600/15 border border-brand-500/25 text-brand-400 hover:text-white hover:bg-brand-600/30 text-xs font-medium transition-all whitespace-nowrap"
                                        >
                                            Ver detalhes <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={restart}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all text-sm"
                        >
                            <RotateCcw className="w-4 h-4" /> Recomeçar
                        </button>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
