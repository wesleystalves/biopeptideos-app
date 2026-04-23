'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.peptideosbio.com';
const BG = 'linear-gradient(135deg, #071a2c 0%, #083a5a 50%, #071a2c 100%)';
const BRAND = '#5b8af5';

function VerifyEmailInner() {
    const params = useSearchParams();
    const token = params.get('token') || '';
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Link inválido. Faça login e solicite um novo e-mail de verificação.');
            return;
        }
        fetch(`${API}/api/auth/verify-email?token=${token}`)
            .then(r => r.json())
            .then(data => {
                if (data.message) {
                    // Atualiza localStorage para o banner sumir imediatamente
                    try {
                        const userStr = localStorage.getItem('user');
                        if (userStr) {
                            const user = JSON.parse(userStr);
                            localStorage.setItem('user', JSON.stringify({ ...user, emailVerified: true }));
                        }
                    } catch { /* ignore */ }
                    setStatus('success');
                    setMessage(data.message);
                } else {
                    throw new Error(data.message || 'Erro ao verificar');
                }
            })
            .catch(e => {
                setStatus('error');
                setMessage(e.message || 'Link inválido ou expirado.');
            });
    }, [token]);

    return (
        <main style={{ background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px 32px', textAlign: 'center' }}>

                {status === 'loading' && (
                    <>
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
                        <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Verificando...</h1>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>Aguarde um momento.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>E-mail confirmado!</h1>
                        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
                            Sua conta está totalmente segura agora. Obrigado por confirmar!
                        </p>
                        <Link href="/painel" style={{ display: 'block', background: `linear-gradient(135deg, ${BRAND}, #00e5cc)`, color: '#fff', borderRadius: '12px', padding: '14px', fontWeight: 800, textDecoration: 'none', marginBottom: '12px' }}>
                            Ir para o painel →
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div style={{ fontSize: '56px', marginBottom: '16px' }}>❌</div>
                        <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Link inválido</h1>
                        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
                            {message || 'Este link de verificação é inválido ou já expirou.'}
                        </p>
                        <Link href="/auth/login" style={{ display: 'block', background: `linear-gradient(135deg, ${BRAND}, #00e5cc)`, color: '#fff', borderRadius: '12px', padding: '14px', fontWeight: 800, textDecoration: 'none' }}>
                            Fazer login
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div style={{ background: '#071a2c', minHeight: '100vh' }} />}>
            <VerifyEmailInner />
        </Suspense>
    );
}
