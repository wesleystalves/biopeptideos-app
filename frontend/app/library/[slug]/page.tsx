"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ClientLayout from "@/components/client-layout";
import { findBySlug, type Peptide } from "@/lib/peptides-data";
import { getPeptideDetail, type PeptideDetail } from "@/lib/peptides-detail-data";
import {
    ArrowLeft, FlaskConical, ShoppingBag, CheckCircle2,
    AlertTriangle, X, ChevronRight, Zap, Clock,
    BookOpen, Link2, Shield
} from "lucide-react";
import Link from "next/link";

// ── Aviso Legal Modal ──────────────────────────────────────────────
function DisclaimerModal({ onAccept }: { onAccept: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Aviso Importante</h2>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                    Esta plataforma é exclusivamente para <strong className="text-white">fins educacionais e informativos</strong>. Todo o conteúdo é baseado em estudos científicos publicados e tem caráter de referência acadêmica.
                </p>
                <p className="text-sm font-semibold text-white">
                    Nenhuma informação aqui constitui recomendação médica, prescrição ou incentivo ao uso de qualquer substância.
                    <span className="text-slate-300 font-normal"> Consulte sempre um profissional de saúde habilitado antes de iniciar qualquer protocolo.</span>
                </p>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs text-amber-300">
                        💡 O uso de peptídeos requer acompanhamento médico. A BioPeptideos não se responsabiliza pelo uso indevido das informações aqui apresentadas.
                    </p>
                </div>
                <button
                    onClick={onAccept}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all"
                >
                    Entendi e Aceito
                </button>
            </div>
        </div>
    );
}

