"use client";

import { useState } from "react";
import ClientLayout from "@/components/client-layout";
import { X, ChevronRight, CheckCircle2 } from "lucide-react";

type InjectionPoint = {
    id: string;
    label: string;
    region: string;
    side: "frontal" | "dorsal";
    x: number;  // % posição no SVG
    y: number;
    angle: string;
    technique: string;
    tips: string[];
    idealFor: string[];
    color?: "applied";
};

const INJECTION_POINTS: InjectionPoint[] = [
    // FRONTAL
    { id: "abd-sup-d", label: "Abdômen Superior Direito", region: "Abdômen", side: "frontal", x: 53, y: 41, angle: "90°", technique: "Região supraumbilical direita. Pinçar o tecido adiposo com 2 dedos e inserir a agulha na base da dobra.", tips: ["Evite a linha alba (centro)", "Distância mínima de 2 cm do umbigo", "Ideal para rotação diária"], idealFor: ["BPC-157", "Peptídeos gerais"] },
    { id: "abd-sup-e", label: "Abdômen Superior Esquerdo", region: "Abdômen", side: "frontal", x: 47, y: 41, angle: "90°", technique: "Região supraumbilical esquerda. Alterne com o lado direito para evitar lipo-atrofia.", tips: ["Manter rotação semanal entre os 4 quadrantes", "Evite área com hematoma", "Aspire antes em diabéticos"], idealFor: ["BPC-157", "TB-500", "Peptídeos gerais"] },
    { id: "abd-inf-d", label: "Abdômen Inferior Direito", region: "Abdômen", side: "frontal", x: 54, y: 47, angle: "90°", technique: "Região infraumbilical direita (região de \"barriga baixa\"). Maior quantidade de tecido adiposo facilita a aplicação.", tips: ["Bom tecido adiposo na maioria das pessoas", "Evitar a linha inguinal", "Opção para rotação avançada"], idealFor: ["BPC-157 (lesão lombar)", "Peptídeos gerais"] },
    { id: "abd-inf-e", label: "Abdômen Inferior Esquerdo", region: "Abdômen", side: "frontal", x: 46, y: 47, angle: "90°", technique: "Região infraumbilical esquerda. Par com o quadrante inferior direito no esquema de rotação.", tips: ["Evitar a crista ilíaca", "Aplicar lentamente para evitar desconforto", "Bom escoamento linfático"], idealFor: ["Semaglutida", "Tirzepatida", "GLP-1"] },
    { id: "coxa-ext-d", label: "Coxa Externa Direita", region: "Coxa", side: "frontal", x: 60, y: 63, angle: "90°", technique: "Vasto lateral — parte externa da coxa, 1/3 médio. Pode-se usar posição sentada para relaxar o músculo.", tips: ["Músculo relaxado = menos dor", "Boa absorção para IM", "Evite nervos e vasos"], idealFor: ["Ipamorelin", "CJC-1295", "Doses maiores"] },
    { id: "coxa-ext-e", label: "Coxa Externa Esquerda", region: "Coxa", side: "frontal", x: 40, y: 63, angle: "90°", technique: "Vasto lateral esquerdo — espelhe a técnica do lado direito. Alterne semanalmente.", tips: ["Ideal para auto-aplicação intramuscular", "Visualização fácil", "Permite agulha 16-25mm"], idealFor: ["GH secretagogos", "Ciclos longos"] },
    // DORSAL
    { id: "triceps-d", label: "Tríceps Posterior Direito", region: "Braço", side: "dorsal", x: 68, y: 38, angle: "45°", technique: "Porção lateral do tríceps. Requer assistência ou espelho. Pinçar a gordura posterior do braço.", tips: ["Mais difícil para auto-aplicação", "Boa opção para quem tem pouco tecido abdominal", "Use agulha 4-6mm SC"], idealFor: ["BPC-157", "Peptídeos gerais"] },
    { id: "triceps-e", label: "Tríceps Posterior Esquerdo", region: "Braço", side: "dorsal", x: 32, y: 38, angle: "45°", technique: "Mesmo do lado direito. Prefira quando o braço dominante estiver usado com frequência.", tips: ["Área menos usada = menor lipo-atrofia", "Difícil sem espelho", "Alternar com abdômen"], idealFor: ["Rotação avançada"] },
    { id: "gluteo-sup-d", label: "Glúteo Superior Direito", region: "Glúteo", side: "dorsal", x: 57, y: 49, angle: "90°", technique: "Quadrante superior externo do glúteo (1/4 ext. superior). Evita o nervo ciático.", tips: ["NUNCA aplique no quadrante interno inferior — risco do ciático", "Agulha IM 25-38mm", "Manter em pé ou deitado lateral"], idealFor: ["TB-500", "Doses IM maiores"] },
    { id: "gluteo-sup-e", label: "Glúteo Superior Esquerdo", region: "Glúteo", side: "dorsal", x: 43, y: 49, angle: "90°", technique: "Quadrante superior externo esquerdo. Técnica espelhada do lado direito.", tips: ["Site preferido para IM de alto volume", "Massagear após para distribuição", "Aquecer local antes"], idealFor: ["TB-500", "GH peptídeos IM"] },
    { id: "lombar-d", label: "Lombar Lateral Direita", region: "Lombar", side: "dorsal", x: 59, y: 44, angle: "45° a 90°", technique: "Região lateral (love handles). Pinçar tecido e inserir.", tips: ["Bom tecido adiposo na maioria das pessoas", "Evitar a coluna vertebral", "Opção para rotação avançada"], idealFor: ["BPC-157 (lesão lombar)", "Peptídeos gerais"] },
    { id: "lombar-e", label: "Lombar Lateral Esquerda", region: "Lombar", side: "dorsal", x: 41, y: 44, angle: "45° a 90°", technique: "Região lombar esquerda. Mesmo esquema do lado direito.", tips: ["Alternar com glúteo e coxa", "Evite área com dor lombar ativa", "SC ideal aqui"], idealFor: ["Peptídeos gerais", "Rotação"] },
];

