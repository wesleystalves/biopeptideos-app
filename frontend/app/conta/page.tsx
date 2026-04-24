"use client";

import { useEffect, useState } from "react";
import { User, Save, RefreshCw, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

const GENDERS = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "outro", label: "Outro" },
    { value: "prefiro_nao_dizer", label: "Prefiro não dizer" },
];
const PROFILE_TYPES = ["medico", "nutricionista", "coach", "atleta", "paciente", "outro"];

type Profile = {
    name?: string; displayName?: string; phone?: string;
    cpf?: string; whatsapp?: string; birthDate?: string;
    gender?: string; profileType?: string; avatarUrl?: string;
    email?: string; emailVerified?: boolean; plan?: string;
};

export default function MinhaConta() {
    const [profile, setProfile] = useState<Profile>({});
    const [form, setForm] = useState<Profile>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const token = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

    useEffect(() => {
        if (!token()) { router.push("/auth/login"); return; }
        fetch(`${API}/api/auth/me`, { headers: headers() })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (!data) return;
                setProfile(data);
                setForm({
                    name: data.name || "",
                    displayName: data.displayName || "",
                    phone: data.phone || "",
                    cpf: data.cpf || "",
                    whatsapp: data.whatsapp || "",
                    birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
                    gender: data.gender || "",
                    profileType: data.profileType || "",
                });
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function save() {
        setSaving(true); setError(""); setSaved(false);
        try {
            const r = await fetch(`${API}/api/auth/profile`, {
                method: "PATCH",
                headers: headers(),
                body: JSON.stringify(form),
            });
            if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.message || "Erro ao salvar"); }
            const updated = await r.json();
            setProfile(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e: any) { setError(e.message); } finally { setSaving(false); }
    }

    const set = (k: keyof Profile) => (v: string) => setForm(f => ({ ...f, [k]: v }));
    const inp = "w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-brand-500/50 placeholder-slate-600 transition-colors";
    const sel = "w-full bg-[#0f1f35] border border-white/10 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-brand-500/50 transition-colors";

    if (loading) return (
        <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050d1a] text-white">
            <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-2xl font-bold text-brand-300">
                        {(profile.name || profile.email || "U")[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2"><User className="w-6 h-6 text-brand-400" /> Minha Conta</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-slate-400 text-sm">{profile.email}</span>
                            {profile.emailVerified
                                ? <span className="text-[11px] flex items-center gap-1 text-green-400"><CheckCircle className="w-3 h-3" />Email verificado</span>
                                : <span className="text-[11px] text-orange-400">Email não verificado</span>
                            }
                        </div>
                        {profile.plan && (
                            <span className="text-[11px] px-2 py-0.5 mt-1 inline-block rounded-full border font-semibold
                                {profile.plan === 'premium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : profile.plan === 'basic' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-slate-400 bg-slate-500/10 border-slate-500/20'}">
                                Plano: {profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Personal Info Form */}
                <div className="bg-[#0a1628] border border-white/8 rounded-2xl p-6 space-y-5">
                    <h2 className="text-base font-semibold text-white">Dados Pessoais</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium">Nome completo</label>
                            <input className={inp} value={form.name || ""} onChange={e => set("name")(e.target.value)} placeholder="João Silva" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium">Apelido / Nome de exibição</label>
                            <input className={inp} value={form.displayName || ""} onChange={e => set("displayName")(e.target.value)} placeholder="João" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium">CPF</label>
                            <input className={inp} value={form.cpf || ""} onChange={e => set("cpf")(e.target.value)} placeholder="000.000.000-00" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium">WhatsApp</label>
                            <input className={inp} value={form.whatsapp || ""} onChange={e => set("whatsapp")(e.target.value)} placeholder="+55 11 90000-0000" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium">Telefone</label>
                            <input className={inp} value={form.phone || ""} onChange={e => set("phone")(e.target.value)} placeholder="+55 11 0000-0000" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium">Data de nascimento</label>
                            <input className={inp} type="date" value={form.birthDate || ""} onChange={e => set("birthDate")(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium">Gênero</label>
                            <select className={sel} value={form.gender || ""} onChange={e => set("gender")(e.target.value)}>
                                <option value="">Selecionar...</option>
                                {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-400 font-medium">Tipo de perfil</label>
                            <select className={sel} value={form.profileType || ""} onChange={e => set("profileType")(e.target.value)}>
                                <option value="">Selecionar...</option>
                                {PROFILE_TYPES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2">{error}</p>}

                    <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold transition-colors">
                        {saving ? <><RefreshCw className="w-4 h-4 animate-spin" />Salvando...</> : saved ? <><CheckCircle className="w-4 h-4" />Salvo!</> : <><Save className="w-4 h-4" />Salvar dados</>}
                    </button>
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href="/conta/enderecos" className="bg-[#0a1628] border border-white/8 rounded-2xl p-5 hover:border-brand-500/30 transition-colors group">
                        <div className="text-brand-400 font-semibold group-hover:text-brand-300">📍 Meus Endereços</div>
                        <div className="text-sm text-slate-400 mt-1">Gerenciar endereços de entrega</div>
                    </a>
                    <a href="/conta/pedidos" className="bg-[#0a1628] border border-white/8 rounded-2xl p-5 hover:border-brand-500/30 transition-colors group">
                        <div className="text-brand-400 font-semibold group-hover:text-brand-300">📦 Meus Pedidos</div>
                        <div className="text-sm text-slate-400 mt-1">Histórico e status dos pedidos</div>
                    </a>
                </div>
            </div>
        </div>
    );
}
