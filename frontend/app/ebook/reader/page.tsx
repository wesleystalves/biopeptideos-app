"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EbookShell from "@/components/EbookShell";

const CHAPTERS = [
    {
        num: "01", title: "O que são peptídeos e como funcionam no corpo", tag: "Fundamentos",
        color: "from-blue-600/20 to-blue-500/5", border: "border-blue-500/20", icon: "🧬",
        content: `### O que são peptídeos?

Peptídeos são cadeias curtas de aminoácidos — os blocos fundamentais das proteínas — com geralmente 2 a 50 aminoácidos ligados por ligações peptídicas. Diferente das proteínas completas, que têm estruturas muito complexas, os peptídeos são menores e mais fáceis de serem absorvidos e utilizados pelo organismo.

**Como funcionam no corpo:**

Os peptídeos atuam como **mensageiros biológicos**. Eles interagem com receptores específicos em células-alvo, desencadeando cascatas de sinalização que regulam funções vitais como:

- Produção e liberação de hormônios (GH, insulina, cortisol)
- Reparo e regeneração celular
- Resposta inflamatória e imunológica
- Síntese de colágeno e elastina
- Regulação do metabolismo e composição corporal

### Mecanismo de ação

Ao chegar ao receptor alvo, o peptídeo se encaixa como uma "chave na fechadura", ativando ou inibindo reações específicas. Por isso, cada peptídeo tem uma função altamente específica — sem os efeitos sistêmicos amplos dos hormônios tradicionais.

### Por que a ciência investe tanto?

Nos últimos 20 anos, mais de 60 peptídeos foram aprovados como medicamentos. A precisão de ação, a curta meia-vida e a baixa toxicidade os tornam candidatos ideais para tratamentos de alta performance e longevidade.

> **Ponto chave:** Peptídeos não substituem hábitos saudáveis — eles potencializam o que seu corpo já faz de melhor.`,
    },
    {
        num: "02", title: "Os 12 peptídeos mais pesquisados para performance", tag: "Performance",
        color: "from-emerald-600/20 to-emerald-500/5", border: "border-emerald-500/20", icon: "⚡",
        content: `### Os 12 peptídeos mais estudados para performance humana

A ciência identificou um grupo seleto de peptídeos com potencial excepcional para melhorar performance atlética, composição corporal e recuperação.

**1. BPC-157** — O "curador universal": regeneração de tecidos, anti-inflamatório sistêmico, proteção gástrica.

**2. TB-500 (Thymosin Beta-4)** — Mobiliza células-tronco, acelera cicatrização muscular e tendínea.

**3. CJC-1295** — Estimula liberação pulsátil de GH. Combinado com GHRP aumenta drasticamente os níveis de IGF-1.

**4. Ipamorelin** — GHRP altamente seletivo. Libera GH sem elevar cortisol ou prolactina.

**5. Hexarelin** — Potente liberador de GH. Ação cardioprotegora documentada.

**6. GHRP-6 e GHRP-2** — Estimulam fome e GH. GHRP-2 tem efeito mais limpo no cortisol.

**7. MGF (Mechano Growth Factor)** — Variante do IGF-1 ativada por dano muscular. Hipertrofia intensa e reparo localizado.

**8. Follistatina 344** — Inibe miostatina. Potencial de crescimento muscular sem andrógenos.

**9. Epithalon** — Peptídeo da glândula pineal. Longevidade, antioxidante, reparo de DNA.

**10. PT-141 (Bremelanotide)** — Receptor de melanocortina. Libido e função sexual masculina e feminina.

**11. Selank** — Ansiolítico peptídico. Melhora cognição, foco e resposta ao estresse.

**12. Semax** — Neuropeptídeo derivado do ACTH. Neuroproteção, BDNF, cognição superior.

> **Nota:** Todos os peptídeos listados estão em pesquisa científica ativa. Sempre consulte um profissional de saúde antes de usar qualquer composto.`,
    },
    {
        num: "03", title: "Emagrecimento acelerado: Semaglutide, BPC-157 e CJC-1295", tag: "Emagrecimento",
        color: "from-orange-600/20 to-orange-500/5", border: "border-orange-500/20", icon: "🔥",
        content: `### Peptídeos para emagrecimento: o que a ciência diz

#### Semaglutide — O game-changer

O Semaglutide (Ozempic/Wegovy) é um agonista do receptor GLP-1, aprovado pela FDA para diabetes e obesidade.

**Mecanismos:**
- Retarda o esvaziamento gástrico → maior saciedade
- Age no hipotálamo → reduz apetite central
- Melhora sensibilidade à insulina
- Perda de peso média de **15-20%** do peso corporal em estudos clínicos

#### BPC-157 para emagrecimento

Indiretamente apoia a perda de gordura ao:
- Reparar o sistema digestivo (melhora absorção)
- Reduzir inflamação crônica (principal sabotadora do emagrecimento)
- Regular dopamina e serotonina (controle emocional da alimentação)

#### CJC-1295 + Ipamorelin

A combinação mais popular para recomposição corporal:
- Aumenta GH e IGF-1 → acelera o metabolismo lipídico
- Promove lipólise especialmente abdominal
- Preserva e aumenta massa muscular concomitantemente

### Protocolo de recomposição (educativo)

| Peptídeo | Dose (estudo) | Frequência | Via |
|---|---|---|---|
| CJC-1295 | 100-300mcg | 2-3x/semana | SC |
| Ipamorelin | 200-300mcg | 3x/semana | SC |
| BPC-157 | 250-500mcg | 1-2x/dia | SC/oral |

> **Importante:** Protocolos são educativos. Sempre com orientação médica.`,
    },
    {
        num: "04", title: "Regeneração muscular e recuperação pós-treino", tag: "Recuperação",
        color: "from-purple-600/20 to-purple-500/5", border: "border-purple-500/20", icon: "💪",
        content: `### Regeneração muscular com peptídeos

#### BPC-157 — O protetor universal

BPC-157 é um pentadecapeptídeo derivado de uma proteína protetora gástrica. Com mais de **2.000 estudos publicados**, é o peptídeo mais versátil para regeneração.

**O que os estudos mostram:**
- Acelera cicatrização de ligamentos e tendões em até 4x
- Repara nervos danificados
- Reduz inflamação sem suprimir imunidade
- Protege e regenera tecido muscular após lesões
- Age via modulação do sistema óxido nítrico

#### TB-500 — O mobilizador de células-tronco

Thymosin Beta-4 é um peptídeo natural presente em quase todas as células do corpo.

**Mecanismos únicos:**
- Mobiliza células-tronco da medula óssea para o local de lesão
- Upregula actina (proteína essencial da fibra muscular)
- Anti-inflamatório potente via inibição de IL-6 e TNF-α
- Melhora flexibilidade do tecido cicatricial

#### MGF — Para hipertrofia pós-lesão

Mechano Growth Factor é secretado localmente após microlesões musculares. Ativa células satélite (precursoras de fibras musculares).

### Protocolo para recuperação acelerada

Fase aguda (1-4 semanas): **BPC-157 + TB-500**

Fase de reabilitação (4-12 semanas): **MGF + BPC-157**

> A combinação BPC-157 + TB-500 é considerada o "stack dourado" para recuperação de atletas de alto rendimento.`,
    },
    {
        num: "05", title: "Longevidade e anti-aging: Epitalon e TB-500", tag: "Longevidade",
        color: "from-cyan-600/20 to-cyan-500/5", border: "border-cyan-500/20", icon: "⏳",
        content: `### Longevidade com peptídeos: a fronteira da ciência

#### Epitalon — O peptídeo dos telômeros

Epitalon (Ala-Glu-Asp-Gly) foi desenvolvido pelo cientista russo Vladimir Khavinson e é o peptídeo mais estudado para longevidade.

**Mecanismos anti-aging:**
- Ativa a **telomerase** → preserva o comprimento dos telômeros
- Regula a produção de melatonina pela glândula pineal
- Potente antioxidante — neutraliza radicais livres
- Melhora qualidade do sono profundo
- Reduz marcadores inflamatórios associados ao envelhecimento

**Estudos notáveis:** Em 2003, Khavinson publicou que animais tratados com Epithalon viveram **24% mais** que o grupo controle.

#### Selank e Semax para longevidade cerebral

**Selank:** Aumenta BDNF, protege contra neurodegeneração, reduz ansiedade crônica.

**Semax:** Neuroprotetor potente — estudado para AVC, Alzheimer e Parkinson.

#### Follistatina para longevidade muscular

Após os 40, a sarcopenia acelera o envelhecimento. Follistatina inibe miostatina, mantendo a musculatura mesmo com a queda hormonal da idade.

### Protocolo longevidade (referência educativa)

| Peptídeo | Objetivo | Ciclo |
|---|---|---|
| Epithalon | Telômeros, sono, pineal | 2x/ano, 10 dias |
| TB-500 | Tecidos, mobilidade | Mensal |
| Selank | Neuroproteção | 4 semanas |
| BPC-157 | Inflamação sistêmica | Contínuo |`,
    },
    {
        num: "06", title: "Protocolos completos de dosagem e aplicação", tag: "Protocolos",
        color: "from-yellow-600/20 to-yellow-500/5", border: "border-yellow-500/20", icon: "📋",
        content: `### Guia de dosagem e administração

#### Reconstituição de peptídeos liofilizados

A maioria dos peptídeos vem em pó liofilizado. O processo correto:

1. **Use água bacteriostática** (0.9% benzyl alcohol)
2. Injete a água PELA PAREDE do vial, nunca direto no pó
3. Gire suavemente — nunca agite com força
4. Armazene entre **2-8°C** após reconstituído
5. Prazo de uso: **30-60 dias** refrigerado

#### Cálculo de dosagem

**Fórmula:** Units a aspirar = (Dose desejada ÷ Concentração) × 100

**Exemplo:** Vial de 5mg + 2,5mL de água bacteriostática
- Concentração = 2mg/mL = 200mcg por 10 units
- Para 200mcg: aspire **10 units** na seringa

#### Técnica de injeção subcutânea

1. Limpe o local com álcool (abdômen, coxa ou deltóide)
2. Use seringa insulínica 29-31G
3. Faça uma prega de pele entre dois dedos
4. Insira a agulha a **45°**
5. Injete lentamente, retire e pressione suavemente

#### Horários ideais

**Peptídeos de GH (CJC-1295, Ipamorelin):** Antes de dormir (pico natural de GH)

**BPC-157:** A qualquer hora, preferencialmente com estômago vazio

**Epitalon:** Antes de dormir (ação na pineal)

**Selank/Semax:** Manhã para foco

> **Regra de ouro:** Dose baixa + progressão gradual + monitoramento = resultados com segurança.`,
    },
    {
        num: "07", title: "Combinações sinérgicas e stacks avançados", tag: "Stacks",
        color: "from-pink-600/20 to-pink-500/5", border: "border-pink-500/20", icon: "🔗",
        content: `### Stacks de peptídeos: sinergia inteligente

---

#### Stack 1 — Recomposição Corporal Lean
**Objetivo:** Perda de gordura + ganho muscular simultâneo

- CJC-1295 (300mcg) + Ipamorelin (300mcg) → 3x/semana, noite
- BPC-157 (500mcg) → 1x/dia, manhã
- **Duração:** 12-16 semanas

---

#### Stack 2 — Recuperação Máxima
**Objetivo:** Lesões, pós-cirurgia, retorno ao esporte

- BPC-157 (500mcg) → 2x/dia
- TB-500 (2mg) → 2x/semana
- **Duração:** 4-8 semanas

---

#### Stack 3 — Longevidade e Anti-Aging

- Epithalon (10mg) → 10 dias, 2x/ano
- Selank (300mcg/dia) → 4 semanas contínuas
- BPC-157 (250mcg) → 2x/semana (manutenção)

---

#### Stack 4 — Cognição e Performance Mental

- Semax (600mcg/dia) → intranasal, manhã
- Selank (250mcg) → intranasal, tarde
- BPC-157 (250mcg) → subcutâneo, manhã

---

#### Stack 5 — Emagrecimento Intenso

- Semaglutide (0.25mg → 1mg/semana) → progressão 4 semanas
- CJC-1295 + Ipamorelin → 3x/semana, noite
- BPC-157 → para proteger o trato digestivo

> **Regra dos stacks:** Nunca inicie múltiplos peptídeos juntos. Adicione um de cada vez com 1-2 semanas de intervalo.`,
    },
    {
        num: "08", title: "Segurança, efeitos colaterais e como evitá-los", tag: "Segurança",
        color: "from-red-600/20 to-red-500/5", border: "border-red-500/20", icon: "🛡️",
        content: `### Segurança no uso de peptídeos

#### O perfil de segurança geral

Peptídeos têm um perfil de segurança consideravelmente melhor que esteroides anabolizantes:

- **Meia-vida curta:** A maioria é metabolizada em horas
- **Alta especificidade:** Agem em receptores-alvo
- **Via de degradação:** Peptidases os decompõem em aminoácidos inofensivos
- **Não são estocados:** Não há bioacumulação tecidual

#### Efeitos colaterais por peptídeo

**CJC-1295 / Ipamorelin:**
- Retenção hídrica leve (primeiras semanas)
- Adormecimento de extremidades (raro)
- **Solução:** iniciar com doses baixas, progressão gradual

**Semaglutide:**
- Náusea (comum nas primeiras semanas — 40% dos usuários)
- Vômito, constipação, diarreia
- **Solução:** progressão muito lenta (0.25mg/semana por 4 semanas)

**BPC-157:**
- Perfil de segurança excepcional em todos os estudos
- Sem hepatotoxicidade, nefrotoxicidade ou supressão hormonal documentadas

**TB-500:**
- Bem tolerado
- Contraindicado em histórico de câncer por precaução teórica

#### Contraindicações absolutas

- **Câncer ativo:** Peptídeos que elevam GH/IGF-1 são contraindicados
- **Gravidez e amamentação:** Ausência de dados de segurança
- **Diabetes não controlada:** Semaglutide requer monitoramento rigoroso

#### Exames recomendados antes de iniciar

| Exame | O que monitora |
|---|---|
| IGF-1 | Baseline de GH axis |
| Hemograma | Saúde geral |
| TGO/TGP | Função hepática |
| Creatinina/Ureia | Função renal |
| Glicose/HbA1c | Metabolismo glicídico |

> **Conclusão:** Peptídeos são ferramentas poderosas. Usadas com conhecimento e responsabilidade, podem transformar sua saúde e performance.`,
    },
];

export default function EbookReaderPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ email: string; plan: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (!token) { router.replace("/auth/login?redirect=/ebook/reader"); return; }
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const userData = userStr ? JSON.parse(userStr) : null;
            const plan = userData?.plan || payload?.plan || "free";
            if (!["basic", "premium", "admin"].includes(plan)) { router.replace("/ebook"); return; }
            setUser({ email: payload.email || "", plan });
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
