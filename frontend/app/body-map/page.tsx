"use client";

import ClientLayout from "@/components/client-layout";
import { useState } from "react";

type BodyPart = { id: string; label: string; x: string; y: string; methods: string[]; notes: string };

const BODY_PARTS: BodyPart[] = [
    { id: "abdomen", label: "Abdômen", x: "48%", y: "46%", methods: ["Subcutâneo"], notes: "Local preferido para SC — pinça de gordura de 2-3cm. Rodízio entre os quadrantes para evitar lipo-atrofia." },
    { id: "deltoid", label: "Ombro (Deltóide)", x: "22%", y: "32%", methods: ["Intramuscular"], notes: "Site clássico para IM de 1-3ml. Agulha 25g 16mm a 90°. Ideal para auto-aplicação." },
    { id: "quad", label: "Quadríceps", x: "36%", y: "66%", methods: ["Intramuscular"], notes: "Músculo vasto-lateral: melhor site para IM em volumes maiores. Fácil visualização para auto-aplicação." },
    { id: "nasal", label: "Nasal / Intranasal", x: "48%", y: "12%", methods: ["Intranasal"], notes: "Usado para Semax, Selank e PT-141. Absorção rápida por via mucosa. Use spray nasal 1mg/ml." },
    { id: "orbital", label: "Orbital (Ocular)", x: "48%", y: "14%", methods: ["Subconjuntival"], notes: "Via especializada: somente para peptídeos oculares como BPC-157 colírio. Requer orientação médica." },
    { id: "thigh", label: "Coxa", x: "42%", y: "62%", methods: ["Subcutâneo", "Intramuscular"], notes: "Alternativa para SC quando o abdômen está saturado. IM no vasto-lateral para doses maiores." },
];

export default function BodyMapPage() {
    const [active, setActive] = useState<BodyPart | null>(null);

    return (
        <ClientLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Mapa de Aplicação</h1>
                    <p className="text-slate-400 text-sm">Guia visual de locais e métodos de administração de peptídeos.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
                    {/* Body SVG */}
                    <div className="glass-card p-6 relative">
                        <div className="relative mx-auto" style={{ maxWidth: 300, height: 480 }}>
                            {/* Body silhouette */}
                            <svg viewBox="0 0 200 400" className="w-full h-full opacity-20">
                                {/* Head */}
                                <ellipse cx="100" cy="30" rx="22" ry="28" fill="#60a5fa" />
                                {/* Neck */}
                                <rect x="90" y="55" width="20" height="18" rx="4" fill="#60a5fa" />
                                {/* Torso */}
                                <path d="M55 73 Q45 80 42 140 L40 200 L160 200 L158 140 Q155 80 145 73 Z" fill="#60a5fa" />
                                {/* Arms */}
                                <path d="M56 78 Q30 90 22 160 Q18 180 24 195" stroke="#60a5fa" strokeWidth="22" strokeLinecap="round" fill="none" />
                                <path d="M144 78 Q170 90 178 160 Q182 180 176 195" stroke="#60a5fa" strokeWidth="22" strokeLinecap="round" fill="none" />
                                {/* Legs */}
                                <path d="M80 200 Q76 270 74 340 Q72 370 82 380" stroke="#60a5fa" strokeWidth="28" strokeLinecap="round" fill="none" />
                                <path d="M120 200 Q124 270 126 340 Q128 370 118 380" stroke="#60a5fa" strokeWidth="28" strokeLinecap="round" fill="none" />
                            </svg>

                            {/* Hotspots */}
                            {BODY_PARTS.map(part => (
                                <button
                                    key={part.id}
                                    onClick={() => setActive(part.id === active?.id ? null : part)}
                                    className="absolute flex items-center justify-center"
                                    style={{ left: part.x, top: part.y, transform: "translate(-50%, -50%)" }}
                                >
                                    <span className={`
                                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                                        transition-all duration-200 text-[9px] font-bold
                                        ${active?.id === part.id
                                            ? "bg-brand-500 border-brand-400 shadow-glow scale-125"
                                            : "bg-brand-600/40 border-brand-400/60 hover:bg-brand-500/60 hover:scale-110"
                                        }
                                    `}>
                                        <span className="text-white">●</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info panel */}
                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Sites de Aplicação</h2>
                        {BODY_PARTS.map(part => (
                            <button
                                key={part.id}
                                onClick={() => setActive(part.id === active?.id ? null : part)}
                                className={`w-full text-left p-3 rounded-xl border transition-all ${active?.id === part.id
                                        ? "bg-brand-600/15 border-brand-500/40 text-white"
                                        : "bg-white/3 border-white/10 text-slate-300 hover:border-white/20"
                                    }`}
                            >
                                <div className="font-medium text-sm">{part.label}</div>
                                <div className="flex gap-1 mt-1 flex-wrap">
                                    {part.methods.map(m => (
                                        <span key={m} className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-slate-400">{m}</span>
                                    ))}
                                </div>
                                {active?.id === part.id && (
                                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{part.notes}</p>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
