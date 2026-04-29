'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ObrigadoPage() {
    const [segundos, setSegundos] = useState(5);

    useEffect(() => {
        // Disparar evento generate_lead no Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'generate_lead', {
                event_category: 'ebook',
                event_label: 'cadastro_ebook',
                value: 1,
            });
        }

        // Redirecionar para o painel após 5 segundos
        const interval = setInterval(() => {
            setSegundos(s => {
                if (s <= 1) {
                    clearInterval(interval);
                    window.location.href = '/painel';
                }
                return s - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #061524 0%, #071a2c 50%, #0a1f35 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', system-ui, sans-serif",
            padding: '24px',
        }}>
            <div style={{
                maxWidth: '540px',
                width: '100%',
                textAlign: 'center',
            }}>
                {/* Ícone animado */}
                <div style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #5b8af5, #00e5cc)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 32px',
                    fontSize: '48px',
                    boxShadow: '0 0 40px rgba(91,138,245,0.4)',
                    animation: 'pulse 2s ease-in-out infinite',
                }}>
                    🎉
                </div>

                <h1 style={{
                    fontSize: 'clamp(28px, 6vw, 48px)',
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: 1.1,
                    marginBottom: '16px',
                    letterSpacing: '-1px',
                }}>
                    Bem-vindo à{' '}
                    <span style={{
                        background: 'linear-gradient(90deg, #5b8af5, #00e5cc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        PeptídeosBio!
                    </span>
                </h1>

                <p style={{
                    fontSize: '18px',
                    color: '#94afc7',
                    lineHeight: 1.7,
                    marginBottom: '40px',
                }}>
                    Sua conta foi criada com sucesso. 🧬<br />
                    Agora você tem acesso ao seu painel e pode explorar o conteúdo.
                </p>

                {/* Card de próximo passo */}
                <div style={{
                    background: 'rgba(91,138,245,0.1)',
                    border: '1px solid rgba(91,138,245,0.25)',
                    borderRadius: '20px',
                    padding: '32px',
                    marginBottom: '32px',
                }}>
                    <p style={{ color: '#5b8af5', fontWeight: 700, fontSize: '13px', letterSpacing: '1px', marginBottom: '12px' }}>
                        PRÓXIMO PASSO
                    </p>
                    <p style={{ color: '#e2e8f0', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
                        Explore o <strong style={{ color: '#fff' }}>Código Secreto dos Peptídeos</strong> e descubra como otimizar seu corpo com ciência.
                    </p>
                    <Link
                        href="/painel"
                        style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #5b8af5, #00e5cc)',
                            color: '#fff',
                            padding: '14px 32px',
                            borderRadius: '12px',
                            fontWeight: 800,
                            fontSize: '15px',
                            textDecoration: 'none',
                            boxShadow: '0 8px 32px rgba(91,138,245,0.35)',
                        }}
                    >
                        Acessar meu Painel →
                    </Link>
                </div>

                <p style={{ color: '#4a6580', fontSize: '13px' }}>
                    Redirecionando automaticamente em{' '}
                    <span style={{ color: '#5b8af5', fontWeight: 700 }}>{segundos}s</span>...
                </p>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(91,138,245,0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 0 60px rgba(91,138,245,0.6); }
                }
            `}</style>
        </div>
    );
}
