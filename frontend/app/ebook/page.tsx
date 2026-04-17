'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.peptideosbio.com';

const CHAPTERS = [
    { num: '01', title: 'O que são peptídeos e como funcionam no corpo' },
    { num: '02', title: 'Os 12 peptídeos mais pesquisados para performance' },
    { num: '03', title: 'Emagrecimento acelerado: Semaglutide, BPC-157 e CJC-1295' },
    { num: '04', title: 'Regeneração muscular e recuperação pós-treino' },
    { num: '05', title: 'Longevidade e anti-aging: Epitalon e TB-500' },
    { num: '06', title: 'Protocolos completos de dosagem e aplicação' },
    { num: '07', title: 'Combinações sinérgicas e stacks avançados' },
    { num: '08', title: 'Segurança, efeitos colaterais e como evitá-los' },
];

const REVIEWS = [
    { name: '@atleta_igor', role: 'Usuário verificado', text: 'Transformou minha recuperação. Em 3 semanas já sentia diferença no treino.' },
    { name: '@dra_carla_m', role: 'Nutricionista', text: 'O material mais completo e científico que já li sobre o tema. Recomendo.' },
    { name: '@biohacker_rs', role: 'Usuário verificado', text: 'Finalmente um guia prático, sem enrolação. Minha composição corporal mudou.' },
];

type Plan = 'basic' | 'premium';
type Prices = { basic: { price: number }; premium: { price: number } };

