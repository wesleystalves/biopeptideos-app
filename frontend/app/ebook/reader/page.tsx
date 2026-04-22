"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EbookShell from "@/components/EbookShell";

const CHAPTERS = [
    {
        num: "01", title: "O que são peptídeos e como funcionam no corpo", tag: "Fundamentos",
        color: "from-blue-600/20 to-blue-500/5", border: "border-blue-500/20", icon: "🧬",
        content: `### O que são peptídeos?\n\nPeptídeos são cadeias curtas de aminoácidos — os blocos fundamentais das proteínas — com geralmente 2 a 50 aminoácidos ligados por ligações peptídicas. Diferente das proteínas completas, que têm estruturas muito complexas, os peptídeos são menores e mais fáceis de serem absorvidos e utilizados pelo organismo.\n\n**Como funcionam no corpo:**\n\nOs peptídeos atuam como **mensageiros biológicos**. Eles interagem com receptores específicos em células-alvo, desencadeando cascatas de sinalização que regulam funções vitais como:\n\n- Produção e liberação de hormônios (GH, insulina, cortisol)\n- Reparo e regeneração celular\n- Resposta inflamatória e imunológica\n- Síntese de colágeno e elastina\n- Regulação do metabolismo e composição corporal\n\n### Mecanismo de ação\n\nAo chegar ao receptor alvo, o peptídeo se encaixa como uma "chave na fechadura", ativando ou inibindo reações específicas. Por isso, cada peptídeo tem uma função altamente específica — sem os efeitos sistêmicos amplos dos hormônios tradicionais.\n\n### Por que a ciência investe tanto?\n\nNos últimos 20 anos, mais de 60 peptídeos foram aprovados como medicamentos. A precisão de ação, a curta meia-vida e a baixa toxicidade os tornam candidatos ideais para tratamentos de alta performance e longevidade.\n\n> **Ponto chave:** Peptídeos não substituem hábitos saudáveis — eles potencializam o que seu corpo já faz de melhor.`,
    },
    {
        num: "02", title: "Os 12 peptídeos mais pesquisados para performance", tag: "Performance",
        color: "from-emerald-600/20 to-emerald-500/5", border: "border-emerald-500/20", icon: "⚡",
        content: `### Os 12 peptídeos mais estudados para performance humana\n\n**1. BPC-157** — Regeneração de tecidos, anti-inflamatório sistêmico, proteção gástrica.\n\n**2. TB-500** — Mobiliza células-tronco, acelera cicatrização muscular e tendínea.\n\n**3. CJC-1295** — Estimula liberação pulsátil de GH. Combinado com GHRP aumenta IGF-1.\n\n**4. Ipamorelin** — GHRP altamente seletivo. Libera GH sem elevar cortisol ou prolactina.\n\n**5. Hexarelin** — Potente liberador de GH. Ação cardioprotegora documentada.\n\n**6. GHRP-6 e GHRP-2** — Estimulam fome e GH. GHRP-2 tem efeito mais limpo no cortisol.\n\n**7. MGF** — Variante do IGF-1 ativada por dano muscular. Hipertrofia intensa e reparo localizado.\n\n**8. Follistatina 344** — Inibe miostatina. Potencial de crescimento muscular sem andrógenos.\n\n**9. Epithalon** — Peptídeo da glândula pineal. Longevidade, antioxidante, reparo de DNA.\n\n**10. PT-141** — Receptor de melanocortina. Libido e função sexual masculina e feminina.\n\n**11. Selank** — Ansiolítico peptídico. Melhora cognição, foco e resposta ao estresse.\n\n**12. Semax** — Neuropeptídeo derivado do ACTH. Neuroproteção, BDNF, cognição superior.`,
    },
    {
        num: "03", title: "Emagrecimento acelerado: Semaglutide, BPC-157 e CJC-1295", tag: "Emagrecimento",
        color: "from-orange-600/20 to-orange-500/5", border: "border-orange-500/20", icon: "🔥",
        content: `### Peptídeos para emagrecimento\n\n**Semaglutide** — Agonista GLP-1, perda de peso média 15-20% em estudos clínicos.\n\n**BPC-157** — Repara sistema digestivo, reduz inflamação crônica, regula dopamina/serotonina.\n\n**CJC-1295 + Ipamorelin** — Aumenta GH e IGF-1, acelera metabolismo lipídico, promove lipólise abdominal.\n\n| Peptídeo | Dose | Frequência | Via |\n|---|---|---|---|\n| CJC-1295 | 100-300mcg | 2-3x/semana | SC |\n| Ipamorelin | 200-300mcg | 3x/semana | SC |\n| BPC-157 | 250-500mcg | 1-2x/dia | SC/oral |`,
    },
    {
        num: "04", title: "Regeneração muscular e recuperação pós-treino", tag: "Recuperação",
        color: "from-purple-600/20 to-purple-500/5", border: "border-purple-500/20", icon: "💪",
        content: `### Regeneração muscular com peptídeos\n\n**BPC-157** — Mais de 2.000 estudos publicados. Acelera cicatrização de ligamentos e tendões em até 4x, repara nervos, reduz inflamação sem suprimir imunidade.\n\n**TB-500** — Mobiliza células-tronco da medula óssea para o local de lesão. Anti-inflamatório via inibição de IL-6 e TNF-α.\n\n**MGF** — Ativa células satélite (precursoras de fibras musculares). Ideal para hipertrofia pós-lesão.\n\n### Protocolo\n\n- Fase aguda (1-4 semanas): BPC-157 + TB-500\n- Fase de reabilitação (4-12 semanas): MGF + BPC-157`,
    },
    {
        num: "05", title: "Longevidade e anti-aging: Epitalon e TB-500", tag: "Longevidade",
        color: "from-cyan-600/20 to-cyan-500/5", border: "border-cyan-500/20", icon: "⏳",
        content: `### Longevidade com peptídeos\n\n**Epitalon** — Ativa telomerase, preserva telômeros. Animais tratados viveram 24% mais (Khavinson, 2003). Regula melatonina e sono profundo.\n\n**Selank** — Aumenta BDNF, protege contra neurodegeneração, reduz ansiedade crônica.\n\n**Semax** — Neuroprotetor potente — estudado para AVC, Alzheimer e Parkinson.\n\n| Peptídeo | Objetivo | Ciclo |\n|---|---|---|\n| Epithalon | Telômeros, sono | 2x/ano, 10 dias |\n| TB-500 | Tecidos, mobilidade | Mensal |\n| Selank | Neuroproteção | 4 semanas |\n| BPC-157 | Inflamação sistêmica | Contínuo |`,
    },
    {
        num: "06", title: "Protocolos completos de dosagem e aplicação", tag: "Protocolos",
        color: "from-yellow-600/20 to-yellow-500/5", border: "border-yellow-500/20", icon: "📋",
        content: `### Guia de dosagem e administração\n\n**Reconstituição:** Use água bacteriostática (0.9% benzyl alcohol). Injete pela parede do vial, gire suavemente, armazene 2-8°C, use em 30-60 dias.\n\n**Fórmula:** Units = (Dose desejada ÷ Concentração) × 100\n\n**Técnica SC:** Seringa insulínica 29-31G, ângulo 45°, locais: abdômen/coxa/deltóide.\n\n**Horários:**\n- CJC-1295, Ipamorelin → antes de dormir\n- BPC-157 → qualquer hora (estômago vazio)\n- Epitalon → antes de dormir\n- Selank/Semax → manhã`,
    },
    {
        num: "07", title: "Combinações sinérgicas e stacks avançados", tag: "Stacks",
        color: "from-pink-600/20 to-pink-500/5", border: "border-pink-500/20", icon: "🔗",
        content: `### Stacks avançados\n\n**Stack 1 — Recomposição Lean:** CJC-1295 + Ipamorelin (3x/semana, noite) + BPC-157 (1x/dia, manhã). Duração: 12-16 semanas.\n\n**Stack 2 — Recuperação Máxima:** BPC-157 (2x/dia) + TB-500 (2x/semana). Duração: 4-8 semanas.\n\n**Stack 3 — Longevidade:** Epithalon (10mg, 10 dias, 2x/ano) + Selank (300mcg/dia, 4 semanas) + BPC-157 (manutenção).\n\n**Stack 4 — Cognição:** Semax (600mcg, manhã) + Selank (250mcg, tarde) + BPC-157 (subcutâneo, manhã).\n\n**Stack 5 — Emagrecimento:** Semaglutide (progressão lenta) + CJC-1295 + Ipamorelin + BPC-157 (proteção digestiva).\n\n> Adicione um peptídeo de cada vez com 1-2 semanas de intervalo.`,
    },
    {
        num: "08", title: "Segurança, efeitos colaterais e como evitá-los", tag: "Segurança",
        color: "from-red-600/20 to-red-500/5", border: "border-red-500/20", icon: "🛡️",
        content: `### Segurança no uso de peptídeos\n\nPeptídeos têm perfil de segurança melhor que esteroides: meia-vida curta, alta especificidade, degradados em aminoácidos inofensivos, sem bioacumulação.\n\n**Efeitos colaterais comuns:**\n- CJC-1295/Ipamorelin: retenção hídrica leve → iniciar com doses baixas\n- Semaglutide: náusea (40% dos usuários) → progressão muito lenta\n- BPC-157: perfil de segurança excepcional em todos os estudos\n\n**Contraindicações absolutas:** câncer ativo, gravidez, diabetes não controlada.\n\n**Exames antes de iniciar:** IGF-1, hemograma, TGO/TGP, creatinina/ureia, glicose/HbA1c.\n\n> Peptídeos são ferramentas poderosas. Com conhecimento e responsabilidade, transformam sua saúde e performance.`,
    },
];

