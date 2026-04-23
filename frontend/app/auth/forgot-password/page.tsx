'use client';

import { useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.peptideosbio.com';
const BG = 'linear-gradient(135deg, #071a2c 0%, #083a5a 50%, #071a2c 100%)';
const BRAND = '#5b8af5';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim()) { setError('Informe seu e-mail'); return; }
        setLoading(true);
        setError('');
        try {
            await fetch(`${API}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            setSent(true);
        } catch {
            setError('Erro ao enviar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
        padding: '13px 16px', color: '#fff', fontSize: '15px', outline: 'none',
    };

    return (
        <main style={{ background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px 32px' }}>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
                    <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, margin: '0 0 8px' }}>Recuperar senha</h1>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                        Informe seu e-mail e enviaremos um link para redefinir sua senha.
                    </p>
                </div>

                {sent ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
                        <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>E-mail enviado!</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
                            Se o e-mail <strong style={{ color: '#94afc7' }}>{email}</strong> estiver cadastrado, você receberá um link em instantes.
                            <br /><br />Verifique também a pasta de spam.
                        </p>
                        <Link href="/auth/login" style={{ display: 'block', textAlign: 'center', color: BRAND, fontSize: '14px', textDecoration: 'none' }}>
                            ← Voltar para o login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {error && (
                            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '12px 16px', color: '#f87171', fontSize: '14px' }}>
                                {error}
                            </div>
                        )}
                        <div>
                            <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>E-mail cadastrado</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                style={inputStyle}
                            />
                        </div>
                        <button type="submit" disabled={loading} style={{
                            background: `linear-gradient(135deg, ${BRAND}, #00e5cc)`, color: '#fff',
                            border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 800,
                            fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                        }}>
                            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                        </button>
                        <Link href="/auth/login" style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', textDecoration: 'none' }}>
                            ← Voltar para o login
                        </Link>
                    </form>
                )}
            </div>
        </main>
    );
}