export default function EbookPage() {
    const router = useRouter();
    const [plan, setPlan] = useState<Plan>('basic');
    const [prices, setPrices] = useState<Prices | null>(null);
    const [form, setForm] = useState({ name: '', email: '', coupon: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Carrega preços do backend
    useEffect(() => {
        fetch(`${API}/api/checkout/ebook/prices`)
            .then(r => r.json())
            .then(setPrices)
            .catch(() => setPrices({ basic: { price: 9.9 }, premium: { price: 29.9 } }));
    }, []);

    // Verifica se usuário já tem acesso
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userData = userStr ? JSON.parse(userStr) : null;
                const userPlan = userData?.plan || payload?.plan || 'free';
                if (['basic', 'premium', 'admin'].includes(userPlan)) {
                    router.replace('/ebook/reader');
                    return;
                }
            } catch { /* ignore */ }
            // Logado mas sem plano pago
            const userData = userStr ? JSON.parse(userStr) : null;
            setForm(f => ({
                ...f,
                name: userData?.name || userData?.displayName || '',
                email: userData?.email || '',
            }));
            setIsLoggedIn(true);
        }
    }, [router]);

    function patch(k: string, v: string) {
        setForm(f => ({ ...f, [k]: v }));
    }

    async function handleCheckout(e: React.FormEvent) {
        e.preventDefault();
        if (!form.email) { setError('Informe seu email.'); return; }
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API}/api/checkout/ebook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan,
                    email: form.email,
                    name: form.name || form.email.split('@')[0],
                    coupon: form.coupon || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Erro ao criar pedido');
            }

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error('Link de pagamento não retornado');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const currentPrice = prices ? prices[plan].price : (plan === 'basic' ? 9.9 : 29.9);

    return (
        <main style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
            {/* Header */}
            <header style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#00d4aa' }}>✦ PeptidiosCode</span>
                {isLoggedIn ? (
                    <button onClick={() => router.push('/ebook/reader')}
                        style={{ background: '#00d4aa', color: '#000', padding: '8px 20px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                        Acessar Ebook →
                    </button>
                ) : (
                    <Link href="/auth/login?redirect=/ebook/reader" style={{ background: '#1a1a1a', color: '#fff', padding: '8px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
                        Entrar
                    </Link>
                )}
            </header>

            {/* Hero */}
            <section style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
                <span style={{ background: '#0d3d30', color: '#00d4aa', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', display: 'inline-block', marginBottom: '28px' }}>
                    🧬 BIOHACKING DE ELITE
                </span>

                <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '24px' }}>
                    O <span style={{ color: '#00d4aa' }}>Código Secreto</span>{' '}
                    dos Peptídeos
                </h1>

                <p style={{ fontSize: '18px', color: '#a0a0a0', lineHeight: 1.7, marginBottom: '40px', maxWidth: '560px', margin: '0 auto 40px' }}>
                    O manual completo de emagrecimento, performance, regeneração e longevidade que médicos não te contam. Leia online, aplique hoje.
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
                    <a href="#checkout" style={{ background: '#00d4aa', color: '#000', padding: '16px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        Quero Acessar Agora →
                    </a>
                    <a href="#conteudo" style={{ background: '#1a1a1a', color: '#fff', padding: '16px 28px', borderRadius: '10px', fontWeight: 600, fontSize: '16px', textDecoration: 'none', border: '1px solid #333' }}>
                        Ver conteúdo
                    </a>
                </div>

                <p style={{ color: '#555', fontSize: '13px' }}>
                    ✅ Mais de 1.200 pessoas já transformaram o corpo com este material
                </p>
            </section>

            {/* Conteúdo */}
            <section id="conteudo" style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>O que você vai aprender</h2>
                <p style={{ color: '#666', textAlign: 'center', marginBottom: '40px' }}>8 capítulos baseados em evidências científicas</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {CHAPTERS.map((c) => (
                        <div key={c.num} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '18px 24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <span style={{ color: '#00d4aa', fontWeight: 800, fontSize: '20px', minWidth: '32px' }}>{c.num}</span>
                            <span style={{ color: '#e0e0e0', fontSize: '15px' }}>{c.title}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Depoimentos */}
            <section style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px 60px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>O que dizem os leitores</h2>
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    {REVIEWS.map((r) => (
                        <div key={r.name} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px' }}>
                            <p style={{ color: '#ccc', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>"{r.text}"</p>
                            <p style={{ color: '#00d4aa', fontWeight: 600, fontSize: '13px' }}>{r.name}</p>
                            <p style={{ color: '#555', fontSize: '12px' }}>{r.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Checkout */}
            <section id="checkout" style={{ maxWidth: '480px', margin: '0 auto', padding: '0 24px 80px' }}>
                <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '40px 32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Escolha seu acesso</h2>
                    <p style={{ color: '#666', textAlign: 'center', marginBottom: '28px', fontSize: '14px' }}>Acesso imediato após o pagamento</p>

                    {/* Seletor de plano */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        {(['basic', 'premium'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPlan(p)}
                                style={{
                                    flex: 1, padding: '16px', borderRadius: '10px',
                                    border: `2px solid ${plan === p ? '#00d4aa' : '#2a2a2a'}`,
                                    background: plan === p ? '#0d3d30' : '#1a1a1a',
                                    color: '#fff', cursor: 'pointer', textAlign: 'center',
                                }}
                            >
                                {p === 'basic' ? (
                                    <>
                                        <div style={{ fontWeight: 700, marginBottom: '4px' }}>📘 Ebook</div>
                                        <div style={{ color: '#00d4aa', fontWeight: 800, fontSize: '22px' }}>
                                            R$ {prices ? prices.basic.price.toFixed(2).replace('.', ',') : '9,90'}
                                        </div>
                                        <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>Acesso vitalício</div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ fontWeight: 700, marginBottom: '4px' }}>🚀 Premium</div>
                                        <div style={{ color: '#00d4aa', fontWeight: 800, fontSize: '22px' }}>
                                            R$ {prices ? prices.premium.price.toFixed(2).replace('.', ',') : '29,90'}
                                        </div>
                                        <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>Ebook + IA + Plataforma</div>
                                    </>
                                )}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px 16px', color: '#fca5a5', fontSize: '14px', marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                            type="text"
                            placeholder="Seu nome completo"
                            value={form.name}
                            onChange={e => patch('name', e.target.value)}
                            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none' }}
                        />
                        <input
                            type="email"
                            placeholder="Seu melhor e-mail *"
                            value={form.email}
                            onChange={e => patch('email', e.target.value)}
                            required
                            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none' }}
                        />
                        <input
                            type="text"
                            placeholder="Cupom de desconto (opcional)"
                            value={form.coupon}
                            onChange={e => patch('coupon', e.target.value)}
                            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none' }}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: loading ? '#005540' : '#00d4aa',
                                color: '#000', padding: '16px', borderRadius: '10px',
                                fontWeight: 700, fontSize: '16px', border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}
                        >
                            {loading ? (
                                <span style={{ width: '16px', height: '16px', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                            ) : (
                                `Acessar Agora → R$ ${currentPrice.toFixed(2).replace('.', ',')}`
                            )}
                        </button>
                    </form>

                    <p style={{ color: '#444', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
                        🔒 Pagamento seguro via PIX, Boleto ou Cartão
                    </p>

                    <div style={{ borderTop: '1px solid #1f1f1f', marginTop: '20px', paddingTop: '16px', textAlign: 'center' }}>
                        <p style={{ color: '#555', fontSize: '13px' }}>
                            Não tem conta?{' '}
                            <Link href="/auth/register" style={{ color: '#00d4aa', textDecoration: 'none' }}>
                                Criar conta grátis
                            </Link>
                            {' '}após a compra
                        </p>
                    </div>
                </div>
            </section>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </main>
    );
}
