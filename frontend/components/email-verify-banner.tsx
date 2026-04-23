'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.peptideosbio.com';

export default function EmailVerifyBanner() {
    const [visible, setVisible] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [showChangeEmail, setShowChangeEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [changingEmail, setChangingEmail] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Sempre consulta o backend para pegar o estado real do emailVerified
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
                if (data.emailVerified === false) setVisible(true);
            })
            .catch(() => {
                // Fallback para localStorage se a API falhar
                try {
                    const userStr = localStorage.getItem('user');
                    if (!userStr) return;
                    const user = JSON.parse(userStr);
                    setUserEmail(user.email || '');
                    if (user.emailVerified === false) setVisible(true);
                } catch { /* ignore */ }
            });
    }, []);

    if (!visible) return null;

    async function resend() {
        setSending(true);
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API}/api/auth/send-verify-email`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            setSent(true);
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
                // Atualiza o email no localStorage
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    localStorage.setItem('user', JSON.stringify({ ...user, email: newEmail }));
                }
                setUserEmail(newEmail);
                setShowChangeEmail(false);
                setSent(true);
                setNewEmail('');
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
                            <button onClick={() => setVisible(false)} style={{
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
