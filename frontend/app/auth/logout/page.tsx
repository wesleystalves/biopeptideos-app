"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        // Limpar toda a sessão
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(';').forEach(c => {
            document.cookie = c.trim().replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/');
        });

        // Redirecionar
        router.push("/");
    }, [router]);

    return (
        <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
            <div className="text-center text-white">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p>Saindo com segurança...</p>
            </div>
        </div>
    );
}