const ROTATION_SCHEDULE = [
    { day: "Segunda", local: "Abdômen Inferior", side: "Direito" },
    { day: "Terça", local: "Abdômen Inferior", side: "Esquerdo" },
    { day: "Quarta", local: "Coxa Externa", side: "Direito" },
    { day: "Quinta", local: "Coxa Externa", side: "Esquerdo" },
    { day: "Sexta", local: "Tríceps Posterior", side: "Direito" },
    { day: "Sábado", local: "Tríceps Posterior", side: "Esquerdo" },
    { day: "Domingo", local: "Glúteo Superior", side: "Direito" },
];

const REGIONS = ["Abdômen (4)", "Coxa (2)", "Braço (2)", "Glúteo (2)", "Lombar (2)"];

// SVG body silhouette - frontal e dorsal
function BodySVG({ side, points, active, onSelect }: { side: "frontal" | "dorsal"; points: InjectionPoint[]; active: string | null; onSelect: (id: string) => void }) {
    const filtered = points.filter(p => p.side === side);

    return (
        <div className="relative flex flex-col items-center">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">{side === "frontal" ? "FRONTAL" : "DORSAL"}</div>
            <div className="relative" style={{ width: 160, height: 380 }}>
                <svg viewBox="0 0 160 400" className="w-full h-full" style={{ fill: "#1e293b", stroke: "#334155", strokeWidth: 1.5 }}>
                    {/* Head */}
                    <ellipse cx="80" cy="28" rx="20" ry="24" />
                    {/* Neck */}
                    <rect x="72" y="50" width="16" height="14" rx="3" />
                    {/* Torso */}
                    <path d="M42 64 Q35 72 33 120 L32 180 L128 180 L127 120 Q125 72 118 64 Q100 58 80 58 Q60 58 42 64 Z" />
                    {/* Left arm */}
                    <path d="M42 68 Q22 80 16 140 Q13 162 18 175" stroke="#334155" strokeWidth="18" strokeLinecap="round" fill="none" />
                    {/* Right arm */}
                    <path d="M118 68 Q138 80 144 140 Q147 162 142 175" stroke="#334155" strokeWidth="18" strokeLinecap="round" fill="none" />
                    {/* Left leg */}
                    <path d="M62 180 Q58 240 56 300 Q54 330 60 340" stroke="#334155" strokeWidth="22" strokeLinecap="round" fill="none" />
                    {/* Right leg */}
                    <path d="M98 180 Q102 240 104 300 Q106 330 100 340" stroke="#334155" strokeWidth="22" strokeLinecap="round" fill="none" />
                </svg>

                {/* Injection hotspots */}
                {filtered.map(pt => {
                    const isActive = active === pt.id;
                    return (
                        <button
                            key={pt.id}
                            onClick={() => onSelect(pt.id)}
                            className="absolute"
                            style={{ left: `${pt.x}%`, top: `${pt.y}%`, transform: "translate(-50%, -50%)" }}
                            title={pt.label}
                        >
                            <span className={`
                                block w-3.5 h-3.5 rounded-full border-2 transition-all duration-200
                                ${isActive
                                    ? "bg-brand-400 border-brand-300 scale-150 shadow-glow"
                                    : "bg-emerald-500/70 border-emerald-400 hover:scale-125 hover:bg-emerald-400 animate-pulse"
                                }
                            `} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function BodyMapPage() {
    const [activeId, setActiveId] = useState<string | null>("abd-inf-d");
    const [tab, setTab] = useState<"map" | "schedule">("map");
    const [applied, setApplied] = useState<Set<string>>(new Set(["abd-inf-d"]));

    const activePoint = INJECTION_POINTS.find(p => p.id === activeId);

    // Today's suggested point (Monday = abd-inf-d)
    const todaySuggestion = INJECTION_POINTS[2]; // Abdômen Inferior Direito

    function toggleApplied(id: string) {
        setApplied(prev => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id); else n.add(id);
            return n;
        });
    }

    return (
        <ClientLayout>
            <div className="max-w-5xl mx-auto space-y-5">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-0.5">Mapa de Aplicação Corporal</h1>
                    <p className="text-slate-400 text-sm">Visão frontal e dorsal com 12 locais de injeção subcutânea. <span className="text-brand-400">Clique nos pontos para ver a técnica.</span></p>
                </div>

                {/* Today's suggestion banner */}
                <div className="glass-card p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-600/20 flex items-center justify-center">
                            <span className="text-base">💉</span>
                        </div>
                        <div>
                            <div className="text-[10px] text-brand-400 font-medium uppercase tracking-wide">Aplicação de Hoje (Segunda)</div>
                            <div className="font-bold text-white text-sm">{todaySuggestion.label}</div>
                            <div className="text-[10px] text-slate-500">Ângulo: {todaySuggestion.angle}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => toggleApplied(todaySuggestion.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${applied.has(todaySuggestion.id)
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-brand-600 text-white hover:bg-brand-500"
                            }`}
                    >
                        {applied.has(todaySuggestion.id) ? (
                            <><CheckCircle2 className="w-3.5 h-3.5" /> Concluído</>
                        ) : (
                            <><CheckCircle2 className="w-3.5 h-3.5" /> Marcar Feito</>
                        )}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 glass-card p-1">
                    {[{ id: "map", label: "🗺️ Mapa Corporal" }, { id: "schedule", label: "📅 Diário Semanal" }].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id as any)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${tab === t.id
                                    ? "bg-white/10 text-white"
                                    : "text-slate-400 hover:text-white"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === "map" ? (
                    <div className="glass-card p-5">
                        <div className="flex justify-center gap-6">
                            <BodySVG side="frontal" points={INJECTION_POINTS} active={activeId} onSelect={setActiveId} />
                            <BodySVG side="dorsal" points={INJECTION_POINTS} active={activeId} onSelect={setActiveId} />
                        </div>

                        {/* Helper text */}
                        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-500">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
                            Clique nos pontos pulsantes para ver a técnica detalhada de cada local.
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block ml-2" />
                            Pontos verdes = já aplicados esta semana
                        </div>

                        {/* Region legend */}
                        <div className="flex flex-wrap gap-3 justify-center mt-3">
                            {REGIONS.map(r => (
                                <span key={r} className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500/60" />{r}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Schedule tab */
                    <div className="glass-card overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left p-4 text-xs text-slate-500 font-medium">Dia</th>
                                    <th className="text-left p-4 text-xs text-slate-500 font-medium">Local de Aplicação</th>
                                    <th className="text-left p-4 text-xs text-slate-500 font-medium">Lado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROTATION_SCHEDULE.map((row, i) => (
                                    <tr key={row.day} className={`border-b border-white/5 ${i === 0 ? "bg-brand-600/10" : "hover:bg-white/3"} transition-colors`}>
                                        <td className="p-4 text-sm font-medium text-white">{row.day}</td>
                                        <td className="p-4 text-sm text-slate-300">{row.local}</td>
                                        <td className="p-4 text-sm text-slate-300">{row.side}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-4 bg-blue-500/5 border-t border-blue-500/20">
                            <p className="text-xs text-blue-400">ℹ️ Manter distância mínima de 2cm entre aplicações no mesmo local. Anote no diário para controle de rotação.</p>
                        </div>
                    </div>
                )}

                {/* Modal with technique details */}
                {activePoint && (
                    <div className="glass-card p-5 border-brand-500/30">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{activePoint.region}</div>
                                <h2 className="text-lg font-bold text-white">{activePoint.label}</h2>
                            </div>
                            <button onClick={() => setActiveId(null)} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-4">
                                {/* Angle */}
                                <div className="p-3 rounded-xl bg-brand-600/10 border border-brand-500/20">
                                    <div className="text-xs text-brand-400 font-medium mb-1">🎯 Ângulo da Agulha</div>
                                    <div className="text-white font-bold text-lg">{activePoint.angle}</div>
                                </div>

                                {/* Technique */}
                                <div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">Técnica de Aplicação</div>
                                    <p className="text-slate-300 text-sm leading-relaxed">{activePoint.technique}</p>
                                </div>

                                {/* Tips */}
                                <div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">💡 Dicas</div>
                                    <ul className="space-y-1.5">
                                        {activePoint.tips.map((tip, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0 mt-1.5" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Ideal For */}
                                <div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">✅ Ideal Para</div>
                                    <div className="flex flex-wrap gap-2">
                                        {activePoint.idealFor.map(item => (
                                            <span key={item} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">{item}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Warning */}
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <div className="text-xs text-red-400 font-medium mb-1">⚠️ Atenção</div>
                                    <p className="text-xs text-slate-400">Sempre limpe o local com swab de álcool 70% em movimentos circulares de dentro para fora antes de aplicar.</p>
                                </div>

                                {/* Mark as done */}
                                <button
                                    onClick={() => toggleApplied(activePoint.id)}
                                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-sm font-medium transition-all ${applied.has(activePoint.id)
                                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                            : "bg-white/5 border-white/10 text-slate-300 hover:border-brand-500/30 hover:text-white"
                                        }`}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {applied.has(activePoint.id) ? "Aplicado esta semana ✓" : "Marcar como Aplicado"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
