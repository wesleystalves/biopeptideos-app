"use client";

import { useState } from "react";
import ClientLayout from "@/components/client-layout";

export default function CalculatorPage() {
    const [form, setForm] = useState({ peptide_mg: 5, volume_ml: 2, dose_mcg: 250 });
    const set = (k: string, v: number) => setForm(prev => ({ ...prev, [k]: v }));

    const total_mcg = form.peptide_mg * 1000;
    const concentration = total_mcg / form.volume_ml; // mcg/ml
    const injection_vol = form.dose_mcg / concentration; // ml
    const injection_iu = injection_vol * 100; // U100 syringe units

    const Field = ({ label, key: k, unit, min, max, step }: any) => (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <label className="text-slate-300 font-medium">{label}</label>
                <span className="text-brand-400 font-bold">{(form as any)[k]} {unit}</span>
            </div>
            <input
                type="range" min={min} max={max} step={step || 1}
                value={(form as any)[k]}
                onChange={e => set(k, parseFloat(e.target.value))}
                className="w-full accent-brand-500"
            />
            <div className="flex justify-between text-xs text-slate-600">
                <span>{min}{unit}</span><span>{max}{unit}</span>
            </div>
        </div>
    );

    return (
        <ClientLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Calculadora de Dosagem</h1>
                    <p className="text-slate-400 text-sm">Calcule o volume exato de injeção para sua dose desejada.</p>
                </div>

                <div className="glass-card p-6 space-y-6">
                    <Field label="Peptídeo no frasco" k="peptide_mg" unit="mg" min={1} max={20} />
                    <Field label="Água bacteriostática" k="volume_ml" unit="ml" min={0.5} max={5} step={0.5} />
                    <Field label="Dose desejada" k="dose_mcg" unit="mcg" min={50} max={2000} step={50} />
                </div>

                <div className="glass-card p-6 space-y-5">
                    <h2 className="text-lg font-bold text-white">Resultado</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Concentração", value: `${concentration.toFixed(0)} mcg/ml`, desc: "Após reconstituição" },
                            { label: "Volume por dose", value: `${injection_vol.toFixed(3)} ml`, desc: "Retirar da ampola" },
                            { label: "Unidades (U100)", value: `${injection_iu.toFixed(1)} UI`, desc: "Seringa de insulina" },
                            { label: "Total no frasco", value: `${(total_mcg / form.dose_mcg).toFixed(1)} doses`, desc: "Número de aplicações" },
                        ].map(({ label, value, desc }) => (
                            <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-xs text-slate-500 mb-1">{label}</div>
                                <div className="text-xl font-bold text-brand-400">{value}</div>
                                <div className="text-xs text-slate-500 mt-1">{desc}</div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-amber-400 text-xs">
                            ⚠️ Esta calculadora é apenas para fins educacionais. Consulte sempre um profissional de saúde qualificado antes de usar peptídeos.
                        </p>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
