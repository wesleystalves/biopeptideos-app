"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Plus, Trash2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dev.aiwhatsapp.com.br";

const STATUS_OPTS = ["allowed", "restricted", "blocked"];
const CATEGORIES = ["peptides", "sarms", "hormones", "nootropics", "supplements"];

export default function CompliancePage() {
    const [rules, setRules] = useState<any[]>([]);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState({ countryCode: "", productCategory: "peptides", status: "allowed", requiresPrescription: false, notes: "" });
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        fetch(`${API}/api/compliance/rules`).then((r) => r.json()).then(setRules).catch(console.error);
    }, []);

    async function addRule() {
        await fetch(`${API}/api/compliance/rules`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ...form, countryCode: form.countryCode.toUpperCase() }),
        });
        const updated = await fetch(`${API}/api/compliance/rules`).then((r) => r.json());
        setRules(updated);
        setAdding(false);
    }

    async function deleteRule(id: string) {
        if (!confirm("Deletar esta regra?")) return;
        await fetch(`${API}/api/compliance/rules/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        setRules((prev) => prev.filter((r) => r.id !== id));
    }

    async function seedDefaults() {
        await fetch(`${API}/api/compliance/seed`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
        const updated = await fetch(`${API}/api/compliance/rules`).then((r) => r.json());
        setRules(updated);
    }

    const statusBadge: Record<string, string> = { allowed: "badge-green", restricted: "badge-yellow", blocked: "badge-red" };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Compliance — Regras por País</h1>
                    <p className="text-slate-400 text-sm mt-0.5">
                        Controle quais produtos são permitidos em cada país. <span className="text-yellow-400">ENABLE_RESTRICTED_PRODUCTS=false</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={seedDefaults} className="btn-secondary text-xs">Seed Padrão</button>
                    <button onClick={() => setAdding(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nova Regra
                    </button>
                </div>
            </div>

            {/* Add form */}
            {adding && (
                <div className="glass-card p-5 animate-slide-up">
                    <h2 className="font-semibold text-white text-sm mb-4">Nova Regra</h2>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="text-xs text-slate-400 block mb-1.5">País (ISO 2)</label>
                            <input className="input w-full uppercase" placeholder="US" maxLength={2} value={form.countryCode} onChange={(e) => setForm(p => ({ ...p, countryCode: e.target.value }))} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1.5">Categoria</label>
                            <select className="input w-full" value={form.productCategory} onChange={(e) => setForm(p => ({ ...p, productCategory: e.target.value }))}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1.5">Status</label>
                            <select className="input w-full" value={form.status} onChange={(e) => setForm(p => ({ ...p, status: e.target.value }))}>
                                {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <input className="input w-full mb-3" placeholder="Notas (opcional)" value={form.notes} onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))} />
                    <label className="flex items-center gap-2 text-sm text-slate-400 mb-4 cursor-pointer">
                        <input type="checkbox" checked={form.requiresPrescription} onChange={(e) => setForm(p => ({ ...p, requiresPrescription: e.target.checked }))} />
                        Requer prescrição médica
                    </label>
                    <div className="flex gap-3">
                        <button onClick={addRule} className="btn-primary">Salvar</button>
                        <button onClick={() => setAdding(false)} className="btn-secondary">Cancelar</button>
                    </div>
                </div>
            )}

            {/* Rules table */}
            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>País</th>
                            <th>Categoria</th>
                            <th>Status</th>
                            <th>Prescrição</th>
                            <th>Notas</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-slate-500">
                                Nenhuma regra. Clique em "Seed Padrão" para carregar os países padrão.
                            </td></tr>
                        ) : rules.map((r) => (
                            <tr key={r.id}>
                                <td><span className="text-lg">{r.countryCode}</span></td>
                                <td className="font-mono text-xs">{r.productCategory}</td>
                                <td><span className={`badge ${statusBadge[r.status] || "badge-gray"}`}>{r.status}</span></td>
                                <td>{r.requiresPrescription ? <span className="badge badge-yellow">Sim</span> : <span className="text-slate-600 text-xs">Não</span>}</td>
                                <td className="text-slate-500 text-xs">{r.notes || "—"}</td>
                                <td>
                                    <button onClick={() => deleteRule(r.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
