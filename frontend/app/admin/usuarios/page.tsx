"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Users, Search, Crown, Shield, UserX, Plus, Edit2, Trash2,
    Eye, CheckCircle, XCircle, Phone, Filter, ChevronDown, X,
    AlertTriangle, Check, UserCheck, RefreshCw
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

// ─── Types ────────────────────────────────────────────────────────────────────

type User = {
    id: string; name?: string; email: string; plan: string;
    isAdmin: boolean; emailVerified: boolean; profileType?: string;
    phone?: string; cpf?: string; whatsapp?: string;
    birthDate?: string; gender?: string;
    createdAt: string; _count?: { orders: number };
};

type Stats = { total: number; premium: number; basic: number; free: number; verified: number; unverified: number };
type FormData = Partial<User> & { password?: string };

// ─── Constants ────────────────────────────────────────────────────────────────

const PLANS = ["free", "basic", "premium"];
const PLAN_LABEL: Record<string, string> = { free: "Free", basic: "Basic", premium: "Premium" };
const PLAN_STYLE: Record<string, string> = {
    free: "text-slate-400 bg-slate-500/10 border-slate-500/20",
    basic: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    premium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};
const GENDERS = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "outro", label: "Outro" },
    { value: "prefiro_nao_dizer", label: "Prefiro não dizer" },
];
const PROFILE_TYPES = ["medico", "nutricionista", "coach", "atleta", "paciente", "outro"];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Pill = ({ cls, children }: { cls: string; children: React.ReactNode }) => (
    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${cls}`}>{children}</span>
);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">{label}</label>
            {children}
        </div>
    );
}

const inp = "w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-brand-500/60 placeholder-slate-600 transition-colors";
const sel = "w-full bg-slate-800 border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-brand-500/60 transition-colors";

// ─── Confirm Delete ───────────────────────────────────────────────────────────

function ConfirmDelete({ user, onConfirm, onCancel }: { user: User; onConfirm(): void; onCancel(): void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-card p-6 max-w-sm w-full space-y-4">
                <div className="flex items-center gap-3 text-red-400">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span className="font-semibold">Excluir usuário?</span>
                </div>
                <p className="text-sm text-slate-300">
                    Excluirá permanentemente <strong className="text-white">{user.name || user.email}</strong> e todos seus dados.
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-2 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors">Cancelar</button>
                    <button onClick={onConfirm} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">Excluir</button>
                </div>
            </div>
        </div>
    );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ userId, headers, onClose, onEdit }: {
    userId: string; headers: HeadersInit; onClose(): void; onEdit(u: User): void;
}) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetch(`${API}/api/auth/admin/users/${userId}`, { headers }).then(r => r.json()).then(setUser);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const fmt = (d?: string) => d ? new Date(d).toLocaleDateString("pt-BR") : "—";
    const money = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-slate-900/90 backdrop-blur flex items-center justify-between p-5 border-b border-white/10 z-10">
                    <h2 className="font-semibold text-white flex items-center gap-2"><Eye className="w-4 h-4 text-brand-400" /> Detalhe do Usuário</h2>
                    <div className="flex items-center gap-2">
                        {user && <button onClick={() => onEdit(user)} className="text-xs px-3 py-1.5 rounded-lg bg-brand-600/20 text-brand-400 hover:bg-brand-600/30 border border-brand-500/20 flex items-center gap-1.5 transition-colors"><Edit2 className="w-3 h-3" />Editar</button>}
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400"><X className="w-4 h-4" /></button>
                    </div>
                </div>
                {!user ? (
                    <div className="p-12 text-center text-slate-400">Carregando...</div>
                ) : (
                    <div className="p-5 space-y-6">
                        {/* Header */}
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-xl font-bold text-brand-300">
                                {(user.name || user.email)[0].toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-lg font-bold text-white">{user.name || "Sem nome"}</span>
                                    {user.isAdmin && <Shield className="w-4 h-4 text-red-400" />}
                                </div>
                                <div className="text-sm text-slate-400">{user.email}</div>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <Pill cls={PLAN_STYLE[user.plan] || PLAN_STYLE.free}>{PLAN_LABEL[user.plan] || user.plan}</Pill>
                                    {user.emailVerified
                                        ? <span className="text-[11px] flex items-center gap-1 text-green-400"><CheckCircle className="w-3 h-3" />Verificado</span>
                                        : <span className="text-[11px] flex items-center gap-1 text-orange-400"><XCircle className="w-3 h-3" />Não verificado</span>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Personal */}
                        <div>
                            <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Dados pessoais</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {[
                                    ["CPF", user.cpf], ["WhatsApp", user.whatsapp],
                                    ["Telefone", user.phone], ["Nascimento", fmt(user.birthDate)],
                                    ["Gênero", user.gender], ["Tipo de perfil", user.profileType],
                                    ["Cadastrado em", fmt(user.createdAt)], ["Pedidos", user._count?.orders ?? 0],
                                ].map(([k, v]) => (
                                    <div key={k as string}>
                                        <span className="text-slate-500">{k}: </span>
                                        <span className="text-slate-200">{(v as any) || "—"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Orders */}
                        {user.orders?.length > 0 && (
                            <div>
                                <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Últimos pedidos</h3>
                                <div className="space-y-1.5">
                                    {user.orders.slice(0, 5).map((o: any) => (
                                        <div key={o.id} className="flex justify-between items-center text-sm bg-white/3 rounded-lg px-3 py-2">
                                            <span className="text-slate-400 font-mono text-xs">{o.id.slice(0, 8)}…</span>
                                            <span className="text-slate-300 capitalize">{o.status}</span>
                                            <span className="text-white font-medium">{money(o.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Addresses */}
                        {user.addresses?.length > 0 && (
                            <div>
                                <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Endereços ({user.addresses.length})</h3>
                                <div className="space-y-2">
                                    {user.addresses.map((a: any) => (
                                        <div key={a.id} className="text-sm text-slate-300 bg-white/3 rounded-lg p-3">
                                            {a.label && <div className="text-xs text-slate-500 mb-0.5">{a.label}{a.isDefault ? " ★ Padrão" : ""}</div>}
                                            <div>{a.street}, {a.number}{a.complement ? ` – ${a.complement}` : ""}</div>
                                            <div className="text-slate-400">{a.neighborhood}, {a.city} – {a.state}, CEP {a.cep}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── User Form Modal ──────────────────────────────────────────────────────────

function UserFormModal({ user, headers, onSave, onClose }: {
    user: User | null; headers: HeadersInit; onSave(): void; onClose(): void;
}) {
    const isEdit = !!user;
    const [form, setForm] = useState<FormData>({
        name: "", email: "", phone: "", cpf: "", whatsapp: "",
        birthDate: "", gender: "", profileType: "", plan: "free",
        emailVerified: false, isAdmin: false, password: "",
        ...user,
        birthDate: user?.birthDate ? user.birthDate.split("T")[0] : "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const set = (k: keyof FormData) => (v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

    async function submit() {
        setSaving(true); setError("");
        try {
            const url = isEdit ? `${API}/api/auth/admin/users/${user!.id}` : `${API}/api/auth/admin/users`;
            const body: any = { ...form };
            if (!body.password) delete body.password;
            const r = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers, body: JSON.stringify(body) });
            if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.message || "Erro ao salvar"); }
            onSave();
        } catch (e: any) { setError(e.message); } finally { setSaving(false); }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-card w-full max-w-2xl max-h-[92vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-slate-900/90 backdrop-blur flex items-center justify-between p-5 border-b border-white/10 z-10">
                    <h2 className="font-semibold text-white flex items-center gap-2">
                        {isEdit ? <Edit2 className="w-4 h-4 text-brand-400" /> : <Plus className="w-4 h-4 text-brand-400" />}
                        {isEdit ? "Editar Usuário" : "Adicionar Usuário"}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400"><X className="w-4 h-4" /></button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Identity */}
                    <section>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Identificação</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Nome completo">
                                <input className={inp} value={form.name || ""} onChange={e => set("name")(e.target.value)} placeholder="João Silva" />
                            </Field>
                            <Field label="Email *">
                                <input className={inp} type="email" value={form.email || ""} onChange={e => set("email")(e.target.value)} placeholder="joao@email.com" />
                            </Field>
                            <Field label="Senha (deixe vazio para manter)">
                                <input className={inp} type="password" value={form.password || ""} onChange={e => set("password")(e.target.value)} placeholder="••••••••" />
                            </Field>
                            <Field label="Tipo de perfil">
                                <select className={sel} value={form.profileType || ""} onChange={e => set("profileType")(e.target.value)}>
                                    <option value="">Selecionar...</option>
                                    {PROFILE_TYPES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                                </select>
                            </Field>
                        </div>
                    </section>

                    {/* Personal */}
                    <section>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Dados pessoais</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="CPF">
                                <input className={inp} value={form.cpf || ""} onChange={e => set("cpf")(e.target.value)} placeholder="000.000.000-00" />
                            </Field>
                            <Field label="WhatsApp">
                                <input className={inp} value={form.whatsapp || ""} onChange={e => set("whatsapp")(e.target.value)} placeholder="+55 11 90000-0000" />
                            </Field>
                            <Field label="Telefone">
                                <input className={inp} value={form.phone || ""} onChange={e => set("phone")(e.target.value)} placeholder="+55 11 0000-0000" />
                            </Field>
                            <Field label="Data de nascimento">
                                <input className={inp} type="date" value={form.birthDate || ""} onChange={e => set("birthDate")(e.target.value)} />
                            </Field>
                            <Field label="Gênero">
                                <select className={sel} value={form.gender || ""} onChange={e => set("gender")(e.target.value)}>
                                    <option value="">Selecionar...</option>
                                    {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                </select>
                            </Field>
                        </div>
                    </section>

                    {/* Plan & Permissions */}
                    <section>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Plano & Permissões</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Plano">
                                <select className={sel} value={form.plan || "free"} onChange={e => set("plan")(e.target.value)}>
                                    {PLANS.map(p => <option key={p} value={p}>{PLAN_LABEL[p]}</option>)}
                                </select>
                            </Field>
                            <div className="flex flex-col gap-3 pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={!!form.emailVerified} onChange={e => set("emailVerified")(e.target.checked)} className="w-4 h-4 rounded accent-green-500" />
                                    <span className="text-sm text-slate-300">Email verificado</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={!!form.isAdmin} onChange={e => set("isAdmin")(e.target.checked)} className="w-4 h-4 rounded accent-red-500" />
                                    <span className="text-sm text-slate-300">Administrador</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-lg p-3">
                            <XCircle className="w-4 h-4 shrink-0" />{error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur flex gap-3 p-5 border-t border-white/10">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors">Cancelar</button>
                    <button onClick={submit} disabled={saving} className="flex-1 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                        {saving ? <><RefreshCw className="w-4 h-4 animate-spin" />Salvando...</> : <><Check className="w-4 h-4" />{isEdit ? "Salvar alterações" : "Criar usuário"}</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminUsuarios() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, premium: 0, basic: 0, free: 0, verified: 0, unverified: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterPlan, setFilterPlan] = useState("");
    const [filterVerified, setFilterVerified] = useState("");
    const [sort, setSort] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [modal, setModal] = useState<"add" | "edit" | "detail" | "delete" | null>(null);
    const [selected, setSelected] = useState<User | null>(null);

    const token = () => typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const p = new URLSearchParams();
            if (search) p.set("search", search);
            if (filterPlan) p.set("plan", filterPlan);
            if (filterVerified) p.set("verified", filterVerified);
            p.set("sort", sort);
            const r = await fetch(`${API}/api/auth/admin/users?${p}`, { headers: headers() });
            if (r.ok) {
                const data = await r.json();
                setUsers(data.users || data);
                if (data.stats) setStats(data.stats);
            }
        } finally { setLoading(false); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, filterPlan, filterVerified, sort]);

    useEffect(() => { load(); }, [load]);

    async function doDelete() {
        if (!selected) return;
        await fetch(`${API}/api/auth/admin/users/${selected.id}`, { method: "DELETE", headers: headers() });
        close(); load();
    }

    async function forceVerify(u: User) {
        await fetch(`${API}/api/auth/admin/users/${u.id}/verify-email`, { method: "PATCH", headers: headers() });
        load();
    }

    async function toggleAdmin(u: User) {
        await fetch(`${API}/api/auth/admin/users/${u.id}/admin`, { method: "PATCH", headers: headers(), body: JSON.stringify({ isAdmin: !u.isAdmin }) });
        load();
    }

    function close() { setModal(null); setSelected(null); }
    const age = (b?: string) => { if (!b) return null; return Math.floor((Date.now() - new Date(b).getTime()) / (365.25 * 24 * 3600 * 1000)); };

    const STAT_CARDS = [
        { label: "Total", value: stats.total, color: "text-white" },
        { label: "Premium", value: stats.premium, color: "text-amber-400" },
        { label: "Basic", value: stats.basic, color: "text-blue-400" },
        { label: "Free", value: stats.free, color: "text-slate-400" },
        { label: "Verificados ✓", value: stats.verified, color: "text-green-400" },
        { label: "Não verif.", value: stats.unverified, color: "text-orange-400" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="w-6 h-6 text-brand-400" /> Usuários</h1>
                    <p className="text-slate-400 text-sm">Gerencie usuários e planos da plataforma</p>
                </div>
                <button onClick={() => setModal("add")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors shadow-lg shadow-brand-900/30">
                    <Plus className="w-4 h-4" /> Adicionar Usuário
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {STAT_CARDS.map(s => (
                    <div key={s.label} className="glass-card p-4">
                        <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Search + Filters */}
            <div className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                        className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-500"
                        placeholder="Buscar por nome, email, CPF, WhatsApp..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button onClick={() => setShowFilters(f => !f)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${showFilters ? "border-brand-500/40 text-brand-400 bg-brand-500/10" : "border-white/10 text-slate-400 hover:text-white"}`}>
                        <Filter className="w-3.5 h-3.5" /> Filtros <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                    </button>
                </div>
                {showFilters && (
                    <div className="flex flex-wrap gap-3 pt-2 border-t border-white/5">
                        {[
                            { label: "Plano", value: filterPlan, set: setFilterPlan, opts: [{ v: "", l: "Todos planos" }, ...PLANS.map(p => ({ v: p, l: PLAN_LABEL[p] }))] },
                            { label: "Email", value: filterVerified, set: setFilterVerified, opts: [{ v: "", l: "Todos" }, { v: "true", l: "Verificado" }, { v: "false", l: "Não verificado" }] },
                            { label: "Ordenar", value: sort, set: setSort, opts: [{ v: "newest", l: "Mais recentes" }, { v: "oldest", l: "Mais antigos" }, { v: "name", l: "Nome A–Z" }, { v: "plan", l: "Plano" }] },
                        ].map(({ label, value, set, opts }) => (
                            <div key={label} className="flex items-center gap-2">
                                <span className="text-xs text-slate-500">{label}:</span>
                                <select value={value} onChange={e => set(e.target.value)} className="bg-slate-800 text-sm text-slate-300 border border-white/10 rounded-lg px-2.5 py-1.5 outline-none">
                                    {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                                </select>
                            </div>
                        ))}
                        {(filterPlan || filterVerified || sort !== "newest") && (
                            <button onClick={() => { setFilterPlan(""); setFilterVerified(""); setSort("newest"); }} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 px-2 py-1.5">
                                <X className="w-3 h-3" /> Limpar
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <div className="hidden sm:grid grid-cols-[1fr_80px_100px_56px_80px_100px] gap-3 px-4 py-2 border-b border-white/5 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                    <span>Usuário</span>
                    <span className="text-center">Plano</span>
                    <span className="text-center">WhatsApp</span>
                    <span className="text-center">Idade</span>
                    <span className="text-center">Cadastro</span>
                    <span className="text-center">Ações</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400">Carregando...</div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">Nenhum usuário encontrado</div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {users.map(u => (
                            <div key={u.id} className="grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_56px_80px_100px] gap-2 sm:gap-3 px-4 py-3 hover:bg-white/2 transition-colors items-center">
                                {/* User info */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 shrink-0 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-sm font-bold text-brand-300">
                                        {(u.name || u.email)[0].toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="font-medium text-white text-sm">{u.name || "—"}</span>
                                            {u.isAdmin && <Shield className="w-3 h-3 text-red-400 shrink-0" title="Admin" />}
                                            {u.emailVerified
                                                ? <CheckCircle className="w-3 h-3 text-green-400 shrink-0" title="Email verificado" />
                                                : <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 whitespace-nowrap">Não verif.</span>
                                            }
                                        </div>
                                        <div className="text-xs text-slate-400 truncate">{u.email}</div>
                                        {u.profileType && <div className="text-[10px] text-slate-500 capitalize">{u.profileType}</div>}
                                    </div>
                                </div>

                                <div className="flex sm:justify-center">
                                    <Pill cls={PLAN_STYLE[u.plan] || PLAN_STYLE.free}>{PLAN_LABEL[u.plan] || u.plan}</Pill>
                                </div>

                                <div className="text-xs text-center">
                                    {u.whatsapp ? (
                                        <a href={`https://wa.me/${u.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                                            className="text-green-400 hover:text-green-300 flex items-center gap-1 justify-center">
                                            <Phone className="w-3 h-3" /><span className="truncate max-w-[80px]">{u.whatsapp}</span>
                                        </a>
                                    ) : <span className="text-slate-600">—</span>}
                                </div>

                                <div className="text-xs text-slate-400 text-center">
                                    {age(u.birthDate) != null ? `${age(u.birthDate)} a` : "—"}
                                </div>

                                <div className="text-xs text-slate-400 text-center">
                                    {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-0.5 justify-end sm:justify-center">
                                    <button onClick={() => { setSelected(u); setModal("detail"); }} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors" title="Ver detalhe"><Eye className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => { setSelected(u); setModal("edit"); }} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Editar"><Edit2 className="w-3.5 h-3.5" /></button>
                                    {!u.emailVerified && (
                                        <button onClick={() => forceVerify(u)} className="p-1.5 rounded-lg text-slate-400 hover:text-green-400 hover:bg-green-500/10 transition-colors" title="Forçar verificação de email"><UserCheck className="w-3.5 h-3.5" /></button>
                                    )}
                                    <button onClick={() => toggleAdmin(u)} className={`p-1.5 rounded-lg transition-colors ${u.isAdmin ? "text-red-400 hover:bg-red-500/10" : "text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"}`} title={u.isAdmin ? "Remover admin" : "Tornar admin"}>
                                        {u.isAdmin ? <UserX className="w-3.5 h-3.5" /> : <Crown className="w-3.5 h-3.5" />}
                                    </button>
                                    <button onClick={() => { setSelected(u); setModal("delete"); }} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Excluir"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && users.length > 0 && (
                    <div className="px-4 py-2 border-t border-white/5 text-xs text-slate-500">
                        {users.length} usuário{users.length !== 1 ? "s" : ""} exibido{users.length !== 1 ? "s" : ""}
                        {stats.total !== users.length && ` de ${stats.total} total`}
                    </div>
                )}
            </div>

            {/* Modals */}
            {(modal === "add" || modal === "edit") && (
                <UserFormModal user={modal === "edit" ? selected : null} headers={headers()} onSave={() => { close(); load(); }} onClose={close} />
            )}
            {modal === "detail" && selected && (
                <DetailModal userId={selected.id} headers={headers()} onClose={close} onEdit={u => { setModal("edit"); setSelected(u); }} />
            )}
            {modal === "delete" && selected && (
                <ConfirmDelete user={selected} onConfirm={doDelete} onCancel={close} />
            )}
        </div>
    );
}
