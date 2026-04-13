"use client";

import ClientLayout from "@/components/client-layout";
import Link from "next/link";
import { FlaskConical, Search, GitCompare, Calculator, Layers, ShoppingBag, ArrowRight, Zap, Activity, BookOpen } from "lucide-react";

const quickAccess = [
    { href: "/library", icon: FlaskConical, label: "Biblioteca", desc: "80+ peptídeos catalogados", color: "from-blue-600/20 to-blue-500/5", border: "border-blue-500/20", iconColor: "text-blue-400" },
    { href: "/finder", icon: Search, label: "Encontre o Seu", desc: "Quiz inteligente de objetivos", color: "from-emerald-600/20 to-emerald-500/5", border: "border-emerald-500/20", iconColor: "text-emerald-400" },
    { href: "/compare", icon: GitCompare, label: "Comparar", desc: "Compare peptídeos lado a lado", color: "from-violet-600/20 to-violet-500/5", border: "border-violet-500/20", iconColor: "text-violet-400" },
    { href: "/calculator", icon: Calculator, label: "Calculadora", desc: "Calcule sua dosagem exata", color: "from-amber-600/20 to-amber-500/5", border: "border-amber-500/20", iconColor: "text-amber-400" },
    { href: "/stacks", icon: Layers, label: "Stacks", desc: "Combinações por objetivo", color: "from-pink-600/20 to-pink-500/5", border: "border-pink-500/20", iconColor: "text-pink-400" },
    { href: "/catalog", icon: ShoppingBag, label: "Loja", desc: "Adquira seus peptídeos", color: "from-teal-600/20 to-teal-500/5", border: "border-teal-500/20", iconColor: "text-teal-400" },
];

const stats = [
    { value: "80+", label: "Peptídeos catalogados", icon: FlaskConical },
    { value: "50+", label: "Protocolos clínicos", icon: BookOpen },
    { value: "3.000+", label: "Profissionais e atletas", icon: Activity },
];

export default function PainelPage() {
    return (
        <ClientLayout>
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Hero */}
                <div className="glass-card p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-transparent pointer-events-none" />
                    <div className="relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-600/15 border border-brand-500/25 text-brand-400 text-xs font-medium mb-4">
                            <Zap className="w-3 h-3" />
                            Acesso Premium Ativo
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            A Wikipedia dos Peptídeos
                        </h1>
                        <p className="text-slate-400 max-w-lg mb-6">
                            Utilize peptídeos com total segurança e precisão. Protocolos baseados em evidências,
                            calculadoras exatas e guias práticos.
                        </p>
                        <Link href="/library" className="btn-primary inline-flex items-center gap-2">
                            Acessar Biblioteca <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {stats.map(({ value, label, icon: Icon }) => (
                        <div key={label} className="glass-card p-5 text-center">
                            <Icon className="w-5 h-5 text-brand-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white mb-1">{value}</div>
                            <div className="text-xs text-slate-400">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Quick access */}
                <div>
                    <h2 className="text-lg font-bold text-white mb-4">Acesso Rápido</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {quickAccess.map(({ href, icon: Icon, label, desc, color, border, iconColor }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`glass-card p-5 bg-gradient-to-br ${color} border ${border} hover:scale-[1.02] transition-all duration-200 group`}
                            >
                                <Icon className={`w-6 h-6 ${iconColor} mb-3`} />
                                <div className="font-semibold text-white text-sm mb-1">{label}</div>
                                <div className="text-xs text-slate-400">{desc}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