const FREE_PREVIEW_CHAPTERS = 1;

function PaywallOverlay({ onUpgrade }: { onUpgrade: () => void }) {
    return (
        <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(to bottom, rgba(7,26,44,0.05) 0%, rgba(7,26,44,0.97) 35%)',
            borderRadius: '0 0 12px 12px', padding: '32px 24px', textAlign: 'center',
        }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔒</div>
            <h3 style={{ color: '#fff', fontSize: '17px', fontWeight: 800, margin: '0 0 8px' }}>Conteúdo Exclusivo</h3>
            <p style={{ color: '#94afc7', fontSize: '13px', margin: '0 0 18px', maxWidth: '260px', lineHeight: 1.6 }}>
                Desbloqueie todos os capítulos por apenas <strong style={{ color: '#34d399' }}>R$ 9,90</strong>
            </p>
            <button onClick={onUpgrade} style={{
                background: 'linear-gradient(135deg,#5b8af5,#00e5cc)', color: '#fff', border: 'none',
                borderRadius: '10px', padding: '11px 26px', fontSize: '14px', fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 8px 24px rgba(91,138,245,0.4)',
            }}>
                Desbloquear agora → R$ 9,90
            </button>
        </div>
    );
}

export default function EbookReaderPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ email: string; plan: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFree, setIsFree] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (!token) { router.replace("/auth/login?redirect=/ebook/reader"); return; }
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const userData = userStr ? JSON.parse(userStr) : null;
            const plan = userData?.plan || payload?.plan || "free";
            const email = payload.email || userData?.email || "";

            if (plan === "free") {
                setIsFree(true);
                setUser({ email, plan });
            } else if (["basic", "premium", "admin"].includes(plan)) {
                setIsFree(false);
                setUser({ email, plan });
            } else {
                router.replace("/ebook"); return;
            }
        } catch { router.replace("/auth/login?redirect=/ebook/reader"); return; }
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (isFree) {
        const goCheckout = () => router.push('/checkout?plan=basic&product=ebook');
        return (
            <div style={{ background: 'linear-gradient(135deg,#071a2c 0%,#083a5a 50%,#071a2c 100%)', minHeight: '100vh', color: '#fff', fontFamily: "'Inter',system-ui,sans-serif" }}>
                {/* Header */}
                <header style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(7,26,44,0.9)', position: 'sticky', top: 0, zIndex: 50 }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, background: 'linear-gradient(90deg,#5b8af5,#00e5cc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ✦ PeptídeosBio
                    </span>
                    <button onClick={goCheckout} style={{ background: 'linear-gradient(135deg,#5b8af5,#00e5cc)', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                        🔓 Desbloquear tudo — R$ 9,90
                    </button>
                </header>

                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px' }}>
                    {/* Banner free */}
                    <div style={{ background: 'rgba(91,138,245,0.1)', border: '1px solid rgba(91,138,245,0.25)', borderRadius: '14px', padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>📖 Capítulo 1 disponível gratuitamente</div>
                            <div style={{ color: '#64748b', fontSize: '13px' }}>Desbloqueie os 8 capítulos com protocolos, doses e stacks por R$ 9,90</div>
                        </div>
                        <button onClick={goCheckout} style={{ background: 'linear-gradient(135deg,#5b8af5,#00e5cc)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 22px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '14px' }}>
                            Ver planos →
                        </button>
                    </div>

                    {/* Capítulos */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {CHAPTERS.map((ch, idx) => {
                            const locked = idx >= FREE_PREVIEW_CHAPTERS;
                            return (
                                <div key={ch.num} style={{ position: 'relative', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', overflow: 'hidden' }}>
                                    {/* Título sempre visível */}
                                    <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <span style={{ fontSize: '26px' }}>{ch.icon}</span>
                                        <div>
                                            <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Cap. {ch.num} · {ch.tag}</div>
                                            <h3 style={{ margin: '3px 0 0', fontSize: '15px', fontWeight: 700, color: locked ? '#475569' : '#e2e8f0' }}>
                                                {locked ? '🔒 ' : ''}{ch.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Conteúdo */}
                                    {locked ? (
                                        <div style={{ position: 'relative', height: '130px' }}>
                                            <div style={{ padding: '16px 22px', filter: 'blur(5px)', userSelect: 'none', color: '#94afc7', fontSize: '13px', lineHeight: 1.7, pointerEvents: 'none' }}>
                                                {ch.content.slice(0, 250)}...
                                            </div>
                                            <PaywallOverlay onUpgrade={goCheckout} />
                                        </div>
                                    ) : (
                                        <div style={{ padding: '16px 22px', color: '#94afc7', fontSize: '14px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                            {ch.content}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA final */}
                    <div style={{ marginTop: '48px', textAlign: 'center', padding: '40px 24px', background: 'rgba(91,138,245,0.08)', border: '1px solid rgba(91,138,245,0.2)', borderRadius: '16px' }}>
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🧬</div>
                        <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, margin: '0 0 10px' }}>Desbloqueie o Manual Completo</h2>
                        <p style={{ color: '#64748b', margin: '0 0 22px', fontSize: '14px' }}>Protocolos, doses, stacks e segurança — acesso vitalício</p>
                        <button onClick={goCheckout} style={{
                            background: 'linear-gradient(135deg,#5b8af5,#00e5cc)', color: '#fff', border: 'none',
                            borderRadius: '12px', padding: '15px 36px', fontSize: '16px', fontWeight: 800,
                            cursor: 'pointer', boxShadow: '0 8px 32px rgba(91,138,245,0.4)',
                        }}>
                            Acessar tudo por R$ 9,90 →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <EbookShell
            ebookId="ebook1"
            title="O Código Secreto"
            subtitle="dos Peptídeos"
            chapters={CHAPTERS}
            user={user}
        />
    );
}
