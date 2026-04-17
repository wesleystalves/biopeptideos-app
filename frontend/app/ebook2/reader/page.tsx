"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EbookShell from "@/components/EbookShell";

const C = (content: string) => content;

const CHAPTERS = [
    {
        num: "00", title: "Prefácio — A Virada de Paradigma", tag: "Introdução",
        color: "from-slate-600/20 to-slate-500/5", border: "border-slate-500/20", icon: "🧠",
        content: C(`### A Virada de Paradigma que a Medicina Convencional Ainda Não Assimilou

**"A medicina do século XX foi construída para salvar vidas em crises. A medicina do século XXI será construída para impedir que as crises ocorram."**

O modelo reativo da medicina convencional opera no tempo errado. Ele espera o sistema colapsar para intervir. Espera a aterosclerose evoluir para um infarto antes de discutir estatinas. Espera o tecido muscular definhar antes de considerar estratégias anabólicas. Espera a cognição deteriorar antes de investigar neurotrofinas.

É, em termos de engenharia biológica, o equivalente a só trocar o óleo do motor depois que ele já fundiu.

O problema não é de intenção — é de epistemologia. A medicina convencional foi treinada para identificar patologia, não para **otimizar fisiologia**. Existe um abismo conceitual entre "ausência de doença" e "função biológica de elite", e durante décadas a medicina habitou apenas o primeiro território.

É exatamente nesse vácuo que os peptídeos emergem — **não como alternativa, mas como evolução**.

### O Corpo Humano Como Sistema de Informação Molecular

Cada célula do organismo está constantemente emitindo e recebendo sinais. Hormônios, citocinas, neurotransmissores, fatores de crescimento — todos são mensageiros moleculares que carregam instruções específicas para comportamentos celulares específicos.

Nesse contexto, a doença — em grande parte — é **falha de comunicação**. E os peptídeos são intervenções de precisão no código de comunicação biológica.

> Este livro percorre a ciência, a matemática e os protocolos que definem a Era dos Peptídeos.`),
    },
    {
        num: "01", title: "O Fim da Medicina Reativa", tag: "Fundamentos",
        color: "from-blue-600/20 to-blue-500/5", border: "border-blue-500/20", icon: "🔬",
        content: C(`### 1.1 — O Modelo Quebrado: Tratar Sintomas vs. Reprogramar Biologia

A medicina reativa opera no tempo errado. Um protocolo peptídico bem desenhado opera antes: ele mantém o sistema funcionando em capacidade ideal antes que o colapso ocorra.

### 1.2 — Hierarquia Funcional dos Peptídeos

1. **Peptídeos de Reparo Tecidual** — Angiogênese, migração celular, síntese de colágeno. *BPC-157, TB-500, GHK-Cu, KPV*
2. **Peptídeos Metabólicos** — Saciedade, sensibilidade à insulina, lipólise. *Tirzepatida, Semaglutida, Retatrutide, AOD9604*
3. **Peptídeos do Eixo GH/IGF-1** — Hormônio do crescimento. *CJC-1295, Ipamorelin, GHRP-2/6*
4. **Peptídeos de Longevidade** — Telômeros, senescência, função mitocondrial. *Epitalon, FOXO4-DRI, MOTS-c, SS-31*
5. **Peptídeos Cognitivos** — BDNF, dopamina, neuroproteção. *Semax, Selank, VIP*
6. **Peptídeos Imunológicos e Hormonais** — Eixo HPG, imunidade. *HCG, Thymalin, Thymosin Alpha-1*

### 1.3 — A Revolução Silenciosa: Da Insulina aos Agonistas GLP-1/GIP

- **1921:** Isolamento da insulina — Banting & Best (Nobel 1923)
- **1982:** Primeiro peptídeo recombinante aprovado: Insulina humana (Humulin)
- **1991:** Descrição do BPC-157 em tecido gástrico — Sikirić et al.
- **2005:** Exenatida, primeiro agonista GLP-1 aprovado
- **2021:** Tirzepatida — redução média de **22,5% do peso corporal** no SURMOUNT-1, superando qualquer intervenção farmacológica prévia

### 1.4 — O Papel do Médico na Era Peptídica

A medicina peptídica não é autoatendimento. O profissional precisa: compreender mecanismos ao nível do receptor, interpretar marcadores dinâmicos (IGF-1, GH, VEGF), dominar a farmacocinética, e — crucialmente — dominar a **matemática da reconstituição e dosagem**.

O próximo capítulo é dedicado integralmente a essa matemática.

> Na era dos peptídeos, a precisão não é opcional — ela é o protocolo.`),
    },
    {
        num: "02", title: "A Matemática da Precisão", tag: "Dosagem",
        color: "from-emerald-600/20 to-emerald-500/5", border: "border-emerald-500/20", icon: "🧮",
        content: C(`### 2.1 — Por que a Dose Errada Mata o Protocolo

Na terapia peptídica injetável, não há amortecedor. A administração subcutânea entrega a molécula diretamente à circulação sistêmica, com biodisponibilidade próxima de 100%.

Um frasco de BPC-157 de 10mg reconstituído com 1ml resulta em **10mg/ml**. O mesmo frasco com 2ml resulta em **5mg/ml**. Esse grau de variabilidade exige um sistema — não intuição.

### 2.2 — Água Bacteriostática: Função e Estabilidade

A água bacteriostática (BAC water) contém álcool benzílico a 0,9% como agente bacteriostático, permitindo uso múltiplo do frasco.

- **pH:** 4,5–7,0 (compatível com a maioria dos peptídeos)
- **Conservante:** Álcool benzílico 0,9%
- **Regra de ouro:** Injetar a água pela parede interna do frasco, nunca diretamente sobre o pó. Rolar suavemente — nunca agitar.

### 2.3 — A Regra das 100 Units

A seringa insulínica de 1ml é calibrada em 100 units.

**1 ml = 100 units = 100 "tracinhos" na seringa**

- 10 units = 0,10 ml
- 25 units = 0,25 ml
- 50 units = 0,50 ml

**Fórmula:** Units a aspirar = (Dose desejada ÷ Concentração) × 100

**Exemplo:** BPC-157 10mg em 2ml → Concentração = 5mg/ml. Para dose de 0,25mg: **(0,25 ÷ 5) × 100 = 5 units**

### 2.4 — Tabela de Validade Pós-Reconstituição

| Peptídeo | Validade | Armazenamento |
|---|---|---|
| BPC-157 | 21 dias | Geladeira 2–8°C, ao abrigo da luz |
| TB-500 | 25 dias | Geladeira 2–8°C |
| Tirzepatida | 30 dias | Geladeira 2–8°C |
| Semaglutida | 30 dias | Geladeira 2–8°C |
| CJC-1295 (No DAC) | 25 dias | Geladeira 2–8°C |
| Ipamorelin | 28 dias | Geladeira 2–8°C |
| Epitalon | 30 dias | Geladeira 2–8°C |
| HGH 191AA | 14 dias | Geladeira 2–8°C |
| NAD+ | 7 dias | Geladeira 2–8°C — uso rápido |
| Glutationa | 7 dias | Geladeira 2–8°C — uso rápido |

> **Regra crítica:** Registrar a data de reconstituição em cada frasco é obrigatório.

### 2.5 — Erros Mais Comuns

- Agitar o frasco ao invés de rolar → degrada a estrutura peptídica
- Confundir mg com mcg (1mg = 1.000 mcg)
- Usar água estéril comum (sem bacteriostático) → validade de apenas 24h
- Não registrar a data de reconstituição
- Armazenar peptídeo reconstituído no freezer → pode destruir a molécula

Use a calculadora de dose integrada neste ebook para evitar erros de cálculo.`),
    },
    {
        num: "03", title: "Tabelas Mestras de Dosagem", tag: "Referência",
        color: "from-yellow-600/20 to-yellow-500/5", border: "border-yellow-500/20", icon: "📊",
        content: C(`### Peptídeos de Recuperação e Reparo

| Peptídeo | Frasco | BAC water | Dose por 10 units |
|---|---|---|---|
| BPC-157 | 5mg | 2ml (200u) | 250 mcg |
| BPC-157 | 10mg | 2ml (200u) | 500 mcg |
| TB-500 | 10mg | 1ml (100u) | 1,00 mg |
| TB-500 | 10mg | 2ml (200u) | 0,50 mg |
| BPC-157 + TB-500 | 5mg + 5mg | 1ml (100u) | 0,25mg + 0,25mg |
| GHK-Cu | 50mg | 5ml | 1,00 mg |
| GHK-Cu | 50mg | 10ml | 0,50 mg |
| KPV | 10mg | 2ml (200u) | 500 mcg |
| ARA-290 | 10mg | 1ml (100u) | 1,00 mg |

### Peptídeos Metabólicos

| Peptídeo | Frasco | BAC water | Dose por 10 units |
|---|---|---|---|
| Tirzepatida | 5mg | 1ml (100u) | 0,50 mg |
| Tirzepatida | 10mg | 1ml (100u) | 1,00 mg |
| Tirzepatida | 15mg | 1,5ml (150u) | 1,00 mg |
| Semaglutida | 5mg | 1ml (100u) | 0,50 mg |
| Semaglutida | 5mg | 2ml (200u) | 0,25 mg |
| Semaglutida | 10mg | 2ml (200u) | 0,50 mg |
| Retatrutide | 5mg | 1ml (100u) | 0,50 mg |
| AOD9604 | 5mg | 1ml (100u) | 0,50 mg |
| 5-Amino-1MQ | 10mg | 1ml (100u) | 1,00 mg |

### Peptídeos do Eixo GH/IGF-1

| Peptídeo | Frasco | BAC water | Dose por 10 units |
|---|---|---|---|
| CJC-1295 (No DAC) | 5mg | 10ml | 50 mcg |
| CJC-1295 (No DAC) | 10mg | 10ml | 100 mcg |
| CJC-1295 (Com DAC) | 2mg | 1ml (100u) | 0,20 mg |
| Ipamorelin | 5mg | 2,5ml (250u) | 100 mcg |
| CJC-1295 + Ipa (mix) | 5mg + 5mg | 5ml | 100mcg + 100mcg |
| GHRP-2 | 5mg | 5ml | 100 mcg |
| Hexarelin | 2mg | 2ml (200u) | 100 mcg |
| Tesamorelin | 5mg | 1ml (100u) | 0,50 mg |
| HGH 191AA | 10 IU | 1ml (100u) | 1 IU |
| IGF-1 LR3 | 1mg | 1ml (100u) | 100 mcg |
| MGF | 2mg | 2ml (200u) | 100 mcg |

### Peptídeos de Longevidade

| Peptídeo | Frasco | BAC water | Dose por 10 units |
|---|---|---|---|
| Epitalon | 10mg | 1ml (100u) | 1,00 mg |
| Epitalon | 10mg | 2ml (200u) | 0,50 mg |
| FOXO4-DRI | 10mg | 1ml (100u) | 1,00 mg |
| MOTS-c | 10mg | 1ml (100u) | 1,00 mg |
| SS-31 | 10mg | 1ml (100u) | 1,00 mg |
| NAD+ | 500mg | 5ml | 100 mg/ml |

### Cognitivos e Imunológicos

| Peptídeo | Frasco | BAC water | Dose por 10 units |
|---|---|---|---|
| Semax | 5mg | 2,5ml (250u) | 100 mcg |
| Selank | 5mg | 2,5ml (250u) | 100 mcg |
| Thymosin Alpha-1 | 5mg | 1ml (100u) | 0,50 mg |

> Use a Calculadora de Dose (botão no menu) para calcular qualquer combinação personalizada.`),
    },
    {
        num: "04", title: "Peptídeos de Reparo — BPC-157, TB-500, GHK-Cu", tag: "Recuperação",
        color: "from-purple-600/20 to-purple-500/5", border: "border-purple-500/20", icon: "🩹",
        content: C(`### BPC-157 — O Protetor Universal

BPC-157 (Body Protection Compound-157) é um pentadecapeptídeo com mais de **2.000 estudos publicados**. É o peptídeo mais versátil para regeneração.

**Mecanismos de ação:**
- Upregulation de VEGF e receptor VEGFR-2 → neovascularização acelerada em tendões e músculos
- Modulação do sistema NO (óxido nítrico) → vasodilatação e fluxo sanguíneo no sítio de lesão
- Ativação da via FAK-paxilina → aceleração da migração de fibroblastos e células endoteliais
- Modulação dopaminérgica (D1 e D2) → efeitos no SNC: depressão, ansiedade, lesão neurológica
- Proteção gastrointestinal → redução de úlceras por AINEs, melhora da permeabilidade intestinal

**Doses por indicação:**

| Indicação | Dose | Frequência |
|---|---|---|
| Lesão muscular / tendão | 0,25–0,50mg | 1–2× ao dia |
| Lesão grande / pós-cirurgia | 0,50–0,75mg | 1× ao dia |
| Intestino / permeabilidade | 0,25–0,50mg | 1–2× ao dia (em jejum) |
| Neuropatia / lesão nervosa | 0,20–0,50mg | 1× ao dia |

---

### TB-500 (Timosina Beta-4) — A Migração Celular

TB-500 é um fragmento sintético da Timosina Beta-4, com distribuição **sistêmica** — superior ao BPC-157 para lesões difusas ou de localização menos precisa.

**Mecanismos:**
- Sequestro de Actina-G → regula dinâmica do citoesqueleto → acelera migração celular
- Upregulation de VEGF/VEGFR-2 → neovascularização sistêmica
- Mobilização de células-tronco cardíacas (evidências em modelos de infarto)
- Inibição do NF-κB → redução de IL-1β, IL-6, TNF-α sem supressão imunológica global

**A Sinergia BPC-157 + TB-500 ("Protocolo Wolverine"):** BPC-157 atua precisamente no sítio local; TB-500 cobre regeneração vascular difusa. Juntos são o "stack dourado" para recuperação.

---

### GHK-Cu — O Peptídeo do Cobre

GHK-Cu (Gly-His-Lys-Cu²⁺) ocorre naturalmente no plasma humano e **declina progressivamente com o envelhecimento** — de ~200ng/ml aos 20 anos para ~80ng/ml após os 60.

**Efeitos documentados:**
- Síntese de colágeno e elastina
- Ativação de MMP-2 e MMP-9 (remodelação tecidual)
- Neuroproteção
- Crescimento capilar via via Wnt/β-catenina
- Aceleração da reepitelização cutânea

| Indicação | Dose | Frequência |
|---|---|---|
| Rejuvenescimento da pele | 100–250 mcg | 1× ao dia, 3–6 semanas |
| Crescimento capilar | 250–500 mcg | 1× ao dia, uso localizado |
| Anti-envelhecimento sistêmico | 1mg SC | 3× semanal, 4 semanas |
| Recuperação de lesão/tendão | 1–2mg SC | 3× semanal, 4–6 semanas |`),
    },
    {
        num: "05", title: "Peptídeos Metabólicos — GLP-1, AOD9604, 5-Amino-1MQ", tag: "Emagrecimento",
        color: "from-orange-600/20 to-orange-500/5", border: "border-orange-500/20", icon: "⚖️",
        content: C(`### Tirzepatida — O Agonista Duplo GLP-1/GIP

A Tirzepatida é o peptídeo metabólico mais poderoso aprovado até hoje. No estudo SURMOUNT-1 (Fase 3), demonstrou redução média de **22,5% do peso corporal** — superando qualquer intervenção farmacológica prévia para obesidade.

**Mecanismos:**
- Agonismo dual GLP-1/GIP → saciedade aumentada + melhora da sensibilidade insulínica
- Retardo do esvaziamento gástrico
- Redução da ingestão calórica via ação hipotalâmica

**Protocolo de progressão (padrão indução):**

| Semana | Dose semanal | Observação |
|---|---|---|
| 1–4 | 2,5 mg | Tolerabilidade GI |
| 5–8 | 5,0 mg | Avançar se tolerância aceitável |
| 9–12 | 7,5 mg | Otimização |
| 13+ | 10,0–15,0 mg | Conforme resposta |

---

### Semaglutida — GLP-1 de Meia-Vida Longa

**Doses e reconstituição:**
- 5mg + 1ml BAC → 0,50 mg por 10 units
- 5mg + 2ml BAC → 0,25 mg por 10 units (indução)
- 10mg + 2ml BAC → 0,50 mg por 10 units

**Progressão típica:** 0,25mg → 0,5mg → 1,0mg → 2,4mg (máx.) com intervalos de 4 semanas.

---

### AOD9604 — O Fragmento Lipolítico do GH

O AOD9604 corresponde aos aminoácidos 176–191 do GH humano — a porção responsável pela lipólise, **sem** os efeitos adversos do GH exógeno (resistência à insulina, retenção hídrica).

| Indicação | Dose | Frequência |
|---|---|---|
| Perda de gordura geral | 0,3–0,5 mg | 1× ao dia (jejum) |
| Aceleração / platô | 0,5–1,0 mg | 1× ao dia |
| Finalizador pré-competição | 1,0 mg | Máx. 4 semanas |

---

### 5-Amino-1MQ — Inibição da NNMT e Reprogramação Metabólica

A NNMT é superexpressa no tecido adiposo branco de indivíduos obesos, competindo pelo pool de NAD+. O 5-Amino-1MQ **bloqueia seletivamente** a NNMT, restaurando NAD+, ativando sirtuínas e AMPK, e elevando o gasto energético basal.

| Indicação | Dose | Protocolo |
|---|---|---|
| Perda de gordura / metabolismo | 25–50mg | 1× ao dia, manhã |
| Quebra de platô | 50–75mg | 1× ao dia |
| Anti-envelhecimento | 25mg | 5 dias ON / 2 dias OFF |`),
    },
    {
        num: "06", title: "Eixo GH/IGF-1 — Ipamorelin, CJC-1295, Epitalon", tag: "GH & Longevidade",
        color: "from-cyan-600/20 to-cyan-500/5", border: "border-cyan-500/20", icon: "🧬",
        content: C(`### Ipamorelin — O GHRP mais Seletivo

O Ipamorelin é um pentapeptídeo agonista seletivo do GHSR-1a. Sua **seletividade** é o diferencial: estimula GH sem elevar cortisol ou prolactina — produzindo picos de GH limpos.

| Indicação | Dose | Frequência |
|---|---|---|
| Suporte de GH / anti-envelhecimento | 100–200 mcg | 1× ao dia (antes de dormir) |
| Perda de gordura / recomposição | 100–300 mcg | 2–3× ao dia |
| Recuperação de lesão | 200–300 mcg | 2–3× ao dia, 4–6 semanas |

---

### CJC-1295 — GHRH Curta e Longa Duração

**Sem DAC (No DAC / Modified GRF 1-29):** Meia-vida de ~30 minutos. Mimetiza pulso fisiológico de GHRH. Companheiro ideal do Ipamorelin.

**Com DAC:** Meia-vida de **6–8 dias** por ligação covalente com albumina. Uma injeção semanal eleva GH e IGF-1 de forma sustentada.

| Formulação | Dose | Frequência |
|---|---|---|
| No DAC — suporte | 100–200 mcg | 1× ao dia (antes de dormir) |
| No DAC — recomposição | 100–150 mcg | 1–2× ao dia |
| Com DAC — anti-aging | 1–2 mg | 1× semanal |

---

### Epitalon — Ativação da Telomerase

O Epitalon (Ala-Glu-Asp-Gly) foi desenvolvido pelo Dr. Vladimir Khavinson. Mecanismos:
- Indução de expressão de TERT → **ativação da telomerase**
- Regulação da secreção de melatonina pela glândula pineal
- Atividade antioxidante potente
- Estudos em animais: animais tratados viveram **24% mais** que controles

| Indicação | Dose | Protocolo |
|---|---|---|
| Anti-envelhecimento / telômeros | 0,5–1,0mg | 1× ao dia, 10 dias; repetir 2× ao ano |
| Qualidade do sono / circadiano | 0,5–1,0mg | 1× ao dia (antes de dormir) |

---

### FOXO4-DRI — Senólise e Células Zumbis

O FOXO4-DRI elimina células senescentes ("células zumbis") que pararam de se dividir mas recusam apoptose — liberando o fator p53 para executar apoptose programada **seletivamente**.

| Indicação | Dose | Protocolo |
|---|---|---|
| Ciclo senolítico / anti-aging | 10–30mg | 10mg EOD × 3 doses; repetir após 4–6 semanas |
| Fadiga pós-viral / senescência imune | 10mg | 10mg EOD × 3; repetir após 8 semanas |

---

### MOTS-c — Peptídeo Mitocondrial e AMPK

O MOTS-c é codificado pelo **DNA mitocondrial** e ativa a AMPK — o sensor mestre de energia celular — melhorando flexibilidade metabólica independentemente do estado nutricional.

| Indicação | Dose | Frequência |
|---|---|---|
| Flexibilidade metabólica | 5–10mg | 1× ao dia (manhã ou pré-treino) |
| Endurance / eficiência mitocondrial | 5–10mg | Pré-treino, 3–5× por semana |

---

### SS-31 (Elamipretida) — Proteção Mitocondrial

O SS-31 se concentra na membrana interna mitocondrial, protegendo a cardiolipina da peroxidação e preservando a integridade dos complexos respiratórios.

| Indicação | Dose | Frequência |
|---|---|---|
| Endurance / fadiga | 2–5mg | 1× ao dia (manhã) |
| Suporte mitocondrial | 5mg | 1× ao dia, 2–4 semanas |`),
    },
    {
        num: "07", title: "Peptídeos Cognitivos — Semax, Selank, VIP", tag: "Cognição",
        color: "from-indigo-600/20 to-indigo-500/5", border: "border-indigo-500/20", icon: "🧠",
        content: C(`### Semax — Modulação de BDNF e Neuroproteção

O Semax (Met-Glu-His-Phe-Pro-Gly-Pro) é um heptapeptídeo derivado do ACTH(4–10). Mecanismos:
- **Upregulation de BDNF** — principal fator neurotrófico do SNC
- Modulação dopaminérgica (D1 e D2)
- Modulação do eixo HPA e serotonina
- Ação via receptor de MCR (melanocortina)

| Indicação | Dose | Frequência |
|---|---|---|
| Melhora cognitiva / foco | 100–300 mcg | 1× ao dia (manhã) |
| Consolidação de memória | 200–400 mcg | 1× ao dia |
| Resiliência ao estresse mental | 100–200 mcg | Ciclos curtos de 2–4 semanas |
| Recuperação cognitiva pós-estresse | 300–500 mcg | 1× ao dia, 7–14 dias |

---

### Selank — O Ansiolítico Peptídico

O Selank é um heptapeptídeo derivado da tuftsina. Mecanismos:
- **Potencialização GABAérgica** sem dependência ou tolerância (diferente de benzodiazepínicos)
- Regulação do BDNF — efeito ansiolítico + neuroprotetor simultâneo
- Modulação de enkephalinas (sistema opioide endógeno)

| Indicação | Dose | Frequência |
|---|---|---|
| Suporte ansiolítico | 100–300 mcg | 1× ao dia (manhã ou início da tarde) |
| Foco sob estresse | 200 mcg | 1× ao dia |
| Nootrópico combinado | 100–200 mcg | Com Semax (manhã + tarde) |

**O Stack Cognitivo:** Semax (manhã) + Selank (tarde) = cobertura dopaminérgica + GABAérgica ao longo do dia.

---

### VIP — Anti-Neuroinflamação

O VIP (Vasoactive Intestinal Peptide) é um neuropeptídeo com propriedades:
- Anti-inflamatório via inibição de NF-κB neural
- Regulação do ritmo circadiano (SCN hipotalâmico)
- Proteção de neurônios dopaminérgicos

Indicado em protocolos de performance cognitiva como adjuvante anti-inflamatório.

---

### ARA-290 — Neuroproteção via Receptor de EPO

Liga-se seletivamente ao receptor de eritropoietina de **proteção tecidual** (EPOR/βcR), sem ativar eritropoiese. Em ensaios clínicos humanos com neuropatia de fibras finas, demonstrou redução significativa da dor neuropática em 28 dias.

| Indicação | Dose | Protocolo |
|---|---|---|
| Neuropatia de fibras finas | 2–4mg SC | 3× por semana, 4 semanas |
| Dor neuropática geral | 4mg SC | 1× ao dia, 4–8 semanas |`),
    },
    {
        num: "08", title: "Hormonais e Imunológicos — HCG, Thymalin, Glutationa", tag: "Imunologia",
        color: "from-pink-600/20 to-pink-500/5", border: "border-pink-500/20", icon: "🛡️",
        content: C(`### KPV — Anti-inflamação Peptídica de Precisão

O KPV (Lys-Pro-Val) é derivado do α-MSH. Penetra a membrana celular e bloqueia a translocação nuclear do NF-κB, reduzindo IL-1β, IL-6 e TNF-α — **sem suprimir a resposta imune global**.

| Indicação | Dose | Frequência |
|---|---|---|
| Anti-inflamação geral | 250 mcg | 1× ao dia, 7–10 dias |
| Irritação articular pós-treino | 500 mcg | 1× ao dia, 5 dias |
| Permeabilidade intestinal | 500 mcg SC ou oral | 1× ao dia |

---

### Thymalin e Thymosin Alpha-1 — Restauração Tímica

O timo — glândula central da imunidade celular — atrofia progressivamente após os 20 anos. Os péptideos tímicos restauram a função imunológica:

**Thymalin:** Extrato peptídico da glândula tímica bovina. Estimula diferenciação de linfócitos T, restaura resposta imune em idosos.

**Thymosin Alpha-1 (Tα1):** Aprovado em vários países para hepatite crônica e imunodeficiências. Ativa TLR signaling e aumenta IFN-γ.

| Indicação | Dose | Protocolo |
|---|---|---|
| Restauração imunológica | Thymalin 10mg | 1× ao dia, 10 dias |
| Suporte pós-viral | Thymosin Alpha-1 1,6mg | 2× por semana |

---

### HCG — Suporte de Eixo HPG

A HCG (Gonadotrofina Coriônica Humana) mimetiza o LH, estimulando a produção de testosterona intratesticular. Usada em:
- **Suporte durante ciclo de TRT** (para manutenção da fertilidade e volume testicular)
- **Restauração pós-ciclo** em conjunto com protocolos de PCT

| Indicação | Dose | Frequência |
|---|---|---|
| Suporte de eixo HPG / TRT | 250–500 IU | 2–3× semanal |
| Restauração pós-ciclo | 500–1000 IU | 1× ao dia, 2–4 semanas |

---

### Glutationa — Antioxidante Master

A glutationa é o principal antioxidante endógeno. Via IM/SC:

- Inativação de ROS e radicais livres
- Apoio à fase 2 de detoxificação hepática
- Recicla vitaminas C e E

**Dose:** 600–1200mg IV/IM, 2–3× por semana. Validade pós-reconstituição: apenas **7 dias**.`),
    },
    {
        num: "09", title: "Protocolo Elite — Emagrecimento de Alta Performance", tag: "Protocolo Elite",
        color: "from-red-600/20 to-red-500/5", border: "border-red-500/20", icon: "🔥",
        content: C(`### Objetivo Clínico

Perda de gordura acelerada com preservação máxima de massa muscular, melhora simultânea da sensibilidade insulínica e reprogramação do set-point metabólico.

### Stack Principal

| Peptídeo | Papel | Mecanismo |
|---|---|---|
| Tirzepatida | Âncora metabólica | GLP-1/GIP → saciedade + insulina |
| AOD9604 | Lipólise seletiva | β3-adrenérgico → HSL → lipolise |
| 5-Amino-1MQ | Reprogramação metabólica | inibição NNMT → NAD+ → AMPK |
| MOTS-c | Suporte energético | Ativação AMPK mitocondrial |

### FASE 1 — Indução (Semanas 1–4)

| Peptídeo | Dose | Frequência | Horário |
|---|---|---|---|
| Tirzepatida | 2,5mg | 1× semanal | Manhã (dia fixo) |
| AOD9604 | 0,3mg | 1× ao dia | Manhã, em jejum |
| 5-Amino-1MQ | 25mg | 1× ao dia | Manhã, em jejum |
| MOTS-c | 5mg | 3–5× semanal | Pré-treino ou manhã |

### FASE 2 — Aceleração (Semanas 5–8)

| Peptídeo | Dose | Observação |
|---|---|---|
| Tirzepatida | 5,0mg | Avançar só se tolerância GI aceitável |
| AOD9604 | 0,5mg | Manhã, em jejum |
| 5-Amino-1MQ | 50mg | Manhã, em jejum |
| MOTS-c | 10mg | 1× ao dia |

### FASE 3 — Otimização (Semanas 9–16)

| Peptídeo | Dose | Observação |
|---|---|---|
| Tirzepatida | 7,5–10,0mg | Avançar conforme tolerância |
| AOD9604 | 0,5–1,0mg | 1,0mg apenas para quebra de platô (máx. 4 sem.) |
| 5-Amino-1MQ | 50–75mg | 75mg só como finalizador (máx. 2 sem.) |
| MOTS-c | Pausa | Após 3 semanas ON → 6 semanas OFF |

> **Importante:** Este é um protocolo de referência técnica, não uma prescrição médica. Sempre com acompanhamento profissional.`),
    },
    {
        num: "10", title: "Protocolos Elite — Hipertrofia, Wolverine e Longevidade", tag: "Protocolo Elite",
        color: "from-violet-600/20 to-violet-500/5", border: "border-violet-500/20", icon: "⚡",
        content: C(`### Protocolo 4.2 — Hipertrofia e Recomposição Corporal

**Stack Principal:**

| Peptídeo | Papel | Mecanismo-Alvo |
|---|---|---|
| CJC-1295 + Ipamorelin | Âncora anabólica | GHRH + GHSR-1a → pulso de GH noturno |
| IGF-1 LR3 | Adjuvante anabólico | Receptor IGF-1R (síntese proteica) |
| MGF ou PEG-MGF | Adjuvante local pós-treino | IGF-1R local (reparo miofibrilar) |
| BPC-157 | Suporte de tecido conjuntivo | VEGF/FAK/NO (tendões, articulações) |

**Timing:**
- CJC-1295 + Ipamorelin: **30–60 min antes de dormir** — sincroniza com pico fisiológico de GH
- IGF-1 LR3: **Dentro de 30 min pós-treino** — máxima sensibilidade do IGF-1R
- MGF: **Imediatamente pós-treino** — sinal autócrino local
- BPC-157: **Manhã em jejum**

---

### Protocolo 4.3 — "Wolverine" (Recuperação e Cura Acelerada)

**Stack Principal:**

| Peptídeo | Papel |
|---|---|
| BPC-157 | Âncora de reparo local |
| TB-500 | Âncora de mobilização sistêmica |
| GHK-Cu | Adjuvante de remodelação (colágeno/elastina) |
| KPV | Modulação anti-inflamatória (NF-κB) |

**Por tipo de lesão:**

| Tipo de Lesão | Peptídeos Prioritários |
|---|---|
| Tendinite / tendinose crônica | BPC-157 (diário) + TB-500 (semanal) |
| Ruptura muscular parcial | BPC-157 (2× dia) + TB-500 (carga) |
| Pós-cirurgia ortopédica | BPC-157 + TB-500 + GHK-Cu |
| Permeabilidade intestinal / SII | BPC-157 (oral ou SC) + KPV |
| Lesão de nervos periféricos | BPC-157 + ARA-290 |

---

### Protocolo 4.4 — Longevidade e Anti-Envelhecimento

**Cronograma anual:**

| Mês | Bloco | Peptídeos | Mecanismo |
|---|---|---|---|
| Jan–Mar | Senolítico | FOXO4-DRI | Eliminação células senescentes |
| Abr | Pausa | — | Monitoramento |
| Mai–Jun | Mitocondrial | SS-31 + MOTS-c | Eficiência mitocondrial |
| Jul–Set | Telômeros | Epitalon | Ativação telomerase |
| Out | Pausa | — | Monitoramento |
| Nov–Dez | Imunológico | Thymalin + Thymosin Alpha-1 | Restauração tímica |

---

### Protocolo 4.5 — Performance Cognitiva

**Stack Principal:**

| Peptídeo | Papel | Mecanismo |
|---|---|---|
| Semax | Âncora nootrópica | BDNF + dopamina + neuroproteção |
| Selank | Adjuvante ansiolítico | GABA + BDNF + modulação de estresse |
| VIP | Anti-neuroinflamatório | NF-κB neural + circadiano |

**Timing diário:**
- Manhã: Semax 200–300 mcg (intranasal ou SC)
- Tarde: Selank 100–200 mcg (intranasal)
- Noite: VIP (se indicado) + Epitalon (nos ciclos de 10 dias)`),
    },
    {
        num: "11", title: "Conclusão — O Ecossistema Peptídeos Bio", tag: "Conclusão",
        color: "from-emerald-600/20 to-emerald-500/5", border: "border-emerald-500/20", icon: "🚀",
        content: C(`### A Infraestrutura que a Medicina Peptídica de Elite Exige

Ao longo deste livro, construímos o argumento científico para uma proposição central: **a medicina peptídica não é uma tendência — é uma evolução estrutural na forma como a biologia humana pode ser gerenciada com precisão.**

### O Problema Real

Considere um paciente de 47 anos em protocolo combinado de longevidade e recomposição:

- CJC-1295 + Ipamorelin — 100mcg cada, antes de dormir, todo dia
- Tirzepatida — 7,5mg, uma vez por semana
- BPC-157 — 0,25mg, manhã e noite
- Epitalon — 1,0mg, 10 dias corridos a cada 6 meses
- Thymosin Alpha-1 — 1,6mg, 2× por semana
- FOXO4-DRI — 10mg, EOD × 3 doses, uma vez ao ano

**São 6 peptídeos. Com 6 frequências distintas. Com 6 validades pós-reconstituição diferentes. Com 6 ciclos ON/OFF.** Sem tecnologia, esse protocolo existe apenas no papel.

### A Solução: Peptídeos Bio

**Para o Médico:**
- Prescrição digital com cálculo automático de dose e unidades na seringa
- Calendário de administração personalizado por paciente
- Alertas automáticos de período OFF e retorno ao ciclo
- Registro longitudinal de evolução clínica

**Para o Paciente:**
- Interface clara com horário exato de cada dose
- Rastreamento de validade de cada frasco
- Histórico completo de protocolos anteriores
- Canal direto com o médico prescritor

### A Era dos Peptídeos Já Começou

Os dados do SURMOUNT-1 com Tirzepatida mudaram para sempre o piso de expectativa da medicina metabólica. A ativação de telomerase pelo Epitalon, a modulação de BDNF pelo Semax, a reprogramação metabólica pelo 5-Amino-1MQ, a proteção mitocondrial pelo SS-31 — cada um desses achados representaria um avanço significativo individualmente.

**Juntos, em protocolos orquestrados com precisão, representam a primeira vez na história da medicina em que temos ferramentas para intervir simultaneamente em múltiplos mecanismos primários do envelhecimento.**

> A medicina reativa tratava o que já havia quebrado. A medicina peptídica de precisão reprograma o sistema antes que ele quebre. Essa é a Era dos Peptídeos.

→ **peptideosbio.com**`),
    },
];

export default function Ebook2ReaderPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ email: string; plan: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (!token) { router.replace("/auth/login?redirect=/ebook2/reader"); return; }
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const userData = userStr ? JSON.parse(userStr) : null;
            const plan = userData?.plan || payload?.plan || "free";
            if (!["basic", "premium", "admin"].includes(plan)) { router.replace("/auth/login"); return; }
            setUser({ email: payload.email || "", plan });
        } catch { router.replace("/auth/login?redirect=/ebook2/reader"); return; }
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
            ebookId="ebook2"
            title="A Era dos Peptídeos"
            subtitle="Enciclopédia Técnica"
            chapters={CHAPTERS}
            user={user}
            showCalculator={true}
        />
    );
}
