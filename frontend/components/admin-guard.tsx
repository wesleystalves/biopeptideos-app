"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.peptideosbio.com";

/**
 * AdminGuard — envolve todo o layout /admin.
 * Verifica se o usuário tem token válido E flag isAdmin = true.
 * Redireciona para /auth/login se não autenticado, ou /painel se não for admin.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [status, setStatus] = useState<"checking" | "allowed" | "denied">("checking");

    useEffect(() => {
        const token = localStorage.getItem("token");

        // 1. Sem token → login
        if (!token) {
            router.replace("/auth/login?redirect=/admin");
            return;
        }

        // 2. Decodifica o payload do JWT localmente (verificação rápida)
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));

            // Token expirado
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.replace("/auth/login?redirect=/admin");
                return;
            }

            // Não é admin (checagem local rápida — o backend também valida)
            if (!payload.isAdmin) {
                setStatus("denied");
                router.replace("/painel");
                return;
            }
        } catch {
            // Token malformado
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/auth/login?redirect=/admin");
            return;
        }

        // 3. Valida com o backend (fonte da verdade)
        fetch(`${API}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => {
                if (!r.ok) throw new Error("Unauthorized");
                return r.json();
            })
            .then((user) => {
                if (!user?.isAdmin) {
                    setStatus("denied");
                    router.replace("/painel");
                    return;
                }
                setStatus("allowed");
            })
            .catch(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.replace("/auth/login?redirect=/admin");
            });
    }, [router]);

    // Tela de carregamento enquanto verifica
    if (status === "checking") {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #061524 0%, #071a2c 100%)",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        border: "3px solid rgba(91,138,245,0.2)",
                        borderTopColor: "#5b8af5",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                    }}
                />
                <p style={{ color: "#4a6580", fontSize: "14px" }}>Verificando acesso...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Negado → não renderiza nada (router.replace já foi chamado)
    if (status === "denied") return null;

    return <>{children}</>;
}
