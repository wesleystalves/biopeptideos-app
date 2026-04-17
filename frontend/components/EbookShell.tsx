"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    ArrowLeft, BookOpen, Bookmark, BookmarkCheck, Star, StarOff,
    FileText, ChevronLeft, ChevronRight, Check, Maximize2,
    Minimize2, X, Menu, Calculator
} from "lucide-react";
import { useEbookState } from "@/hooks/useEbookState";

interface Chapter {
    num: string;
    title: string;
    tag: string;
    color: string;
    border: string;
    icon: string;
    content: React.ReactNode;
}

interface EbookShellProps {
    ebookId: "ebook1" | "ebook2";
    title: string;
    subtitle: string;
    chapters: Chapter[];
    user: { email: string; plan: string } | null;
    showCalculator?: boolean;
}

// ─── Inline Markdown renderer ───────────────────────────────────────────────
function renderLine(line: string, i: number, isHighlighted: boolean, onHighlight: () => void) {
    const base = "transition-all duration-200 rounded-lg";
    const hl = isHighlighted ? "bg-yellow-400/10 border-l-2 border-yellow-400 pl-3" : "";

    if (line.startsWith("### ")) return (
        <h3 key={i} className={`text-lg font-bold text-white mt-8 mb-3 first:mt-0 ${base} ${hl}`}
            onClick={onHighlight}>{line.slice(4)}</h3>
    );
    if (line.startsWith("#### ")) return (
        <h4 key={i} className={`text-base font-semibold text-brand-400 mt-6 mb-2 ${base} ${hl}`}
            onClick={onHighlight}>{line.slice(5)}</h4>
    );
    if (line.startsWith("> ")) return (
        <blockquote key={i} onClick={onHighlight}
            className={`border-l-2 border-brand-500 pl-4 my-4 text-brand-300 italic cursor-pointer ${base} ${hl}`}>
            {line.slice(2)}
        </blockquote>
    );
    if (line.startsWith("- ")) return (
        <li key={i} onClick={onHighlight}
            className={`text-slate-300 mb-2 ml-5 list-disc cursor-pointer ${base} ${hl}`}
            dangerouslySetInnerHTML={{
                __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
            }} />
    );
    if (line.startsWith("---")) return <hr key={i} className="border-white/10 my-6" />;
    if (line.trim() === "") return <div key={i} className="h-2" />;

    return (
        <p key={i} onClick={onHighlight}
            className={`text-slate-300 leading-relaxed mb-3 cursor-pointer ${base} ${hl}`}
            dangerouslySetInnerHTML={{
                __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
            }} />
    );
}

// ─── Dosage Calculator ──────────────────────────────────────────────────────
function DosageCalculator({ onClose }: { onClose: () => void }) {
    const [mg, setMg] = useState("10");
    const [ml, setMl] = useState("2");
    const result = parseFloat(mg) && parseFloat(ml)
        ? {
            conc: (parseFloat(mg) / parseFloat(ml)).toFixed(2),
            per10u: ((parseFloat(mg) / parseFloat(ml)) / 10).toFixed(3),
            per5u: ((parseFloat(mg) / parseFloat(ml)) / 20).toFixed(3),
        } : null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}>
            <div className="w-full max-w-sm rounded-2xl border border-white/10 p-6 animate-slide-up"
                style={{ background: "rgba(5, 20, 38, 0.97)" }}
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-brand-400" />
                        <span className="font-bold text-white">Calculadora de Dose</span>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 mb-1.5 block">Quantidade no frasco (mg)</label>
                        <input
                            type="number" value={mg} onChange={(e) => setMg(e.target.value)}
                            className="input text-white" placeholder="ex: 10"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 mb-1.5 block">BAC water adicionada (ml)</label>
                        <input
                            type="number" value={ml} onChange={(e) => setMl(e.target.value)}
                            className="input text-white" placeholder="ex: 2"
                        />
                    </div>

                    {result && (
                        <div className="glass-card p-4 space-y-2 border border-brand-500/20 bg-brand-600/10">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Concentração:</span>
                                <span className="text-white font-bold">{result.conc} mg/ml</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">10 units =</span>
                                <span className="text-brand-400 font-bold">{result.per10u} mg ({parseFloat(result.per10u) * 1000}mcg)</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">5 units =</span>
                                <span className="text-brand-400 font-bold">{result.per5u} mg ({parseFloat(result.per5u) * 1000}mcg)</span>
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-xs text-slate-600 mt-4">Baseado na Regra das 100 Units — Cap. 2</p>
            </div>
        </div>
    );
}

