"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Users, MessageSquare, Settings, Package,
    ShieldCheck, BarChart3, Zap, LogOut, Bot, ChevronRight,
    Archive, CreditCard, Menu, X,
} from "lucide-react";
import { clsx } from "clsx";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/crm", label: "CRM / Leads", icon: Users },
    { href: "/admin/conversations", label: "Conversas", icon: MessageSquare },
    { href: "/admin/products", label: "Produtos", icon: Package },
    { href: "/admin/orders", label: "Pedidos", icon: BarChart3 },
    { href: "/admin/payments", label: "Pagamentos", icon: CreditCard },
    { href: "/admin/compliance", label: "Compliance", icon: ShieldCheck },
    { href: "/admin/automations", label: "Automações", icon: Zap },
    { href: "/admin/ai-config", label: "Config IA", icon: Bot },
    { href: "/admin/backup", label: "💾 Backup", icon: Archive },
    { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const SidebarContent = ({ onNavClick }: { onNavClick?: () => void }) => (
        <>
            {/* Logo */}
            <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="font-bold text-sm leading-none">
                            <span className="text-white">Bio</span>
                            <span className="gradient-text">Peptidios</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Admin Panel</div>
                    </div>
                </div>
                {/* Fechar no mobile */}
                <button
                    className="md:hidden text-slate-400 hover:text-white"
                    onClick={() => setMobileOpen(false)}
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavClick}
                            className={clsx("nav-item group", { active })}
                        >
                            <item.icon className="w-4 h-4 shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {active && <ChevronRight className="w-3 h-3 opacity-50" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-white/5">
                <div className="glass-card p-3 mb-2">
                    <div className="text-xs text-slate-400 font-medium">Modo</div>
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse-slow" />
                        <span className="text-xs text-yellow-400 font-semibold">PRE-LAUNCH</span>
                    </div>
                </div>
                <Link href="/auth/logout" onClick={onNavClick} className="nav-item text-red-400 hover:text-red-300 hover:bg-red-500/5">
                    <LogOut className="w-4 h-4" />
                    Sair
                </Link>
            </div>
        </>
    );

    return (
        <>
            {/* ── Botão hambúrguer (mobile only) ── */}
            <button
                className="md:hidden fixed top-3 left-4 z-50 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(5,20,38,0.9)", border: "1px solid rgba(255,255,255,0.1)" }}
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menu"
            >
                <Menu className="w-5 h-5 text-white" />
            </button>

            {/* ── Overlay escuro no mobile ── */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── Sidebar mobile (drawer slide-in) ── */}
            <aside
                className="md:hidden fixed top-0 left-0 h-full z-50 w-72 flex flex-col border-r border-white/10 transition-transform duration-300"
                style={{
                    background: "rgba(5,20,38,0.97)",
                    backdropFilter: "blur(16px)",
                    transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
                }}
            >
                <SidebarContent onNavClick={() => setMobileOpen(false)} />
            </aside>

            {/* ── Sidebar desktop (fixo) ── */}
            <aside
                className="hidden md:flex w-64 min-h-screen flex-col border-r border-white/10"
                style={{ background: "rgba(5,20,38,0.55)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
