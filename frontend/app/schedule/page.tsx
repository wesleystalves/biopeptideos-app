"use client";

import { useState } from "react";
import ClientLayout from "@/components/client-layout";
import { ChevronLeft, ChevronRight, Plus, Check } from "lucide-react";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const SAMPLE_SCHEDULE: Record<string, { peptide: string; dose: string; color: string }[]> = {
    "Mon": [{ peptide: "CJC-1295", dose: "1mg", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" }],
    "Wed": [{ peptide: "Ipamorelin", dose: "300mcg", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" }],
    "Fri": [{ peptide: "BPC-157", dose: "250mcg", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" }],
};

export default function SchedulePage() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth());
    const [year, setYear] = useState(now.getFullYear());

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const dose_days = [1, 4, 8, 11, 15, 18, 22, 25, 29];

    return (
        <ClientLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Cronograma</h1>
                    <p className="text-slate-400 text-sm">Planeje e acompanhe suas doses e ciclos de peptídeos.</p>
                </div>

                {/* Calendar */}
                <div className="glass-card overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-white/5">
                        <button onClick={() => { const d = new Date(year, month - 1); setMonth(d.getMonth()); setYear(d.getFullYear()); }} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <h2 className="font-bold text-white">{MONTHS[month]} {year}</h2>
                        <button onClick={() => { const d = new Date(year, month + 1); setMonth(d.getMonth()); setYear(d.getFullYear()); }} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Day labels */}
                    <div className="grid grid-cols-7 border-b border-white/5">
                        {DAYS.map(d => (
                            <div key={d} className="p-2.5 text-center text-xs text-slate-500 font-medium">{d}</div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7">
                        {cells.map((day, i) => {
                            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                            const hasDose = day && dose_days.includes(day);
                            return (
                                <div
                                    key={i}
                                    className={`min-h-[60px] p-2 border-b border-r border-white/5 relative transition-colors ${day ? "hover:bg-white/3 cursor-pointer" : ""
                                        }`}
                                >
                                    {day && (
                                        <>
                                            <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-brand-600 text-white" : "text-slate-400"
                                                }`}>{day}</span>
                                            {hasDose && (
                                                <div className="mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-600/20 text-brand-400 border border-brand-500/20">
                                                    Dose
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legenda */}
                <div className="glass-card p-5">
                    <h2 className="font-semibold text-white text-sm mb-3">Ciclo Atual</h2>
                    <div className="space-y-2.5">
                        {[
                            { peptide: "CJC-1295 NO DAC", schedule: "2x/semana", dose: "1mg", start: "01/04", end: "30/06", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
                            { peptide: "Ipamorelin", schedule: "Diário (manhã)", dose: "300mcg", start: "01/04", end: "30/06", color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
                            { peptide: "BPC-157", schedule: "Seg, Qua, Sex", dose: "250mcg", start: "01/04", end: "31/05", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
                        ].map(item => (
                            <div key={item.peptide} className={`flex items-center gap-3 p-3 rounded-xl border ${item.color}`}>
                                <Check className="w-4 h-4 flex-shrink-0" />
                                <div className="flex-1">
                                    <span className="font-medium text-white text-sm">{item.peptide}</span>
                                    <span className="text-xs ml-2 opacity-70">{item.schedule} · {item.dose}</span>
                                </div>
                                <span className="text-xs opacity-60">{item.start} – {item.end}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
