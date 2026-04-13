"use client";

import { useState } from "react";
import ClientLayout from "@/components/client-layout";
import { AlertTriangle, CheckCircle2, XCircle, Search } from "lucide-react";

const INTERACTIONS: Record<string, { status: "compatible" | "caution" | "avoid"; note: string }> = {
    "BPC-157+TB-500": { status: "compatible", note: "Combinação sinérgica amplamente usada para recuperação. Efeitos se complementam sem sobreposição." },
    "CJC-1295+Ipamorelin": { status: "compatible", note: "Stack clássico de GH — CJC prolonga a ação pulsátil e Ipamorelin amplifica seletivamente o pulso." },
    "Semax+Selank": { status: "compatible", note: "Combinação nootrópica equilibrada: foco (Semax) + calma sem sedação (Selank)." },
    "BPC-157+Ipamorelin": { status: "caution", note: "Pode haver sobreposição no efeito anti-inflamatório. Use doses conservadoras monitorando resposta." },
    "Epithalon+CJC-1295": { status: "caution", note: "Dados limitados na combinação. Use em períodos separados ou monitore com profissional." },
    "GHRP-6+CJC-1295": { status: "caution", note: "GHRP-6 pode elevar cortisol e grelina. Prefira Ipamorelin como alternativa mais seletiva." },
    "Melanotan II+BPC-157": { status: "avoid", note: "Não há estudos combinatórios e mecanismos podem se antagonizar. Evite uso simultâneo." },
};

const PAIRS = [
    ["BPC-157", "TB-500", "Semax", "Selank", "CJC-1295", "Ipamorelin", "Epithalon", "GHK-Cu", "GHRP-6", "AOD-9604", "Melanotan II"],
];

export default function InteractionsPage() {
    const [a, setA] = useState("");
    const [b, setB] = useState("");

    function getResult() {
        const key1 = `${a}+${b}`;
        const key2 = `${b}+${a}`;
        return INTERACTIONS[key1] || INTERACTIONS[key2] || null;
    }

    const result = a && b && a !== b ? getResult() : null;
    const peptides = PAIRS[0];

    return (
        <ClientLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Interações</h1>
                    <p className="text-slate-400 text-sm">Verifique a compatibilidade entre peptídeos antes de combiná-los.</p>
                </div>

                <div className="glass-card p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        {[{ label: "Peptídeo A", val: a, setVal: setA }, { label: "Peptídeo B", val: b, setVal: setB }].map(({ label, val, setVal }) => (
                            <div key={label} className="space-y-1.5">
                                <label className="text-xs text-slate-400 font-medium">{label}</label>
                                <select
                                    value={val}
                                    onChange={e => setVal(e.target.value)}
                                    className="input w-full"
                                >
                                    <option value="">Selecione...</option>
                                    {peptides.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>

                    {result && (
                        <div className={`p-4 rounded-xl border flex gap-3 items-start ${result.status === "compatible" ? "bg-emerald-500/10 border-emerald-500/30" :
                                result.status === "caution" ? "bg-amber-500/10 border-amber-500/30" :
                                    "bg-red-500/10 border-red-500/30"
                            }`}>
                            {result.status === "compatible" && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
                            {result.status === "caution" && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />}
                            {result.status === "avoid" && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
                            <div>
                                <div className={`font-semibold mb-1 text-sm ${result.status === "compatible" ? "text-emerald-400" :
                                        result.status === "caution" ? "text-amber-400" : "text-red-400"
                                    }`}>
                                    {result.status === "compatible" ? "✅ Compatível" :
                                        result.status === "caution" ? "⚠️ Use com cautela" : "❌ Evitar combinação"}
                                </div>
                                <p className="text-sm text-slate-300">{result.note}</p>
                            </div>
                        </div>
                    )}

                    {a && b && a !== b && !result && (
                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-sm text-slate-400">
                            Não temos dados específicos para esta combinação. Consulte um profissional de saúde.
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="font-semibold text-white text-sm">Interações Conhecidas</h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {Object.entries(INTERACTIONS).map(([pair, { status, note }]) => (
                            <div key={pair} className="flex items-start gap-3 p-4">
                                <div className="flex gap-1.5 items-center flex-shrink-0">
                                    {status === "compatible" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                    {status === "caution" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                                    {status === "avoid" && <XCircle className="w-4 h-4 text-red-400" />}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-medium text-white text-sm">{pair.replace("+", " + ")}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{note}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
