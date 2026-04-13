"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClientLayout from "@/components/client-layout";
import { findBySlug, type Peptide } from "@/lib/peptides-data";
import { ArrowLeft, FlaskConical, ShoppingBag, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PeptideDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const [peptide, setPeptide] = useState<Peptide | null | undefined>(undefined);

    useEffect(() => {
        if (!slug) { setPeptide(null); return; }
        const found = findBySlug(slug as string);
        setPeptide(found ?? null);
    }, [slug]);

    if (peptide === undefined) return null; // loading

    if (peptide === null) {
        return (
            <ClientLayout>
                <div className="max-w-2xl mx-auto text-center py-20">
                    <FlaskConical className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-white mb-2">Peptídeo não encontrado</h1>
                    <p className="text-slate-400 mb-6">O peptídeo "{slug}" não existe na nossa base de dados.</p>
                    <Link href="/library" className="btn-primary inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Voltar à Biblioteca
                    </Link>
                </div>
            </ClientLayout>
        );
    }

    return (
        <ClientLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Back */}
                <Link href="/library" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Biblioteca de Peptídeos
                </Link>

                {/* Hero */}
                <div className="glass-card overflow-hidden">
                    <div className="grid md:grid-cols-[320px_1fr]">
                        {/* Image */}
                        <div className="relative bg-gradient-to-br from-brand-900/40 to-black h-56 md:h-auto">
                            {peptide.imageUrl ? (
                                <img
                                    src={peptide.imageUrl}
                                    alt={peptide.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FlaskConical className="w-16 h-16 text-brand-500/30" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-brand-600/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                {peptide.category}
                            </span>
                        </div>

                        {/* Info */}
                        <div className="p-6 space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">{peptide.name}</h1>
                                <p className="text-slate-300 leading-relaxed">{peptide.description}</p>
                            </div>

                            {/* Variants */}
                            {peptide.variants.length > 0 && (
                                <div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">Apresentações</div>
                                    <div className="flex flex-wrap gap-2">
                                        {peptide.variants.map(v => (
                                            <span key={v} className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg">
                                                {v}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <Link
                                href="/catalog"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all"
                            >
                                <ShoppingBag className="w-4 h-4" /> Ver na Loja
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Benefits */}
                {peptide.benefits.length > 0 && (
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Benefícios</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {peptide.benefits.map(b => (
                                <div key={b} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span className="text-slate-200 text-sm">{b}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Link href="/calculator" className="glass-card p-4 hover:border-brand-500/30 transition-all text-center">
                        <div className="text-brand-400 font-semibold text-sm mb-1">🧮 Calculadora</div>
                        <div className="text-slate-400 text-xs">Calcule a dosagem exata</div>
                    </Link>
                    <Link href={`/compare?a=${peptide.slug}`} className="glass-card p-4 hover:border-brand-500/30 transition-all text-center">
                        <div className="text-violet-400 font-semibold text-sm mb-1">⚖️ Comparar</div>
                        <div className="text-slate-400 text-xs">Compare com outro peptídeo</div>
                    </Link>
                </div>
            </div>
        </ClientLayout>
    );
}
