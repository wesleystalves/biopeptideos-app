'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.peptideosbio.com';
const BG = 'linear-gradient(135deg, #071a2c 0%, #083a5a 50%, #071a2c 100%)';
const BRAND = '#5b8af5';

function ResetPasswordInner() {
    const params = useSearchParams();
    const router = useRouter();
    const token = params.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) setError('Link inválido ou expirado. Solicite um novo link de recuperação.');
    }, [token]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password.length < 6) { setError('A senha deve ter no mínimo 6 caracteres'); return; }
        if (password !== confirm) { setError('As senhas não coincidem'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Erro ao redefinir senha');
            setSuccess(true);
            setTimeout(() => router.push('/auth/login'), 3000);
        } catch (e: any) {
            setError(e.message);
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
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>{success ? '✅' : '🔐'}</div>
                    <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, margin: '0 0 8px' }}>
                        {success ? 'Senha redefinida!' : 'Criar nova senha'}
                    </h1>
                    {!success && <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Escolha uma senha para sua conta.</p>}
                </div>

                {success ? (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
                            Sua senha foi redefinida com sucesso! Redirecionando para o login...
                        </p>
                        <Link href="/auth/login" style={{ display: 'block', background: `linear-gradient(135deg, ${BRAND}, #00e5cc)`, color: '#fff', borderRadius: '12px', padding: '14px', fontWeight: 800, textDecoration: 'none' }}>
                            Ir para o login →
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
                            <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>Nova senha</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres" required style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>Confirmar senha</label>
                            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                                placeholder="Repita a senha" required style={inputStyle} />
                        </div>
                        <button type="submit" disabled={loading || !token} style={{
                            background: `linear-gradient(135deg, ${BRAND}, #00e5cc)`, color: '#fff',
                            border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 800,
                            fontSize: '15px', cursor: (loading || !token) ? 'not-allowed' : 'pointer', opacity: (loading || !token) ? 0.7 : 1,
                        }}>
                            {loading ? 'Salvando...' : 'Salvar nova senha'}
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div style={{ background: '#071a2c', minHeight: '100vh' }} />}>
            <ResetPasswordInner />
        </Suspense>
    );
}