// ─── Note Editor ─────────────────────────────────────────────────────────────
function NoteEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-500 font-medium">Minha anotação</span>
            </div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Adicione suas anotações sobre este capítulo..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-brand-500/50 transition-colors"
            />
            {value && <p className="text-xs text-accent-500 mt-1">✓ Salvo automaticamente</p>}
        </div>
    );
}

// ─── Main EbookShell ──────────────────────────────────────────────────────────
export default function EbookShell({ ebookId, title, subtitle, chapters, user, showCalculator = false }: EbookShellProps) {
    const { state, setChapter, toggleBookmark, toggleHighlight, saveNote } = useEbookState(ebookId);
    const [activeChapter, setActiveChapterLocal] = useState(state.lastChapter);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [showCalc, setShowCalc] = useState(false);
    const [noteText, setNoteText] = useState("");
    const contentRef = useRef<HTMLDivElement>(null);

    // Restore last chapter
    useEffect(() => {
        setActiveChapterLocal(state.lastChapter);
    }, [state.lastChapter]);

    // Load note for current chapter
    useEffect(() => {
        setNoteText(state.notes[activeChapter] ?? "");
    }, [activeChapter, state.notes]);

    // Auto-save note with debounce
    useEffect(() => {
        const t = setTimeout(() => saveNote(activeChapter, noteText), 800);
        return () => clearTimeout(t);
    }, [noteText, activeChapter, saveNote]);

    const goToChapter = (idx: number) => {
        setActiveChapterLocal(idx);
        setChapter(idx);
        setSidebarOpen(false);
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const chapter = chapters[activeChapter];
    const totalChapters = chapters.length;
    const progressPct = Math.round((state.readChapters.length / totalChapters) * 100);
    const isBookmarked = state.bookmarks.includes(activeChapter);
    const chapterHighlights = state.highlights[activeChapter] ?? [];
    const hasNote = !!(state.notes[activeChapter]?.trim());

    // Render chapter content
    const renderContent = () => {
        if (typeof chapter.content === "string") {
            return (chapter.content as string).split("\n").map((line, i) => {
                const bk = `line-${i}`;
                const isHl = chapterHighlights.includes(bk);
                return renderLine(line, i, isHl, () => toggleHighlight(activeChapter, bk));
            });
        }
        return chapter.content;
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* ── Progress bar (fixed top) ── */}
            <div className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-white/5">
                <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
                    style={{ width: `${progressPct}%` }} />
            </div>

            <div className="flex flex-1 min-h-screen pt-0.5">
                {/* ────────────────────── SIDEBAR ────────────────────── */}
                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                        onClick={() => setSidebarOpen(false)} />
                )}

                <aside className={`
                    fixed top-0 left-0 h-full z-40 w-[280px] flex flex-col
                    border-r border-white/10 transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    ${!focusMode ? "lg:relative lg:translate-x-0 lg:w-72 xl:w-80" : "lg:-translate-x-full"}
                `} style={{ background: "rgba(5, 20, 38, 0.95)", backdropFilter: "blur(20px)" }}>
                    {/* SIDEBAR HEADER */}
                    <div className="px-4 py-4 border-b border-white/10 flex-shrink-0">
                        <div className="flex items-center justify-between mb-3">
                            <Link href="/painel" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs">
                                <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Painel
                            </Link>
                            <button onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-bold text-sm text-white leading-tight truncate">{title}</div>
                                <div className="text-xs text-slate-400 truncate">{subtitle}</div>
                            </div>
                        </div>
                        {/* Progress */}
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>Progresso</span>
                                <span>{progressPct}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPct}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR NAV */}
                    <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                        {/* Bookmarks section */}
                        {state.bookmarks.length > 0 && (
                            <div className="mb-3">
                                <div className="px-2 pb-1 text-xs text-slate-600 font-semibold uppercase tracking-wider">Favoritos</div>
                                {state.bookmarks.map((bi) => (
                                    <button key={`bm-${bi}`} onClick={() => goToChapter(bi)}
                                        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-yellow-400 hover:bg-yellow-400/10 transition-colors">
                                        <Bookmark className="w-3 h-3 flex-shrink-0 fill-yellow-400" />
                                        <span className="truncate">{chapters[bi]?.title}</span>
                                    </button>
                                ))}
                                <div className="my-2 border-t border-white/5" />
                            </div>
                        )}

                        <div className="px-2 pb-1 text-xs text-slate-600 font-semibold uppercase tracking-wider">
                            {totalChapters} capítulos
                        </div>
                        {chapters.map((ch, i) => {
                            const isActive = activeChapter === i;
                            const isRead = state.readChapters.includes(i);
                            const isBm = state.bookmarks.includes(i);
                            const hasNoteI = !!(state.notes[i]?.trim());
                            return (
                                <button key={ch.num} onClick={() => goToChapter(i)}
                                    className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all border ${isActive
                                        ? "bg-brand-600/15 text-brand-400 border-brand-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5 border-transparent"
                                        }`}>
                                    <span className={`flex-shrink-0 font-bold text-xs mt-0.5 ${isActive ? "text-brand-400" : "text-slate-600"}`}>
                                        {ch.num}
                                    </span>
                                    <span className="flex-1 leading-snug text-xs sm:text-sm">{ch.title}</span>
                                    <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                                        {hasNoteI && <FileText className="w-3 h-3 text-slate-600" />}
                                        {isBm && <Bookmark className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                                        {isRead && !isActive && <Check className="w-3 h-3 text-accent-500" />}
                                    </div>
                                </button>
                            );
                        })}
                    </nav>

                    {/* SIDEBAR FOOTER */}
                    <div className="p-3 border-t border-white/10 flex-shrink-0">
                        {/* Calculator button (ebook2 only) */}
                        {showCalculator && (
                            <button onClick={() => { setShowCalc(true); setSidebarOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-emerald-400 hover:bg-emerald-400/10 border border-emerald-500/20 mb-2 transition-colors">
                                <Calculator className="w-4 h-4" />
                                Calculadora de Dose
                            </button>
                        )}
                        {user && (
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-brand-400">
                                        {user.email?.[0]?.toUpperCase() ?? "U"}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs text-slate-300 truncate">{user.email}</div>
                                    <div className="text-xs text-brand-400 font-medium capitalize">{user.plan}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* ────────────────────── MAIN CONTENT ────────────────────── */}
                <main ref={contentRef} className="flex-1 min-w-0 overflow-x-hidden">
                    {/* MOBILE/DESKTOP TOPBAR */}
                    <div className="sticky top-0.5 z-20 border-b border-white/5 flex items-center gap-3 px-4 py-3"
                        style={{ background: "rgba(5, 20, 38, 0.9)", backdropFilter: "blur(12px)" }}>
                        {/* Hamburger */}
                        {!focusMode && (
                            <button onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden flex-shrink-0 p-2 rounded-xl hover:bg-white/10 transition-colors -ml-1">
                                <Menu className="w-5 h-5 text-slate-400" />
                            </button>
                        )}

                        {/* Chapter mini info */}
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-slate-500 truncate hidden sm:block">{title}</div>
                            <div className="text-sm font-medium text-white truncate leading-tight">{chapter.title}</div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                            {/* Bookmark */}
                            <button onClick={() => toggleBookmark(activeChapter)}
                                title={isBookmarked ? "Remover favorito" : "Favoritar"}
                                className={`p-2 rounded-xl transition-all ${isBookmarked ? "text-yellow-400 bg-yellow-400/10" : "text-slate-500 hover:text-yellow-400 hover:bg-yellow-400/10"}`}>
                                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                            </button>
                            {/* Notes */}
                            <button onClick={() => setShowNotes(!showNotes)}
                                title="Anotações"
                                className={`p-2 rounded-xl transition-all ${(showNotes || hasNote) ? "text-brand-400 bg-brand-400/10" : "text-slate-500 hover:text-brand-400 hover:bg-brand-400/10"}`}>
                                <FileText className="w-4 h-4" />
                            </button>
                            {/* Focus mode (desktop only) */}
                            <button onClick={() => setFocusMode(!focusMode)}
                                title="Modo foco"
                                className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                                {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                            {/* Calculator (mobile) */}
                            {showCalculator && (
                                <button onClick={() => setShowCalc(true)}
                                    title="Calculadora"
                                    className="p-2 rounded-xl text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all">
                                    <Calculator className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* CHAPTER CONTENT */}
                    <div className={`mx-auto px-4 sm:px-6 py-6 pb-32 ${focusMode ? "max-w-2xl" : "max-w-3xl"}`}>
                        {/* Chapter header card */}
                        <div className={`glass-card p-5 sm:p-6 mb-6 bg-gradient-to-br ${chapter.color} border ${chapter.border}`}>
                            <div className="flex items-start gap-3 sm:gap-4">
                                <span className="text-3xl sm:text-4xl flex-shrink-0">{chapter.icon}</span>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                                            Cap. {chapter.num}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-brand-600/20 border border-brand-500/20 text-brand-400 text-xs font-medium">
                                            {chapter.tag}
                                        </span>
                                    </div>
                                    <h1 className="text-lg sm:text-xl font-bold text-white leading-snug">{chapter.title}</h1>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="glass-card p-5 sm:p-8">
                            <div className="text-sm sm:text-base">
                                {renderContent()}
                            </div>

                            {/* Notes */}
                            {showNotes && (
                                <NoteEditor value={noteText} onChange={setNoteText} />
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-6">
                            <button onClick={() => goToChapter(Math.max(0, activeChapter - 1))}
                                disabled={activeChapter === 0}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95">
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Anterior</span>
                            </button>

                            <div className="text-center">
                                <div className="text-xs text-slate-500">{activeChapter + 1} / {totalChapters}</div>
                                <div className="text-xs text-slate-600 mt-0.5">{progressPct}% completo</div>
                            </div>

                            <button onClick={() => goToChapter(Math.min(totalChapters - 1, activeChapter + 1))}
                                disabled={activeChapter === totalChapters - 1}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-glow">
                                <span className="hidden sm:inline">Próximo</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* ── MOBILE BOTTOM CHAPTER BAR ── */}
            <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden border-t border-white/10"
                style={{ background: "rgba(5, 20, 38, 0.95)", backdropFilter: "blur(16px)" }}>
                <div className="flex overflow-x-auto scrollbar-hide py-2.5 px-3 gap-1.5">
                    {chapters.map((ch, i) => {
                        const isRead = state.readChapters.includes(i);
                        return (
                            <button key={ch.num} onClick={() => goToChapter(i)}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeChapter === i
                                    ? "bg-brand-600 text-white"
                                    : isRead
                                        ? "text-accent-500 bg-accent-500/10"
                                        : "text-slate-400 bg-white/5 hover:bg-white/10"
                                    }`}>
                                <span>{ch.icon}</span>
                                <span>{ch.num}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── DOSAGE CALCULATOR MODAL ── */}
            {showCalc && <DosageCalculator onClose={() => setShowCalc(false)} />}
        </div>
    );
}