// ── Evidence Level badge ──────────────────────────────────────────
function EvidenceBadge({ level }: { level: string }) {
    const colors: Record<string, string> = {
        'Aprovado (FDA/EMA)': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
        'Clínico Fase III': 'bg-blue-500/15 text-blue-400 border-blue-500/25',
        'Clínico Fase II': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
        'Clínico Fase I': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'Pré-clínico': 'bg-slate-500/15 text-slate-300 border-slate-500/20',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[level] || colors['Pré-clínico']}`}>
            {level}
        </span>
    );
}

// ── Interaction icon ──────────────────────────────────────────────
function InteractionIcon({ type }: { type: string }) {
    if (type === 'synergic') return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
    if (type === 'compatible') return <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />;
    if (type === 'monitor') return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
    return <X className="w-4 h-4 text-red-400 flex-shrink-0" />;
}

type Tab = 'overview' | 'protocol' | 'science' | 'stacks';

// ── Main Page ─────────────────────────────────────────────────────
export default function PeptideDetailPage() {
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const [peptide, setPeptide] = useState<Peptide | null | undefined>(undefined);
    const [detail, setDetail] = useState<PeptideDetail | undefined>(undefined);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    useEffect(() => {
        if (!slug) { setPeptide(null); return; }
        const found = findBySlug(slug as string);
        setPeptide(found ?? null);
        if (found) {
            setDetail(getPeptideDetail(found.id));
            const dismissed = sessionStorage.getItem('disclaimer-dismissed');
            if (!dismissed) setShowDisclaimer(true);
        }
    }, [slug]);

    function acceptDisclaimer() {
        sessionStorage.setItem('disclaimer-dismissed', '1');
        setShowDisclaimer(false);
    }

    if (peptide === undefined) return null;

    if (peptide === null) {
        return (
            <ClientLayout>
                <div className="max-w-2xl mx-auto text-center py-20">
                    <FlaskConical className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-white mb-2">Peptídeo não encontrado</h1>
                    <p className="text-slate-400 mb-6">O peptídeo "{slug}" não existe na nossa base.</p>
                    <Link href="/library" className="btn-primary inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Voltar à Biblioteca
                    </Link>
                </div>
            </ClientLayout>
        );
    }

    const d = detail;
    // Derived data — fallback to basic when no Pi detail available
    const displayBenefits = d?.benefits?.length ? d.benefits : peptide.benefits;
    const displayWhatIs = d?.whatIs || peptide.description;
    const tabs: { id: Tab; label: string }[] = [
        { id: 'overview', label: '📋 Visão Geral' },
        { id: 'protocol', label: '💉 Protocolo' },
        { id: 'science', label: '🔬 Mecanismo' },
        { id: 'stacks', label: '⚡ Stacks' },
    ];

    return (
        <>
            {showDisclaimer && <DisclaimerModal onAccept={acceptDisclaimer} />}
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
                                    <img src={peptide.imageUrl} alt={peptide.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
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

                                {/* Classification + half-life */}
                                {d && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                            <div className="text-xs text-slate-500 mb-1">Classificação</div>
                                            <div className="text-xs text-white font-medium leading-tight">{d.classification}</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                                                <Clock className="w-3 h-3" /> Meia-Vida
                                            </div>
                                            <div className="text-xs text-white font-medium">{d.halfLife}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Badges */}
                                {d && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <EvidenceBadge level={d.evidenceLevel} />
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${d.reconstitutionDifficulty === 'Fácil' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                            Reconstituição: {d.reconstitutionDifficulty}
                                        </span>
                                    </div>
                                )}

                                {/* Variants */}
                                {peptide.variants.length > 0 && (
                                    <div>
                                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">Apresentações</div>
                                        <div className="flex flex-wrap gap-2">
                                            {peptide.variants.map(v => (
                                                <span key={v} className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg">{v}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Alternative names */}
                                {d && d.alternativeNames.length > 0 && (
                                    <div className="text-xs text-slate-500">
                                        Também conhecido como: {d.alternativeNames.join(', ')}
                                    </div>
                                )}

                                {/* CTA */}
                                <Link href="/catalog" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all">
                                    <ShoppingBag className="w-4 h-4" /> Ver na Loja
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Tabs — always visible */}
                    <div className="flex gap-1 glass-card p-1 overflow-x-auto">
                        {tabs.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`flex-shrink-0 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* ── TAB: VISÃO GERAL ── */}
                    {activeTab === 'overview' && (
                        <div className="space-y-5">
                            {/* What Is */}
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-brand-400" /> O Que É {peptide.name}
                                </h2>
                                <p className="text-slate-300 leading-relaxed text-sm">{displayWhatIs}</p>
                            </div>

                            {/* Benefits */}
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-bold text-white mb-4">✅ Benefícios Comprovados</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {displayBenefits.map((b, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-200 text-sm">{b}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Timeline (if available) */}
                            {d?.timeline && d.timeline.length > 0 && (
                                <div className="glass-card p-6">
                                    <h2 className="text-lg font-bold text-white mb-4">⏱️ Linha do Tempo</h2>
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-brand-600/30" />
                                        <div className="space-y-4">
                                            {d.timeline.map((t, i) => (
                                                <div key={i} className="flex gap-4 pl-2">
                                                    <div className="w-6 h-6 rounded-full bg-brand-600 border-2 border-brand-400 flex-shrink-0 flex items-center justify-center z-10">
                                                        <span className="text-[10px] text-white font-bold">{i + 1}</span>
                                                    </div>
                                                    <div className="pb-2">
                                                        <div className="text-sm font-semibold text-brand-300">{t.period}</div>
                                                        <div className="text-xs text-slate-400 mt-0.5">{t.description}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
                                    <div className="text-blue-400 font-semibold text-sm mb-1">⚖️ Comparar</div>
                                    <div className="text-slate-400 text-xs">Compare com outro peptídeo</div>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ── TAB: PROTOCOLO ── */}
                    {activeTab === 'protocol' && (
                        <div className="space-y-5">
                            {d?.protocol && (
                                <div className="glass-card p-6">
                                    <h2 className="text-lg font-bold text-white mb-1">{d.protocol.title}</h2>
                                    <p className="text-sm text-brand-400 mb-4">{d.protocol.route}</p>
                                    <div className="space-y-3">
                                        {d.protocol.phases.map((phase, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div className="w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-brand-400 text-xs font-bold">{i + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-semibold text-white mb-0.5">{phase.phase}</div>
                                                    <div className="text-xs text-brand-300">{phase.dose}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">{phase.units}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {d?.dosageByIndication && d.dosageByIndication.length > 0 && (
                                <div className="glass-card overflow-hidden">
                                    <div className="p-5 border-b border-white/5">
                                        <h2 className="font-bold text-white">📊 Dosagem por Indicação</h2>
                                    </div>
                                    <div className="divide-y divide-white/5">
                                        {d.dosageByIndication.map((item, i) => (
                                            <div key={i} className="p-4">
                                                <div className="font-medium text-white text-sm mb-2">{item.indication}</div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div>
                                                        <div className="text-[10px] text-slate-500 uppercase">Dose</div>
                                                        <div className="text-sm text-brand-400 font-medium">{item.dose}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-500 uppercase">Frequência</div>
                                                        <div className="text-xs text-slate-300">{item.frequency}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-500 uppercase">Duração</div>
                                                        <div className="text-xs text-slate-300">{item.duration}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {d?.reconstitution && d.reconstitution.length > 0 && (
                                <div className="glass-card p-6">
                                    <h2 className="font-bold text-white mb-4">💧 Reconstituição</h2>
                                    <ol className="space-y-2">
                                        {d.reconstitution.map((step, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                                <span className="w-5 h-5 rounded-full bg-brand-600/20 border border-brand-500/25 text-brand-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            {/* If no protocol data yet */}
                            {!d?.protocol && !d?.dosageByIndication?.length && (
                                <div className="glass-card p-12 text-center">
                                    <Shield className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                                    <p className="text-slate-400 text-sm">Protocolo detalhado em breve.</p>
                                    <p className="text-slate-500 text-xs mt-2">Consulte um profissional de saúde para orientação personalizada.</p>
                                </div>
                            )}

                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <p className="text-amber-400 text-xs flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    Fins educacionais. Consulte sempre um profissional de saúde qualificado antes de iniciar qualquer protocolo.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── TAB: MECANISMO ── */}
                    {activeTab === 'science' && (
                        <div className="space-y-5">
                            {d?.mechanism && d.mechanism.length > 0 && (
                                <div className="glass-card p-6">
                                    <h2 className="text-lg font-bold text-white mb-4">⚙️ Mecanismo de Ação</h2>
                                    <div className="space-y-3">
                                        {d.mechanism.map((step, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
                                                <span className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/25 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                                                <span className="text-sm text-slate-300">{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {d?.mechanismDetailed && (
                                <div className="glass-card p-6">
                                    <h2 className="font-bold text-white mb-3">📖 Explicação Detalhada</h2>
                                    <p className="text-slate-300 text-sm leading-relaxed">{d.mechanismDetailed}</p>
                                </div>
                            )}

                            {!d?.mechanism?.length && !d?.mechanismDetailed && (
                                <div className="glass-card p-12 text-center">
                                    <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                                    <p className="text-slate-400 text-sm">Documentação científica em expansão.</p>
                                    <p className="text-slate-500 text-xs mt-2">Este peptídeo ainda não possui mecanismo detalhado na base de dados.</p>
                                </div>
                            )}

                            {d?.references && d.references.length > 0 && (
                                <div className="glass-card p-6">
                                    <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-brand-400" /> Estudos & Referências
                                    </h2>
                                    <div className="space-y-4">
                                        {d.references.map(ref => (
                                            <div key={ref.id} className="p-4 rounded-xl bg-white/3 border border-white/8 space-y-2">
                                                <div className="text-sm font-medium text-white leading-snug">{ref.title}</div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-lg border border-blue-500/20">{ref.source}</span>
                                                    <span className="text-xs text-slate-500">{ref.year}</span>
                                                </div>
                                                <p className="text-xs text-slate-400">{ref.summary}</p>
                                                {ref.pubmedUrl && (
                                                    <a href={ref.pubmedUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                                                        <Link2 className="w-3 h-3" /> PubMed
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── TAB: STACKS ── */}
                    {activeTab === 'stacks' && (
                        <div className="space-y-5">
                            {d?.interactions && d.interactions.length > 0 && (
                                <div className="glass-card overflow-hidden">
                                    <div className="p-5 border-b border-white/5">
                                        <h2 className="font-bold text-white">⚖️ Interações com Outros Peptídeos</h2>
                                    </div>
                                    <div className="divide-y divide-white/5">
                                        {d.interactions.map((inter, i) => (
                                            <div key={i} className="flex items-start gap-3 p-4">
                                                <InteractionIcon type={inter.type} />
                                                <div>
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="font-medium text-white text-sm">{inter.name}</span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${inter.type === 'synergic' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : inter.type === 'compatible' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : inter.type === 'monitor' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                            {inter.type === 'synergic' ? 'Sinérgico' : inter.type === 'compatible' ? 'Compatível' : inter.type === 'monitor' ? 'Monitorar' : 'Evitar'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400">{inter.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {d?.stacks && d.stacks.length > 0 && (
                                <div className="space-y-4">
                                    <h2 className="font-bold text-white text-lg">⚡ Stacks Recomendados</h2>
                                    {d.stacks.map((stack, i) => (
                                        <Link key={i} href="/stacks" className="glass-card p-5 block hover:border-brand-500/30 transition-all group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-bold text-white group-hover:text-brand-300 transition-colors">{stack.name}</h3>
                                                    <p className="text-xs text-brand-400">{stack.goal}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors" />
                                            </div>
                                            <div className="flex gap-2 flex-wrap mb-3">
                                                {stack.peptides.map(p => (
                                                    <span key={p} className="px-2 py-0.5 bg-brand-600/15 text-brand-400 text-xs rounded-full border border-brand-500/20">{p}</span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-400">{stack.description}</p>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {(!d?.stacks?.length && !d?.interactions?.length) && (
                                <div className="glass-card p-12 text-center">
                                    <Zap className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                                    <p className="text-slate-400 text-sm">Stacks para este peptídeo em breve.</p>
                                    <Link href="/stacks" className="btn-primary inline-flex items-center gap-2 mt-4">
                                        Ver Biblioteca de Stacks <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </ClientLayout>
        </>
    );
}
