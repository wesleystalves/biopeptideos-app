'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.peptideosbio.com';
const BG = 'linear-gradient(135deg, #071a2c 0%, #083a5a 50%, #071a2c 100%)';
const BRAND = '#5b8af5';

/** Marca o localStorage como verificado para o banner sumir imediatamente */
function markVerifiedInStorage() {
    try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : {};
        localStorage.setItem('user', JSON.stringify({ ...user, emailVerified: true }));
        // Flag para o painel ignorar o cache e recarregar o /me
        sessionStorage.setItem('emailJustVerified', '1');
    } catch { /* ignore */ }
}

function VerifyEmailInner() {
    const params = useSearchParams();
    const router = useRouter();
    const token = params.get('token') || '';
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already'>('loading');
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
                // Sucesso: a API retorna { message: '...' } sem statusCode de erro
                if (data.message && !data.statusCode) {
                    markVerifiedInStorage();
                    setStatus('success');
                    setMessage(data.message);
                    // Redireciona para o painel após 2s (com flag de refresh)
                    setTimeout(() => router.replace('/painel?emailVerified=1'), 2500);
                } else if (data.statusCode === 400 || data.error) {
                    const msg = data.message || '';
                    // "E-mail já verificado" → tratar como sucesso
                    if (msg.toLowerCase().includes('já verificado') || msg.toLowerCase().includes('already verified')) {
                        markVerifiedInStorage();
                        setStatus('already');
                        setTimeout(() => router.replace('/painel?emailVerified=1'), 2500);
                    } else {
                        setStatus('error');
                        setMessage(msg || 'Link inválido ou expirado.');
                    }
                } else {
                    setStatus('error');
                    setMessage('Resposta inesperada. Tente novamente.');
                }
            })
            .catch(() => {
                setStatus('error');
                setMessage('Erro de conexão. Tente novamente mais tarde.');
            });
    }, [token, router]);

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
                            Sua conta está totalmente segura agora. Obrigado por confirmar!<br />
                            <span style={{ color: BRAND, fontSize: '13px' }}>Redirecionando para o painel...</span>
                        </p>
                        <Link href="/painel?emailVerified=1" style={{ display: 'block', background: `linear-gradient(135deg, ${BRAND}, #00e5cc)`, color: '#fff', borderRadius: '12px', padding: '14px', fontWeight: 800, textDecoration: 'none' }}>
                            Ir para o painel →
                        </Link>
                    </>
                )}

                {status === 'already' && (
                    <>
                        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                        <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>E-mail já confirmado!</h1>
                        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
                            Seu e-mail já havia sido verificado anteriormente.<br />
                            <span style={{ color: BRAND, fontSize: '13px' }}>Redirecionando para o painel...</span>
                        </p>
                        <Link href="/painel?emailVerified=1" style={{ display: 'block', background: `linear-gradient(135deg, ${BRAND}, #00e5cc)`, color: '#fff', borderRadius: '12px', padding: '14px', fontWeight: 800, textDecoration: 'none' }}>
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
