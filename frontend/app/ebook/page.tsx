'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.peptideosbio.com';

function fmtPrice(val: number) {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const CHAPTERS = [
    { num: '01', icon: '🧬', title: 'O que são peptídeos e como funcionam no corpo' },
    { num: '02', icon: '⚡', title: 'Os 12 peptídeos mais pesquisados para performance' },
    { num: '03', icon: '🔥', title: 'Emagrecimento acelerado: Semaglutide, BPC-157 e CJC-1295' },
    { num: '04', icon: '💪', title: 'Regeneração muscular e recuperação pós-treino' },
    { num: '05', icon: '⏳', title: 'Longevidade e anti-aging: Epitalon e TB-500' },
    { num: '06', icon: '📋', title: 'Protocolos completos de dosagem e aplicação' },
    { num: '07', icon: '🔗', title: 'Combinações sinérgicas e stacks avançados' },
    { num: '08', icon: '🛡️', title: 'Segurança, efeitos colaterais e como evitá-los' },
];

const REVIEWS = [
    { name: '@atleta_igor', role: 'Usuário verificado', text: 'Transformou minha recuperação. Em 3 semanas já sentia diferença real no treino.', stars: 5 },
    { name: '@dra_carla_m', role: 'Nutricionista', text: 'O material mais completo e científico que já li sobre o tema. Indispensável.', stars: 5 },
    { name: '@biohacker_rs', role: 'Usuário verificado', text: 'Finalmente um guia prático, sem enrolação. Minha composição corporal mudou.', stars: 5 },
];

const BG = 'linear-gradient(135deg, #071a2c 0%, #083a5a 50%, #071a2c 100%)';
const GLASS = {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
};
const BRAND = '#5b8af5';
const ACCENT = '#00e5cc';

export default function EbookPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [coupon, setCoupon] = useState('');
    const [plan, setPlan] = useState<'basic' | 'premium'>('basic');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [prices, setPrices] = useState<{ basic: number; premium: number }>({ basic: 9.9, premium: 29.9 });

    // Carrega preços do banco
    useEffect(() => {
        fetch(`${API}/api/checkout/ebook/prices`)
            .then(r => r.json())
            .then(data => {
                if (data?.basic?.price && data?.premium?.price) {
                    setPrices({ basic: data.basic.price, premium: data.premium.price });
                }
            })
            .catch(() => { /* fallback mantido */ });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userData = userStr ? JSON.parse(userStr) : null;
                const p = userData?.plan || payload?.plan || 'free';
                if (['basic', 'premium', 'admin'].includes(p)) {
                    router.replace('/ebook/reader');
                    return;
                }
                // free: fica na página mas logado
            } catch { /* ignore */ }
            setIsLoggedIn(true);
            // pré-preenche email do usuário logado
            try {
                const userData = userStr ? JSON.parse(userStr) : null;
                if (userData?.email) setEmail(userData.email);
                if (userData?.name) setName(userData.name);
            } catch { }
        }
    }, [router]);

    // Redireciona para /checkout com os dados preenchidos
    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams({
            plan,
            product: 'ebook',
            email: email || '',
            name: name || '',
            ...(coupon ? { coupon } : {}),
        });
        router.push(`/checkout?${params.toString()}`);
    };


    return (
        <main style={{ background: BG, minHeight: '100vh', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif" }}>

            {/* ── HEADER ── */}
            <header style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,26,44,0.85)' }}>
                <Link
                    href={isLoggedIn ? '/painel' : '/'}
                    style={{ fontSize: '18px', fontWeight: 800, background: `linear-gradient(90deg, ${BRAND}, ${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}
                >
                    ✦ PeptídeosBio
                </Link>
                {isLoggedIn ? (
                    <button onClick={() => router.push('/ebook/reader')}
                        style={{ background: `linear-gradient(90deg, ${BRAND}, ${ACCENT})`, color: '#fff', padding: '9px 22px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                        Acessar Ebook →
                    </button>
                ) : (
                    <Link href="/auth/login?redirect=/ebook/reader"
                        style={{ ...GLASS, color: '#e2e8f0', padding: '9px 22px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                        Entrar
                    </Link>
                )}
            </header>

            {/* ── HERO ── */}
            <section style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
                <span style={{ background: 'rgba(91,138,245,0.15)', color: BRAND, padding: '6px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', display: 'inline-block', marginBottom: '32px', border: '1px solid rgba(91,138,245,0.3)' }}>
                    🧬 BIOHACKING DE ELITE
                </span>

                <h1 style={{ fontSize: 'clamp(36px, 7vw, 64px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
                    O{' '}
                    <span style={{ background: `linear-gradient(90deg, ${BRAND}, ${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Código Secreto
                    </span>
                    {' '}dos Peptídeos
                </h1>

                <p style={{ fontSize: '18px', color: '#94afc7', lineHeight: 1.75, marginBottom: '44px', maxWidth: '560px', margin: '0 auto 44px' }}>
                    O manual completo de emagrecimento, performance, regeneração e longevidade que médicos não te contam. Leia online, aplique hoje.
                </p>

                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
                    <a href="#checkout"
                        style={{ background: `linear-gradient(135deg, ${BRAND}, ${ACCENT})`, color: '#fff', padding: '16px 36px', borderRadius: '12px', fontWeight: 800, fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 32px rgba(91,138,245,0.35)' }}>
                        Quero Acessar Agora →
                    </a>
                    <a href="#conteudo"
                        style={{ ...GLASS, color: '#cbd5e1', padding: '16px 28px', borderRadius: '12px', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>
                        Ver conteúdo
                    </a>
                </div>

                <p style={{ color: '#4a6580', fontSize: '13px' }}>
                    ✅ Mais de 1.200 pessoas já transformaram o corpo com este material
                </p>
            </section>

            {/* ── STATS STRIP ── */}
            <section style={{ maxWidth: '760px', margin: '0 auto 20px', padding: '0 24px' }}>
                <div style={{ ...GLASS, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', overflow: 'hidden', borderRadius: '16px' }}>
                    {[
                        { value: '1.200+', label: 'Leitores ativos' },
                        { value: '8', label: 'Capítulos' },
                        { value: '100%', label: 'Baseado em ciência' },
                    ].map((s) => (
                        <div key={s.label} style={{ padding: '22px 16px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ fontSize: '26px', fontWeight: 900, background: `linear-gradient(90deg, ${BRAND}, ${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CHAPTERS ── */}
            <section id="conteudo" style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>O que você vai aprender</h2>
                <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '40px', fontSize: '15px' }}>8 capítulos baseados em evidências científicas</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {CHAPTERS.map((c, i) => (
                        <div key={c.num} style={{ ...GLASS, padding: '18px 22px', display: 'flex', gap: '18px', alignItems: 'center', transition: 'border-color 0.2s' }}>
                            <span style={{ fontSize: '22px', minWidth: '32px' }}>{c.icon}</span>
                            <span style={{ color: '#64748b', fontWeight: 700, fontSize: '12px', minWidth: '28px' }}>{String(i + 1).padStart(2, '0')}</span>
                            <span style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: 1.4 }}>{c.title}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── REVIEWS ── */}
            <section style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 60px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px', textAlign: 'center' }}>O que dizem os leitores</h2>
                <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
                    {REVIEWS.map((r) => (
                        <div key={r.name} style={{ ...GLASS, padding: '22px' }}>
                            <div style={{ color: ACCENT, fontSize: '14px', marginBottom: '10px' }}>{'★'.repeat(r.stars)}</div>
                            <p style={{ color: '#94afc7', fontSize: '14px', lineHeight: 1.65, marginBottom: '16px' }}>"{r.text}"</p>
                            <p style={{ color: BRAND, fontWeight: 700, fontSize: '13px' }}>{r.name}</p>
                            <p style={{ color: '#4a6580', fontSize: '12px', marginTop: '2px' }}>{r.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CHECKOUT ── */}
            <section id="checkout" style={{ maxWidth: '480px', margin: '0 auto', padding: '0 24px 80px' }}>
                <div style={{ ...GLASS, padding: '40px 32px', borderColor: 'rgba(91,138,245,0.2)' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px', textAlign: 'center' }}>Escolha seu acesso</h2>
                    <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '28px', fontSize: '14px' }}>Acesso imediato após o pagamento</p>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        {(['basic', 'premium'] as const).map((p) => (
                            <button key={p} onClick={() => setPlan(p)}
                                style={{
                                    flex: 1, padding: '18px 12px', borderRadius: '12px',
                                    border: `2px solid ${plan === p ? BRAND : 'rgba(255,255,255,0.08)'}`,
                                    background: plan === p ? 'rgba(91,138,245,0.12)' : 'rgba(255,255,255,0.03)',
                                    color: '#fff', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                                }}>
                                {p === 'basic' ? (
                                    <>
                                        <div style={{ fontWeight: 800, marginBottom: '6px', fontSize: '15px' }}>📘 Ebook</div>
                                        <div style={{ background: `linear-gradient(90deg, ${BRAND}, ${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, fontSize: '24px' }}>R$ {fmtPrice(prices.basic)}</div>
                                        <div style={{ color: '#4a6580', fontSize: '12px', marginTop: '6px' }}>Acesso vitalício</div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ fontWeight: 800, marginBottom: '6px', fontSize: '15px' }}>🚀 Premium</div>
                                        <div style={{ background: `linear-gradient(90deg, ${BRAND}, ${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, fontSize: '24px' }}>R$ {fmtPrice(prices.premium)}</div>
                                        <div style={{ color: '#4a6580', fontSize: '12px', marginTop: '6px' }}>Ebook + IA + Plataforma</div>
                                    </>
                                )}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                            type="text"
                            placeholder="Seu nome completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none' }}
                        />
                        <input
                            type="email"
                            placeholder="Seu melhor e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 16px', color: '#fff', fontSize: '15px', outline: 'none' }}
                        />
                        <input
                            type="text"
                            placeholder="Cupom de desconto (opcional)"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }}
                        />
                        {error && (
                            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '12px 16px', color: '#f87171', fontSize: '14px' }}>
                                {error}
                            </div>
                        )}
                        <button type="submit" disabled={loading}
                            style={{ background: `linear-gradient(135deg, ${BRAND}, ${ACCENT})`, color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: 800, fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 6px 24px rgba(91,138,245,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {loading
                                ? <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Processando...</>
                                : <>Acessar Agora → R$ {fmtPrice(prices[plan])}</>}
                        </button>
                    </form>

                    <p style={{ color: '#334155', fontSize: '12px', textAlign: 'center', marginTop: '18px' }}>
                        🔒 Pagamento seguro via PIX, Boleto ou Cartão
                    </p>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, background: `linear-gradient(90deg, ${BRAND}, ${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ✦ PeptídeosBio
                </span>
                <p style={{ color: '#334155', fontSize: '12px', marginTop: '8px' }}>
                    © 2025 PeptídeosBio · <Link href="/auth/login" style={{ color: '#4a6580', textDecoration: 'none' }}>Já tenho acesso</Link>
                </p>
            </footer>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </main>
    );
}
