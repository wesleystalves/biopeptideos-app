"use client";

import ClientLayout from "@/components/client-layout";
import { BookOpen, Clock, User2, ChevronRight } from "lucide-react";
import Link from "next/link";

const GUIDES = [
    {
        category: "Iniciante",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        items: [
            { title: "O que são peptídeos?", desc: "Introdução completa ao mundo dos peptídeos biorregulatórios.", time: "8 min", author: "Dr. Equipe Bio" },
            { title: "Segurança e legislação no Brasil", desc: "O que é legal, o que não é e como usar com responsabilidade.", time: "10 min", author: "Dr. Equipe Bio" },
            { title: "Como reconstituir peptídeos", desc: "Passo a passo de reconstituição com água bacteriostática.", time: "5 min", author: "Dr. Equipe Bio" },
            { title: "Armazenamento correto", desc: "Temperatura, luz e estabilidade de cada tipo de peptídeo.", time: "4 min", author: "Dr. Equipe Bio" },
        ],
    },
    {
        category: "Avançado",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        items: [
            { title: "Ciclos pulsáteis de GH", desc: "Como estruturar protocolos de secretagogos de GH como um profissional.", time: "15 min", author: "Dr. Equipe Bio" },
            { title: "BPC-157 vs TB-500: análise completa", desc: "Comparação mecanística e quando combinar os dois.", time: "12 min", author: "Dr. Equipe Bio" },
            { title: "Peptídeos Russos — Semax e Selank", desc: "Guia clínico dos nootrópicos peptídicos da ciência soviética.", time: "18 min", author: "Dr. Equipe Bio" },
        ],
    },
    {
        category: "Protocolos Clínicos",
        color: "text-violet-400",
        bg: "bg-violet-500/10",
        items: [
            { title: "Protocolo Anti-aging com Epithalon", desc: "O peptídeo da longevidade: como usar o protocolo de 10 dias.", time: "10 min", author: "Dr. Equipe Bio" },
            { title: "Emagrecimento com AOD-9604", desc: "O protocolo completo com o fragmento de GH para perda de gordura.", time: "8 min", author: "Dr. Equipe Bio" },
        ],
    },
];

export default function LearnPage() {
    return (
        <ClientLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Aprender</h1>
                    <p className="text-slate-400 text-sm">Base de conhecimento científica sobre peptídeos, protocolos e uso seguro.</p>
                </div>

                {GUIDES.map(g => (
                    <div key={g.category}>
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${g.bg} ${g.color}`}>{g.category}</span>
                        </div>
                        <div className="space-y-3">
                            {g.items.map(item => (
                                <div key={item.title} className="glass-card p-5 hover:border-white/15 transition-all group cursor-pointer">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                                <BookOpen className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white mb-1 group-hover:text-brand-300 transition-colors">{item.title}</h3>
                                                <p className="text-sm text-slate-400">{item.desc}</p>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
                                                    <span className="flex items-center gap-1"><User2 className="w-3 h-3" />{item.author}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors flex-shrink-0 mt-1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </ClientLayout>
    );
}
