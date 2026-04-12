"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Bot, User, Circle } from "lucide-react";
import { clsx } from "clsx";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.biopeptidios.dev.aiwhatsapp.com.br";

const CHANNEL_COLORS: Record<string, string> = {
    whatsapp: "text-green-400",
    telegram: "text-brand-400",
    email: "text-orange-400",
    chat: "text-accent-400",
};

export default function ConversationsPage() {
    const [inbox, setInbox] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({});
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const messagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!token) return;
        fetch(`${API}/api/conversations/inbox`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json()).then((data) => setInbox(Array.isArray(data) ? data : []))
            .catch(console.error);

        fetch(`${API}/api/conversations/stats`, { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json()).then(setStats)
            .catch(console.error);
    }, [token]);

    useEffect(() => {
        if (!selected?.lead?.id || !token) return;
        fetch(`${API}/api/conversations/history/${selected.lead.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json()).then((data) => setHistory(Array.isArray(data) ? data : []))
            .catch(console.error);
    }, [selected, token]);

    useEffect(() => {
        messagesRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
    }, [history]);

    return (
        <div className="flex gap-6 h-[calc(100vh-112px)]">
            {/* Inbox list */}
            <div className="w-80 flex flex-col glass-card overflow-hidden shrink-0">
                {/* Header */}
                <div className="p-4 border-b border-white/5">
                    <h1 className="font-semibold text-white">Conversas</h1>
                    <div className="flex gap-3 mt-3">
                        {Object.entries(stats).map(([ch, count]) => (
                            <div key={ch} className="text-center">
                                <div className={`text-sm font-bold ${CHANNEL_COLORS[ch] || "text-slate-400"}`}>{count as any}</div>
                                <div className="text-[10px] text-slate-600 capitalize">{ch.slice(0, 2)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conversation items */}
                <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                    {inbox.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-600 text-sm p-6 text-center">
                            <Circle className="w-8 h-8 mb-2 opacity-30" />
                            Nenhuma conversa ainda.<br />
                            Configure o webhook do Evolution API para receber mensagens.
                        </div>
                    ) : inbox.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setSelected(item)}
                            className={clsx(
                                "w-full text-left p-4 hover:bg-white/5 transition-colors",
                                selected?.lead?.id === item?.lead?.id && "bg-brand-500/10 border-l-2 border-brand-500"
                            )}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-dark-900 flex items-center justify-center text-sm">
                                    {item?.lead?.name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white truncate">
                                        {item?.lead?.name || item?.lead?.phone || "Desconhecido"}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate mt-0.5">
                                        {item?.lastMessage?.content?.slice(0, 40) || "Sem mensagem"}
                                    </div>
                                </div>
                                <span className={`text-xs font-bold uppercase ${CHANNEL_COLORS[item?.lead?.channel] || "text-slate-500"}`}>
                                    {item?.lead?.channel?.slice(0, 2)}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Message thread */}
            <div className="flex-1 glass-card flex flex-col overflow-hidden">
                {!selected ? (
                    <div className="flex-1 flex items-center justify-center text-slate-600 flex-col gap-2">
                        <Bot className="w-12 h-12 opacity-20" />
                        <p className="text-sm">Selecione uma conversa</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 border-b border-white/5 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center font-bold text-brand-400">
                                {selected?.lead?.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div>
                                <div className="font-medium text-white">{selected?.lead?.name || selected?.lead?.phone}</div>
                                <div className="text-xs text-slate-500">Score: {selected?.lead?.score} · {selected?.lead?.status}</div>
                            </div>
                        </div>

                        <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                            {history.map((msg, i) => (
                                <div key={i} className={clsx("flex gap-2 max-w-[80%]", msg.role === "assistant" ? "ml-auto flex-row-reverse" : "")}>
                                    <div className={clsx("w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs",
                                        msg.role === "assistant" ? "bg-brand-600" : "bg-dark-800"
                                    )}>
                                        {msg.role === "assistant" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className={clsx("px-3 py-2 rounded-2xl text-sm leading-relaxed",
                                        msg.role === "assistant"
                                            ? "bg-brand-600/20 border border-brand-500/20 text-white rounded-tr-sm"
                                            : "bg-white/5 text-slate-200 rounded-tl-sm"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
