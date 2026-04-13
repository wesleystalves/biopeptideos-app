"use client";

import { useState, useMemo } from "react";
import ClientLayout from "@/components/client-layout";

/* ── Dados do clone ──────────────────────────────────────── */
const SYRINGES = [
    { label: "0.3 ml (30 UI)", ml: 0.3, ui: 30 },
    { label: "0.5 ml (50 UI)", ml: 0.5, ui: 50 },
    { label: "1.0 ml (100 UI)", ml: 1.0, ui: 100 },
];
const MASS_OPTIONS = [2, 5, 10, 15, 30]; // mg
const WATER_OPTIONS = [1, 2, 3, 5, 6];   // ml
const DOSE_OPTIONS = [50, 100, 250, 500, 1000, 2500]; // mcg

const PROTOCOLS = [
    { name: "BPC-157 Recuperação", mass: 5, water: 2, dose: 250, syringe: 1 },
    { name: "TB-500 Carga", mass: 5, water: 2, dose: 2500, syringe: 2 },
    { name: "MGF Reparo Muscular", mass: 5, water: 2, dose: 200, syringe: 1 },
    { name: "Semaglutida 0.25mg", mass: 5, water: 1, dose: 250, syringe: 2 },
    { name: "Tirzepatida 2.5mg", mass: 10, water: 2, dose: 2500, syringe: 2 },
    { name: "Retatrutide 1mg", mass: 10, water: 2, dose: 1000, syringe: 2 },
    { name: "AOD-9604", mass: 5, water: 2, dose: 250, syringe: 1 },
    { name: "Cagrilintide 300mcg", mass: 5, water: 2, dose: 300, syringe: 2 },
    { name: "Ipamorelin 300mcg", mass: 5, water: 2, dose: 300, syringe: 1 },
    { name: "CJC-1295 NO DAC", mass: 5, water: 2, dose: 1000, syringe: 2 },
    { name: "Epithalon 10mg/dia", mass: 10, water: 2, dose: 10000, syringe: 2 },
    { name: "Semax Intranasal", mass: 5, water: 1, dose: 600, syringe: 1 },
];

const DILUTION_TABLE = [
    { type: "Gerais (BPC, TB, GH)", diluent: "Água Bacteriostática (BAC)", stability: "28–30 dias", note: "0.9% Álcool Benzílico inibe bactérias" },
    { type: "Dose Única", diluent: "Água Estéril / Salina", stability: "< 24 horas", note: "Sem conservantes; uso imediato" },
    { type: "Peptídeos Ácidos (GHK-Cu)", diluent: "Solução Salina 0.9%", stability: "7–14 dias", note: "pH neutro previne degradação" },
    { type: "Intranasal (Semax)", diluent: "Salina 0.9%", stability: "7 dias", note: "Osmolaridade fisiológica nasal" },
    { type: "Orais (BPC-157)", diluent: "Água destilada / DMSO", stability: "Variável", note: "Conforme protocolo específico" },
];

/* ── Função de cálculo ──────────────────────────────────── */
function calculate(mass_mg: number, water_ml: number, dose_mcg: number, syringe_idx: number) {
    const syringe = SYRINGES[syringe_idx];
    const total_mcg = mass_mg * 1000;
    const concentration = total_mcg / water_ml;           // mcg/ml
    const vial_ml = dose_mcg / concentration;       // ml per dose
    const ui_needed = (vial_ml / syringe.ml) * syringe.ui;
    const doses_per_vial = total_mcg / dose_mcg;
    return { total_mcg, concentration, vial_ml, ui_needed, doses_per_vial, syringe };
}

/* ── Syringe visual ─────────────────────────────────────── */
function SyringeVisual({ ui, maxUI }: { ui: number; maxUI: number }) {
    const pct = Math.min(1, ui / maxUI);
    const fillH = Math.round(120 * pct);
    return (
        <div className="flex flex-col items-center gap-2 py-4">
            <svg width="60" height="200" viewBox="0 0 60 200">
                {/* Syringe barrel */}
                <rect x="15" y="20" width="30" height="140" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
                {/* Fill */}
                <rect x="17" y={160 - fillH} width="26" height={fillH} rx="2" fill="#22c55e" opacity="0.7" />
                {/* Graduation lines */}
                {[0, 25, 50, 75, 100].map(p => (
                    <line key={p} x1="42" y1={155 - p * 1.2} x2="48" y2={155 - p * 1.2} stroke="#64748b" strokeWidth="1" />
                ))}
                {/* Plunger */}
                <rect x="20" y="10" width="20" height="14" rx="2" fill="#475569" />
                <rect x="24" y="5" width="12" height="8" rx="2" fill="#334155" />
                {/* Needle */}
                <rect x="27" y="160" width="6" height="30" rx="1" fill="#94a3b8" />
                <path d="M27 190 L30 200 L33 190 Z" fill="#94a3b8" />
                {/* UI label box */}
                <rect x="2" y="72" width="56" height="28" rx="6" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
                <text x="30" y="89" textAnchor="middle" fill="#22c55e" fontSize="13" fontWeight="bold">
                    {ui.toFixed(1)} UI
                </text>
            </svg>
            <p className="text-xs text-slate-400 text-center">Para uma dose de</p>
        </div>
    );
}

