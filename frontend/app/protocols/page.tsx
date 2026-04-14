"use client";

import ClientLayout from "@/components/client-layout";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dw.peptideosbio.com";

type Protocol = { id: string; name: string; description?: string; duration?: string; peptides?: string[] };

export default function ProtocolsPage() {
    const [protocols, setProtocols] = useState<Protocol[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${API}/api/protocols`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(d => { setProtocols(Array.isArray(d) ? d : d.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <ClientLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Meus Protocolos</h1>
                    <p className="text-slate-400 text-sm">Protocolos clínicos personalizados e salvos para você.</p>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="glass-card h-24 animate-pulse bg-white/5" />)}
                    </div>
                ) : protocols.length === 0 ? (
                    <div className="glass-card p-12 text-center space-y-4">
                        <BookOpen className="w-12 h-12 text-slate-700 mx-auto" />
                        <div>
                            <p className="text-white font-semibold mb-1">Nenhum protocolo salvo</p>
                            <p className="text-slate-400 text-sm">Explore a biblioteca de Stacks para começar</p>
                        </div>
                        <Link href="/stacks" className="btn-primary inline-flex items-center gap-2">
                            Ver Stacks <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {protocols.map(p => (
                            <div key={p.id} className="glass-card p-5 hover:border-brand-500/30 transition-all">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="font-bold text-white mb-1">{p.name}</h2>
                                        {p.description && <p className="text-slate-400 text-sm">{p.description}</p>}
                                        {p.peptides && (
                                            <div className="flex gap-1.5 flex-wrap mt-2">
                                                {p.peptides.map(pep => (
                                                    <span key={pep} className="px-2 py-0.5 bg-brand-600/15 text-brand-400 text-xs rounded-full">{pep}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {p.duration && <span className="text-xs text-slate-500 ml-4 flex-shrink-0">{p.duration}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}
