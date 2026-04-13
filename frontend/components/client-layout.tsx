"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Zap, LayoutDashboard, FlaskConical, Search, GitCompare,
    BookOpen, Calculator, Layers, AlertTriangle, Map,
    CalendarDays, ShoppingBag, User, LogOut, Menu, X, ChevronRight
} from "lucide-react";

const nav = [
    { href: "/painel", icon: LayoutDashboard, label: "Painel" },
    { href: "/library", icon: FlaskConical, label: "Peptídeos" },
    { href: "/finder", icon: Search, label: "Encontre o Seu" },
    { href: "/compare", icon: GitCompare, label: "Comparar" },
    { href: "/protocols", icon: BookOpen, label: "Protocolos" },
    { href: "/learn", icon: BookOpen, label: "Aprender" },
    { href: "/calculator", icon: Calculator, label: "Calculadora" },
    { href: "/stacks", icon: Layers, label: "Stacks" },
    { href: "/interactions", icon: AlertTriangle, label: "Interações" },
    { href: "/body-map", icon: Map, label: "Mapa de Aplicação" },
    { href: "/schedule", icon: CalendarDays, label: "Cronograma" },
    { href: "/catalog", icon: ShoppingBag, label: "Loja" },
    { href: "/account", icon: User, label: "Minha Conta" },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<{ email: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.replace("/auth/login"); return; }
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUser({ email: payload.email || payload.sub || "Usuário" });
        } catch { /* ignore */ }
    }, [router]);

    function logout() {
        localStorage.removeItem("token");
        router.push("/auth/login");
    }

    const isActive = (href: string) =>
        pathname === href || (href !== "/painel" && pathname.startsWith(href));

    return (
        <div className="flex min-h-screen" style={{ background: 'linear-gradient(160deg, #071a2c 0%, #0b2d4a 40%, #083a5a 70%, #071a2c 100%)', minHeight: '100vh' }}>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 z-20 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full z-30 flex flex-col
                w-64 border-r border-white/10
                transition-transform duration-300 ease-in-out
                ${open ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:relative lg:flex-shrink-0
            `} style={{ background: 'rgba(5, 20, 38, 0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow flex-shrink-0">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-base">
                        <span className="text-white">Bio</span>
                        <span className="gradient-text">Peptidios</span>
                    </span>
                    <button
                        className="ml-auto lg:hidden text-slate-400 hover:text-white"
                        onClick={() => setOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                    {nav.map(({ href, icon: Icon, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                transition-all duration-150 group
                                ${isActive(href)
                                    ? "bg-brand-600/15 text-brand-400 border border-brand-500/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                }
                            `}
                        >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive(href) ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                            {label}
                            {isActive(href) && <ChevronRight className="w-3 h-3 ml-auto text-brand-500" />}
                        </Link>
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="p-4 border-t border-white/5">
                    {user && (
                        <div className="flex items-center gap-2.5 mb-3 px-2">
                            <div className="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
                                <span className="text-xs font-bold text-brand-400">
                                    {user.email[0].toUpperCase()}
                                </span>
                            </div>
                            <span className="text-xs text-slate-400 truncate">{user.email}</span>
                        </div>
                    )}
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile header */}
                <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/10" style={{ background: 'rgba(5, 20, 38, 0.55)', backdropFilter: 'blur(16px)' }}>
                    <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-white">
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-sm">
                        <span className="text-white">Bio</span>
                        <span className="gradient-text">Peptidios</span>
                    </span>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
