"use client";

import { useState } from "react";
import ClientLayout from "@/components/client-layout";
import { Download, Archive, CheckCircle2, AlertCircle, Loader2, Database, Users, ShoppingBag, BookOpen } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

export default function AdminBackupPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lastBackup, setLastBackup] = useState<string | null>(null);

    async function downloadBackup() {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/api/admin/backup`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Erro ao gerar backup");
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const now = new Date().toISOString().slice(0, 19).replace("T", "_").replace(/:/g, "-");
            a.href = url;
            a.download = `biopeptideos-backup-${now}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setLastBackup(new Date().toLocaleString("pt-BR"));
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    const ITEMS = [
        { icon: Users, label: "Clientes cadastrados", desc: "Emails, nomes, planos (sem senhas)" },
        { icon: ShoppingBag, label: "Pedidos & Produtos", desc: "Histórico de compras e catálogo" },
        { icon: BookOpen, label: "Ebooks & Guias", desc: "Conteúdo dos guias e protocolos de peptídeos" },
        { icon: Database, label: "Configurações", desc: "Preços, compliance (sem chaves de API)" },
        { icon: Archive, label: "Leads & CRM", desc: "Funil de vendas e conversas" },
    ];

    return (
        <ClientLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">💾 Backup do Sistema</h1>
                    <p className="text-slate-400 text-sm">
                        Exporta todos os dados da plataforma em um arquivo JSON. Guarde em local seguro.
                    </p>
                </div>

                {/* Aviso de segurança */}
                <div className="glass-card p-4 border border-amber-500/20">
                    <div className="flex gap-3 items-start">
                        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-amber-300">Dados sensíveis</p>
                            <p className="text-xs text-slate-400 mt-1">
                                O backup contém dados pessoais dos clientes (emails, nomes). Chaves de API e senhas <strong>não</strong> são incluídas.
                                Guarde o arquivo de forma segura e conforme a LGPD.
                            </p>
                        </div>
                    </div>
                </div>

                {/* O que está incluído */}
                <div className="glass-card p-6">
                    <h2 className="font-semibold text-white mb-4">O que está incluído</h2>
                    <div className="space-y-3">
                        {ITEMS.map((item) => (
                            <div key={item.label} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                                    <item.icon className="w-4 h-4 text-brand-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">{item.label}</div>
                                    <div className="text-xs text-slate-500">{item.desc}</div>
                                </div>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Erros */}
                {error && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                {/* Último backup */}
                {lastBackup && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Último backup baixado em: <strong>{lastBackup}</strong>
                    </div>
                )}

                {/* Botão de download */}
                <div className="glass-card p-6 flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                        <Archive className="w-8 h-8 text-brand-400" />
                    </div>
                    <div>
                        <p className="text-white font-semibold">Gerar backup completo</p>
                        <p className="text-slate-500 text-sm mt-1">
                            Arquivo JSON com todos os dados. Download imediato.
                        </p>
                    </div>
                    <button
                        onClick={downloadBackup}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Gerando backup...</>
                        ) : (
                            <><Download className="w-5 h-5" /> Baixar Backup</>
                        )}
                    </button>
                    <p className="text-xs text-slate-600">
                        Recomendado: fazer backup semanalmente
                    </p>
                </div>
            </div>
        </ClientLayout>
    );
}