/* ── Selector de botões ─────────────────────────────────── */
function ButtonSelector<T extends number | string>({
    label, options, value, onChange, format, extra,
}: {
    label: string; options: T[]; value: T;
    onChange: (v: T) => void; format?: (v: T) => string;
    extra?: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/3 p-4">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-white">{label}</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    <button
                        key={String(opt)}
                        onClick={() => onChange(opt)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${value === opt
                                ? "bg-brand-600 text-white border-brand-500 shadow-glow"
                                : "bg-transparent text-slate-300 border-white/15 hover:border-brand-500/40 hover:text-white"
                            }`}
                    >
                        {format ? format(opt) : String(opt)}
                    </button>
                ))}
                {extra}
            </div>
        </div>
    );
}

/* ── Main ───────────────────────────────────────────────── */
export default function CalculatorPage() {
    const [tab, setTab] = useState<"calculator" | "tables" | "diluents">("calculator");
    const [protocol, setProtocol] = useState("");
    const [mass, setMass] = useState(5);
    const [water, setWater] = useState(2);
    const [dose, setDose] = useState(250);
    const [syrIdx, setSyrIdx] = useState(1); // 0.5ml default

    function applyProtocol(name: string) {
        const p = PROTOCOLS.find(x => x.name === name);
        if (!p) return;
        setMass(p.mass); setWater(p.water); setDose(Math.min(p.dose, 2500)); setSyrIdx(p.syringe);
        setProtocol(name);
    }

    const result = useMemo(() => calculate(mass, water, dose, syrIdx), [mass, water, dose, syrIdx]);

    return (
        <ClientLayout>
            <div className="max-w-3xl mx-auto space-y-5">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-0.5">🧮 Calculadora de Peptídeos</h1>
                    <p className="text-slate-400 text-sm">Calcule a dosagem exata para reconstituição e aplicação.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 glass-card p-1">
                    {[
                        { id: "calculator", label: "🧮 Calculadora" },
                        { id: "tables", label: "📊 Tabelas" },
                        { id: "diluents", label: "💧 Diluentes" },
                    ].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id as any)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                                }`}>{t.label}</button>
                    ))}
                </div>

                {/* === TAB: CALCULADORA === */}
                {tab === "calculator" && (
                    <div className="space-y-4">
                        {/* Protocol selector */}
                        <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                            <div className="text-sm font-medium text-white mb-2">Selecionar protocolo <span className="text-xs text-slate-500 ml-1">(opcional)</span></div>
                            <select
                                className="input w-full"
                                value={protocol}
                                onChange={e => applyProtocol(e.target.value)}
                            >
                                <option value="">Escolha um protocolo para pré-preencher...</option>
                                {PROTOCOLS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                            </select>
                        </div>

                        {/* Syringe */}
                        <div className="rounded-xl border border-white/10 bg-white/3 p-4">
                            <div className="text-sm font-medium text-white mb-3">📐 Volume total da seringa</div>
                            <div className="flex flex-wrap gap-2">
                                {SYRINGES.map((s, i) => (
                                    <button key={i} onClick={() => setSyrIdx(i)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${syrIdx === i
                                                ? "bg-brand-600 text-white border-brand-500 shadow-glow"
                                                : "bg-transparent text-slate-300 border-white/15 hover:border-brand-500/40"
                                            }`}>{s.label}</button>
                                ))}
                            </div>
                        </div>

                        <ButtonSelector
                            label="💊 Quantidade do peptídeo no vial"
                            options={MASS_OPTIONS}
                            value={mass}
                            onChange={setMass}
                            format={v => `${v} mg`}
                        />
                        <ButtonSelector
                            label="💧 Quantidade de água bacteriostática"
                            options={WATER_OPTIONS}
                            value={water}
                            onChange={setWater}
                            format={v => `${v} ml`}
                        />
                        <ButtonSelector
                            label="📍 Dose desejada por aplicação"
                            options={DOSE_OPTIONS}
                            value={dose}
                            onChange={setDose}
                            format={v => v >= 1000 ? `${v / 1000}mg` : `${v}mcg`}
                        />

                        {/* Result */}
                        <div className="glass-card p-5">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Resultado</h2>
                                <span className="text-xs text-slate-500">{result.syringe.label}</span>
                            </div>

                            <div className="grid grid-cols-[1fr_auto] gap-6 items-start">
                                <div className="space-y-3">
                                    {[
                                        { label: "Concentração", value: `${result.concentration.toFixed(0)} mcg/ml`, color: "text-brand-400" },
                                        { label: "Volume por dose", value: `${result.vial_ml.toFixed(3)} ml`, color: "text-white" },
                                        { label: `Unidades (${result.syringe.ui}UI)`, value: `${result.ui_needed.toFixed(1)} UI`, color: "text-emerald-400" },
                                        { label: "Doses por frasco", value: `${result.doses_per_vial.toFixed(0)} doses`, color: "text-white" },
                                    ].map(({ label, value, color }) => (
                                        <div key={label} className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-sm text-slate-400">{label}</span>
                                            <span className={`font-bold text-lg ${color}`}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                                <SyringeVisual ui={result.ui_needed} maxUI={result.syringe.ui} />
                            </div>

                            {/* Como foi calculado */}
                            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-xs text-slate-500 font-medium mb-2">ℹ️ Como foi calculado</div>
                                <ol className="text-xs text-slate-400 space-y-1">
                                    <li>1. Total: {mass}mg × 1000 = <strong className="text-white">{result.total_mcg.toLocaleString()}mcg</strong></li>
                                    <li>2. Conc: {result.total_mcg.toLocaleString()}mcg ÷ {water}ml = <strong className="text-white">{result.concentration.toFixed(0)}mcg/ml</strong></li>
                                    <li>3. Vol: {dose}mcg ÷ {result.concentration.toFixed(0)}mcg/ml = <strong className="text-white">{result.vial_ml.toFixed(3)}ml</strong></li>
                                    <li>4. UI: {result.vial_ml.toFixed(3)}ml ÷ {result.syringe.ml}ml × {result.syringe.ui} = <strong className="text-emerald-400">{result.ui_needed.toFixed(1)} UI</strong></li>
                                </ol>
                            </div>

                            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <p className="text-amber-400 text-xs">⚠️ Fin educacionais. Consulte sempre um profissional de saúde qualificado.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* === TAB: TABELAS === */}
                {tab === "tables" && (
                    <div className="space-y-4">
                        <div className="glass-card overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="font-bold text-white">Unidades por Concentração — Seringa 100UI (1ml)</h2>
                                <p className="text-xs text-slate-400 mt-1">Marcar na seringa para outras concentrações</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="border-b border-white/5 bg-white/3">
                                        <th className="text-left p-3 text-slate-400 text-xs">Concentração</th>
                                        {[50, 100, 200, 250, 300, 500].map(d => (
                                            <th key={d} className="text-center p-3 text-slate-400 text-xs">{d}mcg</th>
                                        ))}
                                    </tr></thead>
                                    <tbody>
                                        {[500, 1000, 1500, 2000, 2500, 5000].map(conc => (
                                            <tr key={conc} className="border-b border-white/5 hover:bg-white/3">
                                                <td className="p-3 text-white font-medium text-xs">{conc}mcg/ml</td>
                                                {[50, 100, 200, 250, 300, 500].map(d => {
                                                    const ui = (d / conc) * 100;
                                                    return <td key={d} className="p-3 text-center text-xs text-brand-400 font-mono">{ui.toFixed(1)}</td>;
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* === TAB: DILUENTES === */}
                {tab === "diluents" && (
                    <div className="space-y-4">
                        <div className="glass-card overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="font-bold text-white">Escolha do diluente por tipo de peptídeo</h2>
                                <p className="text-xs text-slate-400 mt-1">A qualidade do processo determina diretamente a eficácia e segurança.</p>
                            </div>
                            <div className="divide-y divide-white/5">
                                {DILUTION_TABLE.map(row => (
                                    <div key={row.type} className="p-4 hover:bg-white/3 transition-colors">
                                        <div className="grid md:grid-cols-4 gap-2">
                                            <div><div className="text-xs text-slate-500">Tipo</div><div className="text-sm text-white font-medium">{row.type}</div></div>
                                            <div><div className="text-xs text-slate-500">Diluente Ideal</div><div className="text-sm text-brand-400">{row.diluent}</div></div>
                                            <div><div className="text-xs text-slate-500">Estabilidade</div><div className="text-sm text-emerald-400">{row.stability}</div></div>
                                            <div><div className="text-xs text-slate-500">Justificativa</div><div className="text-xs text-slate-300">{row.note}</div></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-5 bg-blue-500/5 border-blue-500/20">
                            <h2 className="font-bold text-white mb-3">🧊 Armazenamento</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Pó liofilizado (lacrado)", value: "2–8°C por até 2 anos" },
                                    { label: "Após reconstituição (BAC)", value: "2–8°C por 28–30 dias" },
                                    { label: "Congelado (liofilizado)", value: "-20°C por até 5 anos" },
                                    { label: "Uso no dia", value: "Temperatura ambiente < 4h" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <div className="text-xs text-slate-400 mb-1">{label}</div>
                                        <div className="text-sm text-white font-medium">{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
