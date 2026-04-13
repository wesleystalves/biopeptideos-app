"use client";

import ClientLayout from "@/components/client-layout";
import { Layers, ArrowRight } from "lucide-react";
import Link from "next/link";

const STACKS = [
    {
        name: "Recuperação Total",
        goal: "Recuperação & Cicatrização",
        color: "from-emerald-600/15 to-emerald-500/5",
        border: "border-emerald-500/20",
        badge: "bg-emerald-500/15 text-emerald-400",
        peptides: [
            { name: "BPC-157", dose: "250mcg 2x/dia", role: "Cicatrização de tecidos e redução de inflamação" },
            { name: "TB-500", dose: "2mg 2x/semana", role: "Regeneração de fibras musculares e tendões" },
            { name: "GHK-Cu", dose: "2mg/dia", role: "Reparo celular e síntese de colágeno" },
        ],
        duration: "8-12 semanas",
        difficulty: "Iniciante",
    },
    {
        name: "Performance Máxima",
        goal: "Performance & Resistência",
        color: "from-blue-600/15 to-blue-500/5",
        border: "border-blue-500/20",
        badge: "bg-blue-500/15 text-blue-400",
        peptides: [
            { name: "CJC-1295 NO DAC", dose: "1mg/semana", role: "Estimula liberação pulsátil de GH" },
            { name: "Ipamorelin", dose: "300mcg 3x/dia", role: "Secretagogo seletivo de GH sem cortisol" },
            { name: "BPC-157", dose: "250mcg/dia", role: "Proteção e recuperação muscular" },
        ],
        duration: "12 semanas",
        difficulty: "Intermediário",
    },
    {
        name: "Anti-Aging Avançado",
        goal: "Longevidade & Anti-Aging",
        color: "from-violet-600/15 to-violet-500/5",
        border: "border-violet-500/20",
        badge: "bg-violet-500/15 text-violet-400",
        peptides: [
            { name: "Epithalon", dose: "10mg/dia por 10 dias", role: "Telomerase e rejuvenescimento celular" },
            { name: "GHK-Cu", dose: "2mg/dia", role: "Renovação cutânea e reparação de DNA" },
            { name: "Cartalax", dose: "5mg/dia por 10 dias", role: "Saúde articular e longevidade" },
        ],
        duration: "2x ao ano",
        difficulty: "Avançado",
    },
    {
        name: "Emagrecimento",
        goal: "Perda de Gordura",
        color: "from-pink-600/15 to-pink-500/5",
        border: "border-pink-500/20",
        badge: "bg-pink-500/15 text-pink-400",
        peptides: [
            { name: "AOD-9604", dose: "300mcg/dia", role: "Fragmento de GH que metaboliza gordura" },
            { name: "CJC-1295 + Ipamorelin", dose: "Combinado", role: "Aumenta GH endógeno e lipólise" },
        ],
        duration: "12-16 semanas",
        difficulty: "Intermediário",
    },
    {
        name: "Focus Cognitivo",
        goal: "Nootrópico & Cognição",
        color: "from-amber-600/15 to-amber-500/5",
        border: "border-amber-500/20",
        badge: "bg-amber-500/15 text-amber-400",
        peptides: [
            { name: "Semax", dose: "600mcg/dia intranasal", role: "BDNF, memória e foco" },
            { name: "Selank", dose: "250mcg/dia", role: "Ansiolítico sem sedação, clareza mental" },
            { name: "Adamax", dose: "10mg/dose", role: "Neuroproteção e plasticidade sináptica" },
        ],
        duration: "4-8 semanas",
        difficulty: "Iniciante",
    },
];

export default function StacksPage() {
    return (
        <ClientLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Biblioteca de Stacks</h1>
                    <p className="text-slate-400 text-sm">Combinações validadas de peptídeos para objetivos específicos.</p>
                </div>

                <div className="space-y-5">
                    {STACKS.map(s => (
                        <div key={s.name} className={`glass-card p-6 bg-gradient-to-br ${s.color} border ${s.border}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Layers className="w-4 h-4 text-slate-400" />
                                        <h2 className="font-bold text-white">{s.name}</h2>
                                    </div>
                                    <p className="text-slate-400 text-sm">{s.goal}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${s.badge}`}>{s.difficulty}</span>
                                    <span className="text-xs text-slate-500">{s.duration}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {s.peptides.map(p => (
                                    <div key={p.name} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <span className="font-semibold text-white text-sm">{p.name}</span>
                                            <span className="text-xs text-brand-400 ml-2">{p.dose}</span>
                                            <p className="text-xs text-slate-400 mt-0.5">{p.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ClientLayout>
    );
}
