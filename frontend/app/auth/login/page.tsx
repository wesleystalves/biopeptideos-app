"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dw.peptideosbio.com";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Credenciais inválidas");
            }

            const data = await res.json();
            // API retorna { token, user } — limpar sessão anterior antes de salvar nova
            const jwt = data.token || data.access_token;
            if (!jwt) throw new Error("Token não recebido. Verifique suas credenciais.");

            // ── Limpar TODA sessão anterior antes de gravar a nova ──────────
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(';').forEach(c => {
                document.cookie = c.trim().replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/');
            });

            localStorage.setItem("token", jwt);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user?.isAdmin) {
                window.location.href = "/admin";
            } else {
                window.location.href = "/painel";
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex items-center gap-2 justify-center mb-8">
                    <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">
                        <span className="text-white">Bio</span>
                        <span className="gradient-text">Peptidios</span>
                    </span>
                </div>

                <div className="glass-card p-8">
                    <h1 className="text-xl font-bold text-white mb-1">Entrar</h1>
                    <p className="text-slate-400 text-sm mb-6">Acesse sua conta ou o painel admin</p>

                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-medium">Email</label>
                            <input
                                type="email"
                                className="input w-full"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-medium">Senha</label>
                            <input
                                type="password"
                                className="input w-full"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Entrar <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="section-divider" />
                    <p className="text-center text-sm text-slate-500">
                        Não tem conta?{" "}
                        <Link href="/auth/register" className="text-brand-400 hover:text-brand-300 transition-colors">
                            Criar conta
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
