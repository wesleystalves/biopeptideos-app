'use client';

import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.peptideosbio.com';

const PERFIS = [
    {
        id: 'medico',
        icon: '🩺',
        title: 'Médico(a)',
        desc: 'Protocolos clínicos e dosagens baseadas em evidências',
    },
    {
        id: 'nutricionista',
        icon: '🥗',
        title: 'Nutricionista',
        desc: 'Suplementação, composição corporal e saúde metabólica',
    },
    {
        id: 'coach',
        icon: '🏋️',
        title: 'Educador Físico / Coach',
        desc: 'Performance, recuperação e periodização de treinos',
    },
    {
        id: 'saude',
        icon: '💊',
        title: 'Outro Profissional de Saúde',
        desc: 'Fisioterapeuta, biomédico, farmacêutico e outros',
    },
    {
        id: 'atleta',
        icon: '🏃',
        title: 'Atleta / Entusiasta Fitness',
        desc: 'Performance, recuperação e composição corporal',
    },
    {
        id: 'paciente',
        icon: '❤️',
        title: 'Paciente / Interessado',
        desc: 'Entender peptídeos e conversar com seu médico',
    },
];

interface Props {
    onComplete: () => void;
}

export default function OnboardingQuiz({ onComplete }: Props) {
    const [selected, setSelected] = useState('');
    const [saving, setSaving] = useState(false);
    const [step, setStep] = useState<'quiz' | 'done'>('quiz');

    async function handleConfirm() {
        if (!selected || saving) return;
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API}/api/auth/onboarding`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ profileType: selected }),
            });
            setStep('done');
            // Fechar após 1.5s
            setTimeout(() => onComplete(), 1500);
        } catch {
            setSaving(false);
        }
    }

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 10000,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '16px',
            }}
        >
            <div
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    maxWidth: '520px',
                    width: '100%',
                    padding: '32px 28px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                {step === 'done' ? (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                        <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
                            Perfeito! Bem-vindo(a)!
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                            Sua experiência foi personalizada para você.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 16px', fontSize: '24px',
                            }}>
                                ⚡
                            </div>
                            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: '0 0 8px' }}>
                                Bem-vindo(a) à BioPeptidios! 🎉
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                                Qual é o seu perfil? Vamos personalizar sua experiência.
                            </p>
                        </div>

                        {/* Opções */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                            {PERFIS.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelected(p.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '14px',
                                        padding: '14px 16px', borderRadius: '12px', border: '1.5px solid',
                                        borderColor: selected === p.id ? '#0ea5e9' : 'rgba(255,255,255,0.08)',
                                        background: selected === p.id
                                            ? 'rgba(14,165,233,0.12)'
                                            : 'rgba(255,255,255,0.03)',
                                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                                        width: '100%',
                                    }}
                                >
                                    <span style={{ fontSize: '20px', flexShrink: 0 }}>{p.icon}</span>
                                    <div>
                                        <div style={{
                                            color: selected === p.id ? '#e0f2fe' : '#fff',
                                            fontSize: '14px', fontWeight: 600, marginBottom: '2px',
                                        }}>
                                            {p.title}
                                        </div>
                                        <div style={{ color: '#64748b', fontSize: '12px' }}>{p.desc}</div>
                                    </div>
                                    {selected === p.id && (
                                        <div style={{
                                            marginLeft: 'auto', width: '20px', height: '20px',
                                            borderRadius: '50%', background: '#0ea5e9',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0, fontSize: '11px', color: '#fff', fontWeight: 700,
                                        }}>✓</div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Botão */}
                        <button
                            onClick={handleConfirm}
                            disabled={!selected || saving}
                            style={{
                                width: '100%', padding: '14px',
                                borderRadius: '12px', border: 'none',
                                background: selected
                                    ? 'linear-gradient(135deg, #0ea5e9, #6366f1)'
                                    : 'rgba(255,255,255,0.08)',
                                color: selected ? '#fff' : '#475569',
                                fontSize: '15px', fontWeight: 700,
                                cursor: selected ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s',
                                opacity: saving ? 0.7 : 1,
                            }}
                        >
                            {saving ? 'Salvando...' : 'Continuar →'}
                        </button>

                        {/* Pular */}
                        <button
                            onClick={onComplete}
                            style={{
                                display: 'block', margin: '12px auto 0',
                                background: 'none', border: 'none',
                                color: '#475569', fontSize: '12px',
                                cursor: 'pointer', textDecoration: 'underline',
                            }}
                        >
                            Pular por enquanto
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
