"use client";

import { useEffect, useState } from "react";
import { Users, Search, Crown, Shield, UserX } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

type User = {
    id: string; name?: string; email: string; plan: string;
    isAdmin: boolean; emailVerified: boolean; profileType?: string;
    createdAt: string; _count?: { orders: number; subscriptions: number };
};

const PLAN_COLORS: Record<string, string> = {
    free: "text-slate-400 bg-slate-500/10 border-slate-500/20",
    basic: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    premium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
};

export default function AdminUsuarios() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterPlan, setFilterPlan] = useState("");

    const token = () => typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

    async function load() {
        setLoading(true);
        try {
            const r = await fetch(`${API}/api/analytics/users`, { headers: headers() });
            if (r.ok) {
                const data = await r.json();
                setUsers(data.users || data);
            }
        } finally { setLoading(false); }
    }

    useEffect(() => { load(); }, []);

    const filtered = users.filter(u => {
        const matchSearch = !search || u.email.toLowerCase().includes(search.toLowerCase()) || (u.name || "").toLowerCase().includes(search.toLowerCase());
        const matchPlan = !filterPlan || u.plan === filterPlan;
        return matchSearch && matchPlan;
    });

    const stats = {
        total: users.length,
        premium: users.filter(u => u.plan === "premium").length,
        basic: users.filter(u => u.plan === "basic").length,
        free: users.filter(u => u.plan === "free").length,
    };

    async function toggleAdmin(u: User) {
        const r = await fetch(`${API}/api/analytics/users/${u.id}/admin`, { method: "PATCH", headers: headers(), body: JSON.stringify({ isAdmin: !u.isAdmin }) });
        if (r.ok) load();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="w-6 h-6 text-brand-400" /> Usuários</h1>
                    <p className="text-slate-400 text-sm">Gerencie usuários e planos da plataforma</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="stat-card"><div className="text-2xl font-bold text-white">{stats.total}</div><div className="text-xs text-slate-500 mt-1">Total</div></div>
                <div className="stat-card"><div className="text-2xl font-bold text-yellow-400">{stats.premium}</div><div className="text-xs text-slate-500 mt-1">Premium</div></div>
                <div className="stat-card"><div className="text-2xl font-bold text-blue-400">{stats.basic}</div><div className="text-xs text-slate-500 mt-1">Basic</div></div>
                <div className="stat-card"><div className="text-2xl font-bold text-slate-400">{stats.free}</div><div className="text-xs text-slate-500 mt-1">Free</div></div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-500" placeholder="Buscar por nome ou email..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="bg-transparent text-sm text-slate-300 outline-none border border-white/10 rounded-lg px-3 py-1.5" value={filterPlan} onChange={e => setFilterPlan(e.target.value)}>
                    <option value="">Todos os planos</option>
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                </select>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                {loading ? <div className="p-12 text-center text-slate-400">Carregando...</div> : (
                    <div className="divide-y divide-white/5">
                        {filtered.length === 0 && <div className="p-12 text-center text-slate-500">Nenhum usuário encontrado</div>}
                        {filtered.map(u => (
                            <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors">
                                <div className="w-9 h-9 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-sm font-bold text-brand-300">
                                    {(u.name || u.email)[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-white truncate">{u.name || "—"}</span>
                                        {u.isAdmin && <Shield className="w-3 h-3 text-red-400" title="Admin" />}
                                        {!u.emailVerified && <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400">Email não verificado</span>}
                                    </div>
                                    <div className="text-xs text-slate-400">{u.email}</div>
                                    {u.profileType && <div className="text-xs text-slate-500 mt-0.5">{u.profileType}</div>}
                                </div>
                                <span className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold ${PLAN_COLORS[u.plan] || PLAN_COLORS.free}`}>{u.plan.charAt(0).toUpperCase() + u.plan.slice(1)}</span>
                                <div className="text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</div>
                                <button onClick={() => toggleAdmin(u)} className={`p-1.5 rounded-lg transition-colors ${u.isAdmin ? "text-red-400 hover:bg-red-500/10" : "text-slate-400 hover:text-yellow-400"}`} title={u.isAdmin ? "Remover admin" : "Tornar admin"}>
                                    {u.isAdmin ? <UserX className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
