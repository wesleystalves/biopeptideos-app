'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.peptideosbio.com';

/** Tempo (ms) para o banner reaparecer após clicar em "Agora não" */
const SNOOZE_MS = 5 * 60 * 1000; // 5 minutos

export default function EmailVerifyBanner() {
    const [visible, setVisible] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [showChangeEmail, setShowChangeEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [changingEmail, setChangingEmail] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    // Lê o query param para detectar redirect pós-verificação
    // Não podemos usar useSearchParams diretamente aqui (pode estar fora de Suspense),
    // então lemos via window.location
    function wasJustVerified() {
        if (typeof window === 'undefined') return false;
        const params = new URLSearchParams(window.location.search);
        return params.get('emailVerified') === '1' || sessionStorage.getItem('emailJustVerified') === '1';
    }

    useEffect(() => {
        // Se acabou de verificar, nunca mostra o banner
        if (wasJustVerified()) {
            sessionStorage.removeItem('emailJustVerified');
            return;
        }

        function checkVerification() {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Consulta sempre o backend para pegar o estado real
            fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
                .then(r => r.ok ? r.json() : null)
                .then(data => {
                    if (!data) return;
                    // Atualiza localStorage com dados frescos
                    try {
                        const userStr = localStorage.getItem('user');
                        const user = userStr ? JSON.parse(userStr) : {};
                        localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
                    } catch { /* ignore */ }

                    setUserEmail(data.email || '');

                    if (data.emailVerified === true) {
                        // Verificado! Garante que o banner nunca mais aparece
                        setVisible(false);
                        return;
                    }

                    // Não verificado — verifica se está em snooze
                    const snoozeUntil = parseInt(sessionStorage.getItem('emailBannerSnooze') || '0', 10);
                    if (Date.now() < snoozeUntil) return; // ainda em snooze

                    setVisible(true);
                })
                .catch(() => {
                    // Fallback para localStorage se a API falhar
                    try {
                        const userStr = localStorage.getItem('user');
                        if (!userStr) return;
                        const user = JSON.parse(userStr);
                        setUserEmail(user.email || '');
                        if (user.emailVerified === true) { setVisible(false); return; }
                        const snoozeUntil = parseInt(sessionStorage.getItem('emailBannerSnooze') || '0', 10);
                        if (Date.now() >= snoozeUntil) setVisible(true);
                    } catch { /* ignore */ }
                });
        }

        // Verificação imediata
        checkVerification();

        // Recheck a cada 5 minutos (para que o banner reapareça após snooze)
        const interval = setInterval(checkVerification, SNOOZE_MS);
        return () => clearInterval(interval);
    }, []);

    if (!visible) return null;

    function dismiss() {
        // Snooze por 5 minutos
        sessionStorage.setItem('emailBannerSnooze', String(Date.now() + SNOOZE_MS));
        setVisible(false);
    }

    async function resend() {
        setSending(true);
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API}/api/auth/send-verify-email`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            setSent(true);
            // Após enviar, snooze por 5 min para não irritar
            sessionStorage.setItem('emailBannerSnooze', String(Date.now() + SNOOZE_MS));
        } catch { /* ignore */ }
        setSending(false);
    }

    async function changeEmail(e: React.FormEvent) {
        e.preventDefault();
        setChangingEmail(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/api/auth/change-email`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ email: newEmail }),
            });
            if (res.ok) {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    localStorage.setItem('user', JSON.stringify({ ...user, email: newEmail, emailVerified: false }));
                }
                setUserEmail(newEmail);
                setShowChangeEmail(false);
                setSent(true);
                setNewEmail('');
                sessionStorage.setItem('emailBannerSnooze', String(Date.now() + SNOOZE_MS));
            }
        } catch { /* ignore */ }
        setChangingEmail(false);
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(234,179,8,0.1), rgba(234,179,8,0.05))',
            border: '1px solid rgba(234,179,8,0.25)',
            borderRadius: '12px',
            padding: '14px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
        }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</span>
            <div style={{ flex: 1 }}>
                {sent ? (
                    <p style={{ color: '#86efac', fontSize: '14px', margin: 0 }}>
                        ✅ E-mail de confirmação enviado! Verifique sua caixa de entrada.
                    </p>
                ) : (
                    <>
                        <p style={{ color: '#fef08a', fontSize: '14px', margin: '0 0 8px', fontWeight: 600 }}>
                            Confirme seu e-mail
                        </p>
                        <p style={{ color: '#ca8a04', fontSize: '13px', margin: '0 0 10px', lineHeight: 1.5 }}>
                            Enviamos um link de verificação para <strong>{userEmail}</strong>. Confirme para garantir o acesso total à sua conta.
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button onClick={resend} disabled={sending} style={{
                                background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.3)',
                                color: '#fde047', borderRadius: '8px', padding: '6px 14px',
                                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                            }}>
                                {sending ? 'Enviando...' : '📨 Reenviar e-mail'}
                            </button>
                            <button onClick={() => setShowChangeEmail(!showChangeEmail)} style={{
                                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                                color: '#94a3b8', borderRadius: '8px', padding: '6px 14px',
                                fontSize: '13px', cursor: 'pointer',
                            }}>
                                ✏️ Trocar e-mail
                            </button>
                            <button onClick={dismiss} style={{
                                background: 'transparent', border: 'none',
                                color: '#475569', fontSize: '12px', cursor: 'pointer',
                            }}>
                                ✕ Agora não
                            </button>
                        </div>
                        {showChangeEmail && (
                            <form onSubmit={changeEmail} style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <input
                                    type="email"
                                    placeholder="novo@email.com"
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    required
                                    style={{
                                        flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
                                        padding: '7px 12px', color: '#fff', fontSize: '13px',
                                    }}
                                />
                                <button type="submit" disabled={changingEmail} style={{
                                    background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.3)',
                                    color: '#fde047', borderRadius: '8px', padding: '7px 14px',
                                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                }}>
                                    {changingEmail ? 'Salvando...' : 'Salvar'}
                                </button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
