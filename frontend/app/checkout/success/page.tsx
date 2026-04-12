"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
    const params = useSearchParams();
    const orderId = params.get("order");

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#050d1a" }}>
            <div className="text-center max-w-sm space-y-5">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-glow-accent"
                    style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                    <CheckCircle className="w-10 h-10" style={{ color: "#34d399" }} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Pedido Confirmado!</h1>
                    {orderId && <p className="text-xs font-mono mt-1" style={{ color: "#64748b" }}>#{orderId}</p>}
                    <p className="text-sm mt-3" style={{ color: "#94a3b8" }}>
                        Seu pedido foi recebido com sucesso. Você receberá uma confirmação por email em breve.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <Link href="/account" className="btn-success justify-center flex items-center gap-2">
                        Meus Pedidos <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/catalog" className="btn-secondary justify-center">
                        Continuar comprando
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return <Suspense><SuccessContent /></Suspense>;
}
