"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function patch(k: string, v: string) {
        setForm(p => ({ ...p, [k]: v }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.password !== form.confirm) {
            setError("As senhas não coincidem.");
            return;
        }
        if (form.password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Erro ao criar conta");
            }

            const data = await res.json();
            const jwt = data.token || data.access_token;
            if (!jwt) throw new Error("Token não recebido.");

            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem("token", jwt);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Após cadastro, leva para o ebook para concluir a compra
            window.location.href = "/ebook";
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
                    <h1 className="text-xl font-bold text-white mb-1">Criar conta</h1>
                    <p className="text-slate-400 text-sm mb-6">
                        Crie sua conta para acessar o ebook e a plataforma
                    </p>

                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-medium">Nome completo</label>
                            <input
                                type="text"
                                className="input w-full"
                                placeholder="João Silva"
                                value={form.name}
                                onChange={e => patch("name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-medium">Email</label>
                            <input
                                type="email"
                                className="input w-full"
                                placeholder="seu@email.com"
                                value={form.email}
                                onChange={e => patch("email", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-medium">Senha</label>
                            <input
                                type="password"
                                className="input w-full"
                                placeholder="Mínimo 6 caracteres"
                                value={form.password}
                                onChange={e => patch("password", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-medium">Confirmar senha</label>
                            <input
                                type="password"
                                className="input w-full"
                                placeholder="••••••••"
                                value={form.confirm}
                                onChange={e => patch("confirm", e.target.value)}
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
                                <>Criar conta <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="section-divider" />
                    <p className="text-center text-sm text-slate-500">
                        Já tem conta?{" "}
                        <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 transition-colors">
                            Entrar
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-slate-600 mt-6">
                    🔒 Para se cadastrar é necessário adquirir o ebook
                </p>
            </div>
        </div>
    );
}
