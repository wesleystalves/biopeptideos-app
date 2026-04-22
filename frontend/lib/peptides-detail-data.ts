// Dados enriquecidos dos peptídeos — extraídos do clone peptideoshealth.com.br
// Complementa peptides-data.ts com informações clínicas detalhadas

export type PeptideProtocolPhase = {
    phase: string;
    dose: string;
    units: string;
};

export type PeptideProtocol = {
    title: string;
    route: string;
    phases: PeptideProtocolPhase[];
};

export type DosageByIndication = {
    indication: string;
    dose: string;
    frequency: string;
    duration: string;
};

export type PeptideInteraction = {
    type: 'synergic' | 'compatible' | 'monitor' | 'avoid';
    name: string;
    description: string;
};

export type PeptideStack = {
    name: string;
    peptides: string[];
    goal: string;
    description: string;
};

export type PeptideTimeline = {
    period: string;
    description: string;
};

export type PeptideReference = {
    id: number;
    title: string;
    source: string;
    year: string;
    summary: string;
    pubmedUrl?: string;
};

export type PeptideDetail = {
    peptideId: number;
    alternativeNames: string[];
    classification: string;
    evidenceLevel: 'Pré-clínico' | 'Clínico Fase I' | 'Clínico Fase II' | 'Clínico Fase III' | 'Aprovado (FDA/EMA)';
    halfLife: string;
    reconstitutionDifficulty: 'Fácil' | 'Moderada' | 'Difícil';
    whatIs: string;
    benefits: string[];
    mechanism: string[];
    mechanismDetailed: string;
    protocol?: PeptideProtocol;
    dosageByIndication?: DosageByIndication[];
    reconstitution?: string[];
    interactions?: PeptideInteraction[];
    stacks?: PeptideStack[];
    timeline?: PeptideTimeline[];
    references?: PeptideReference[];
};

export const PEPTIDE_DETAILS: Record<number, PeptideDetail> = {
    1: {
        peptideId: 1,
        alternativeNames: ['5-Amino-1-methylquinoline', '5A1MQ', 'NNMT Inhibitor'],
        classification: 'Inibidor enzimático de pequena molécula',
        evidenceLevel: 'Pré-clínico',
        halfLife: '~6-8 horas (oral)',
        reconstitutionDifficulty: 'Fácil',
        whatIs: 'O 5-Amino-1MQ é um peptídeo sintético que atua como um inibidor seletivo da enzima Nicotinamida N-metiltransferase (NNMT). Sua função principal é modular o metabolismo energético celular, elevando os níveis intracelulares de NAD+ e, consequentemente, ativando vias metabólicas como as mediadas pelas sirtuínas. Este mecanismo o posiciona como um agente promissor para o estudo de condições metabólicas e preservação de massa magra.',
        benefits: ['Potencializa a queima de gordura e a perda de peso.', 'Preserva a massa muscular magra durante a perda de peso.', 'Aumenta os níveis intracelulares de NAD+.', 'Melhora a sensibilidade à insulina.', 'Reduz a inflamação.'],
        mechanism: ['Inibe a enzima Nicotinamida N-metiltransferase (NNMT).', 'Aumenta os níveis de S-adenosilmetionina (SAM) e NAD+.', 'Ativa as sirtuínas (SIRT1), que regulam o metabolismo energético.', 'Modula a expressão gênica relacionada ao metabolismo de lipídios e glicose.'],
        mechanismDetailed: 'A NNMT é uma enzima que metila a nicotinamida, consumindo SAM (S-adenosilmetionina) no processo. Em tecidos adiposos de indivíduos obesos, a NNMT é superexpressa, o que reduz os níveis de SAM e NAD+, comprometendo o metabolismo energético celular. O 5-Amino-1MQ inibe seletivamente essa enzima, restaurando os níveis de SAM e NAD+. Com mais NAD+ disponível, as sirtuínas (especialmente SIRT1) são ativadas, promovendo a oxidação de ácidos graxos, a biogênese mitocondrial e a termogênese.',
        protocol: {
            title: 'Protocolo Subcutâneo (2 mL = 5 mg/mL)',
            route: 'Via: Subcutânea | Frequência: Uma ou duas vezes ao dia',
            phases: [
                { phase: 'Dias 1–2 (Tolerância)', dose: '2.5 mg 1x/dia', units: '50 unidades (0.50 mL)' },
                { phase: 'Dias 3–4 (Padrão)', dose: '5 mg 1x/dia', units: '100 unidades (1.0 mL)' },
                { phase: 'Alternativa BID', dose: '2.5 mg 2x/dia', units: '50 unidades (0.50 mL) × 2' },
            ],
        },
        dosageByIndication: [
            { indication: 'Perda de gordura / aumento metabólico', dose: '2,5–5 mg/dia', frequency: '1x ao dia (manhã, em jejum)', duration: 'Máx 12 sem ON / 8 sem OFF' },
            { indication: 'Quebra de platô / corte acelerado', dose: '5,0–7,5 mg/dia', frequency: 'Dividido 2.5 mg manhã + 2.5 mg tarde', duration: 'Máx 2 semanas' },
            { indication: 'Anti-envelhecimento / inibição de NNMT', dose: '2,5 mg/dia', frequency: '1x ao dia (5 dias ON / 2 OFF)', duration: '8-12 semanas' },
        ],
        reconstitution: ['Aspirar 2.0 mL de água bacteriostática com seringa estéril', 'Injetar lentamente pela parede do frasco; evitar espuma', 'Girar suavemente até dissolver (não agitar)', 'Rotular e refrigerar a 2–8°C, proteger da luz'],
        interactions: [
            { type: 'synergic', name: 'BPC-157', description: 'Vias complementares de cicatrização e regeneração tecidual.' },
            { type: 'synergic', name: 'MOTS-c', description: 'Ambos influenciam o metabolismo e a função mitocondrial, potencialmente amplificando os efeitos.' },
            { type: 'compatible', name: 'NAD+', description: 'Pode complementar o aumento de NAD+ por diferentes vias.' },
            { type: 'monitor', name: 'Metformina', description: 'Ambos atuam em vias metabólicas similares, monitorar hipoglicemia.' },
            { type: 'monitor', name: 'Insulina', description: 'Monitorar efeitos combinados no metabolismo da glicose.' },
        ],
        stacks: [
            { name: 'Stack Emagrecimento Avançado', peptides: ['5-Amino-1MQ', 'MOTS-c', 'AOD-9604'], goal: 'Perda de gordura acelerada', description: 'Combina inibição de NNMT com regulação metabólica mitocondrial e lipólise direta, atacando a gordura por três vias distintas.' },
            { name: 'Stack Metabolismo + Longevidade', peptides: ['5-Amino-1MQ', 'NAD+', 'Epithalon'], goal: 'Otimização metabólica e anti-aging', description: 'Eleva NAD+ por múltiplas vias, ativa sirtuínas e protege telômeros para benefícios metabólicos e de longevidade.' },
        ],
        timeline: [
            { period: 'Semana 1-2', description: 'Efeitos mínimos perceptíveis; composto se acumulando' },
            { period: 'Semana 3-4', description: 'Aumento da energia, melhora do humor, possível início da perda de peso' },
            { period: 'Mês 2-3', description: 'Perda de peso mais pronunciada, melhora da composição corporal' },
            { period: 'Mês 3-6', description: 'Otimização contínua do metabolismo, benefícios sustentados' },
        ],
        references: [
            { id: 1, title: '5-Amino-1-methylquinoline (5-Amino-1MQ) inhibits nicotinamide N-methyltransferase', source: 'Mice | In vivo | 2018', year: '2018', summary: 'Demonstrou que o 5-Amino-1MQ inibe a NNMT e levou à redução da obesidade em camundongos com obesidade induzida por dieta.', pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/30247353/' },
        ],
    },
    6: {
        peptideId: 6,
        alternativeNames: ['BPC157', 'Body Protection Compound-157', 'PL 14736'],
        classification: 'Pentadecapeptídeo (15 aminoácidos)',
        evidenceLevel: 'Pré-clínico',
        halfLife: '~4 horas (subcutâneo)',
        reconstitutionDifficulty: 'Fácil',
        whatIs: 'O BPC-157 é um pentadecapeptídeo sintético derivado de uma proteína protetora isolada do suco gástrico humano. Possui propriedades regenerativas excepcionais, atuando em múltiplos tecidos — muscular, tendíneo, ligamentar, vascular e neural. Estudos pré-clínicos demonstram capacidade significativa de acelerar a cicatrização, reduzir inflamação e proteger órgãos contra danos isquêmicos e tóxicos.',
        benefits: ['Acelera a cicatrização de músculos, tendões e ligamentos.', 'Reduz a inflamação local e sistêmica.', 'Protege a mucosa gastrointestinal.', 'Promove angiogênese (formação de novos vasos).', 'Tem efeitos neuroprotetores.', 'Pode reverter danos causados por AINEs.'],
        mechanism: ['Ativa receptores de fatores de crescimento (VEGFR, EGFR).', 'Estimula a expressão de fatores de cicatrização (VEGF, EGF).', 'Modula a via de sinalização do óxido nítrico (NO).', 'Inibe a produção de citocinas pró-inflamatórias (IL-6, TNF-α).', 'Promove a produção de colágeno e fibronectina.'],
        mechanismDetailed: 'O BPC-157 age de forma pleotrópica, modulando múltiplas vias de sinalização celular. Sua ação mais estudada é a ativação de receptores de fatores de crescimento endotelial vascular (VEGFR), promovendo angiogênese e vascularização de tecidos lesionados. Simultaneamente, modula a via do óxido nítrico, melhorando o fluxo sanguíneo e reduzindo o processo inflamatório. No trato gastrointestinal, estimula a produção de muco e protege a mucosa contra lesões por AINEs, álcool e isquemia.',
        protocol: {
            title: 'Protocolo Padrão (2 mL de BAC = 2.5 mg/mL)',
            route: 'Via: Subcutânea (próxima ao local da lesão) | Frequência: 2x ao dia',
            phases: [
                { phase: 'Fase Aguda (Sem 1–2)', dose: '250–500 mcg 2x/dia', units: '10–20 unidades (seringa 100UI)' },
                { phase: 'Fase de Manutenção (Sem 3+)', dose: '250 mcg 1x/dia', units: '10 unidades (seringa 100UI)' },
            ],
        },
        dosageByIndication: [
            { indication: 'Recuperação de lesão muscular/tendão', dose: '250–500 mcg/dia', frequency: '2x ao dia (manhã e noite)', duration: '6–12 semanas' },
            { indication: 'Proteção gastrointestinal', dose: '250 mcg/dia (oral)', frequency: '1x ao dia em jejum', duration: '4–8 semanas' },
            { indication: 'Neuroproteção / lesão neural', dose: '250–500 mcg/dia', frequency: '2x ao dia', duration: '8–12 semanas' },
        ],
        interactions: [
            { type: 'synergic', name: 'TB-500', description: 'Combinação sinérgica amplamente utilizada. BPC-157 acelera cicatrização inicial; TB-500 promove remodelamento e flexibilidade.' },
            { type: 'synergic', name: 'GHK-Cu', description: 'GHK-Cu potencializa a síntese de colágeno, complementando o efeito regenerativo do BPC-157.' },
            { type: 'compatible', name: 'CJC-1295 + Ipamorelin', description: 'O aumento de GH pode potencializar o reparo tecidual induzido pelo BPC-157.' },
            { type: 'avoid', name: 'AINEs (Ibuprofeno, Diclofenaco)', description: 'AINEs podem atenuar o efeito do BPC-157 ao inibir vias de cicatrização dependentes de prostaglandinas.' },
        ],
        stacks: [
            { name: 'Stack Recuperação Total', peptides: ['BPC-157', 'TB-500', 'GHK-Cu'], goal: 'Recuperação completa de lesões', description: 'Protocolo triplo para lesões severas: BPC-157 para cicatrização, TB-500 para remodelamento, GHK-Cu para colágeno.' },
            { name: 'Stack Gastrointestinal', peptides: ['BPC-157', 'KPV'], goal: 'Saúde e reparo do TGI', description: 'Combinação para condições inflamatórias intestinais, colite e síndrome do intestino irritável.' },
        ],
        timeline: [
            { period: 'Dias 1–7', description: 'Redução da dor e inflamação aguda' },
            { period: 'Semana 2–4', description: 'Aceleração visível da cicatrização, melhora da mobilidade' },
            { period: 'Mês 2–3', description: 'Remodelamento tecidual, recuperação funcional completa' },
        ],
        references: [
            { id: 1, title: 'Stable gastric pentadecapeptide BPC 157: novel therapy in gastrointestinal tract', source: 'Review | 2019', year: '2019', summary: 'Revisão abrangente dos efeitos do BPC-157 no trato GI e potencial terapêutico.', pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/30717706/' },
        ],
    },
    4: {
        peptideId: 4,
        alternativeNames: ['AOD9604', 'hGH Fragment 176-191', 'Anti-Obesity Drug'],
        classification: 'Fragmento peptídico do hGH (16 aminoácidos)',
        evidenceLevel: 'Clínico Fase II',
        halfLife: '~30 minutos',
        reconstitutionDifficulty: 'Moderada',
        whatIs: 'O AOD-9604 é um fragmento modificado do hormônio do crescimento humano (hGH), especificamente os aminoácidos 176 a 191 da cadeia C-terminal, com uma modificação na tirosina. Foi desenvolvido originalmente pela farmacêutica australiana Monash University com o objetivo de isolar e potencializar as propriedades lipolíticas do GH, sem os efeitos diabetogênicos e promotores de crescimento da molécula completa.',
        benefits: ['Estimula a lipólise e a queima de gordura corporal.', 'Inibe a lipogênese (formação de novas células de gordura).', 'Não eleva IGF-1 nem insulina.', 'Não interfere no crescimento ósseo.', 'Pode auxiliar na reparo cartilaginoso.'],
        mechanism: ['Liga-se diretamente a receptores beta-adrenérgicos no tecido adiposo.', 'Ativa a lipase hormônio-sensível (HSL) para quebrar triglicérides.', 'Inibe a diacilglicerol aciltransferase, reduzindo a síntese de gordura.', 'Não ativa receptores de GH completo, evitando efeitos sistêmicos.'],
        mechanismDetailed: 'O AOD-9604 age de forma altamente seletiva no tecido adiposo. Ao se ligar a receptores beta-adrenérgicos, ativa a lipase hormônio-sensível (HSL) dentro dos adipócitos, desencadeando a hidrólise de triglicérides armazenados em ácidos graxos livres e glicerol. Simultaneamente, inibe a enzima diacilglicerol aciltransferase (DGAT), responsável pela síntese de novos triglicérides. Esta dupla ação — aumentar a quebra e reduzir a formação de gordura — resulta em lipólise líquida sem os efeitos diabetogênicos do GH completo.',
        protocol: {
            title: 'Protocolo SC (2 mL BAC = 1.5 mg/mL)',
            route: 'Via: Subcutânea | Horário: Manhã em jejum (30 min antes de comer)',
            phases: [
                { phase: 'Semanas 1–2 (Adaptação)', dose: '200 mcg/dia', units: '13 unidades (seringa 100UI)' },
                { phase: 'Semanas 3+ (Padrão)', dose: '300 mcg/dia', units: '20 unidades (seringa 100UI)' },
            ],
        },
        dosageByIndication: [
            { indication: 'Emagrecimento geral', dose: '250–300 mcg/dia', frequency: '1x ao dia em jejum', duration: '12–16 semanas' },
            { indication: 'Corte pré-competição', dose: '300–500 mcg/dia', frequency: '1–2x ao dia', duration: 'Máx 8 semanas' },
        ],
        interactions: [
            { type: 'synergic', name: 'Semaglutida', description: 'Diferentes mecanismos de emagrecimento; Sema reduz apetite, AOD aumenta lipólise.' },
            { type: 'compatible', name: 'CJC-1295 + Ipamorelin', description: 'O aumento de GH endógeno pode complementar os efeitos lipolíticos do AOD-9604.' },
        ],
        stacks: [
            { name: 'Stack Emagrecimento', peptides: ['AOD-9604', 'CJC-1295 NO DAC', 'Ipamorelin'], goal: 'Perda de gordura + preservação muscular', description: 'AOD-9604 para lipólise direta, CJC+Ipamorelin para elevar GH natural e preservar massa magra.' },
        ],
        timeline: [
            { period: 'Semana 1–2', description: 'Aumento da lipólise, possível leve fadiga inicial' },
            { period: 'Semana 3–6', description: 'Perda de gordura visível, especialmente em regiões resistentes' },
            { period: 'Mês 2–4', description: 'Remodelamento corporal progressivo, melhora da composição' },
        ],
        references: [
            { id: 1, title: 'AOD9604: An Anti-Obesity Drug', source: 'Clinical Phase II | 2004', year: '2004', summary: 'Ensaio clínico fase IIb mostrando eficácia do AOD-9604 para perda de peso em humanos obesos.', pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/15655242/' },
        ],
    },
    20: {
        peptideId: 20,
        alternativeNames: ['Epitalon', 'Epitalone', 'Tetrapeptide-2'],
        classification: 'Tetrapeptídeo biorregulador sintético',
        evidenceLevel: 'Pré-clínico',
        halfLife: 'Curta (minutos); efeitos epigenéticos prolongados',
        reconstitutionDifficulty: 'Fácil',
        whatIs: 'O Epithalon (também "Epitalon") é um tetrapeptídeo sintético (Ala-Glu-Asp-Gly) que mimetiza o Epithalamin, uma substância natural produzida pela glândula pineal. Foi desenvolvido e amplamente estudado pelo Instituto de Gerontologia de São Petersburgo, na Rússia. Seu principal mecanismo de ação é a regulação da atividade telomerase, enzima responsável pelo alongamento dos telômeros — estruturas que protegem as extremidades dos cromossomos e se encurtam com cada divisão celular.',
        benefits: ['Ativa a telomerase e prolonga os telômeros.', 'Regula o ciclo circadiano e normaliza a produção de melatonina.', 'Apresenta propriedades antioxidantes.', 'Pode reduzir a incidência de tumores (dados em roedores).', 'Melhora a função imunológica em idosos.'],
        mechanism: ['Ativa a enzima telomerase (hTERT) nas células somáticas.', 'Promove o alongamento dos telômeros encurtados.', 'Regula a expressão de genes relacionados ao ritmo circadiano.', 'Aumenta a sensibilidade da glândula pineal à estimulação luminosa.'],
        mechanismDetailed: 'O Epithalon atua diretamente no núcleo celular, regulando a expressão de genes envolvidos no ciclo celular e na senescência. Sua ação mais estudada é a ativação da enzima telomerase em células somáticas, que normalmente não expressam essa enzima. Ao ativar a telomerase, o Epithalon pode reverter ou retardar o encurtamento dos telômeros que ocorre a cada divisão celular, potencialmente retardando o envelhecimento celular.',
        protocol: {
            title: 'Protocolo Clássico de 10 Dias',
            route: 'Via: Subcutânea ou Intramuscular | Frequência: 1–2x ao dia',
            phases: [
                { phase: 'Protocolo 10 dias', dose: '5–10 mg/dia', units: '20–40 unidades (seringa 100UI)' },
                { phase: 'Manutenção (opcional)', dose: '5 mg/dia por 5 dias', units: '20 unidades' },
            ],
        },
        dosageByIndication: [
            { indication: 'Anti-aging / longevidade', dose: '5–10 mg/dia', frequency: '1–2x ao dia por 10 dias', duration: '2x por ano (ciclos semestrais)' },
            { indication: 'Distúrbio circadiano / sono', dose: '5 mg/dia', frequency: '1x ao dia à noite', duration: '10 dias' },
        ],
        interactions: [
            { type: 'synergic', name: 'GHK-Cu', description: 'Combinação anti-aging com GHK-Cu para reparação de DNA e Epithalon para telômeros.' },
            { type: 'compatible', name: 'Cartalax', description: 'Biorreguladores complementares; ciclos separados ou simultâneos em doses baixas.' },
            { type: 'compatible', name: 'Pinealon', description: 'Ambos regulam a glândula pineal; podem ser usados no mesmo ciclo de 10 dias.' },
        ],
        stacks: [
            { name: 'Stack Anti-Aging Avançado', peptides: ['Epithalon', 'GHK-Cu', 'Cartalax'], goal: 'Longevidade e rejuvenescimento celular', description: 'Protocolo sazonal de 10 dias combinando regulação de telômeros, reparo de colágeno e saúde articular.' },
        ],
        timeline: [
            { period: 'Dias 1–5', description: 'Ajuste circadiano, possível melhora inicial do sono' },
            { period: 'Dias 6–10', description: 'Conclusão do ciclo; efeitos acumulando a nível celular' },
            { period: 'Meses 1–3', description: 'Efeitos epigenéticos graduais; possível melhora de marcadores inflamatórios' },
            { period: 'Meses 6+', description: 'Benefícios cumulativos com ciclos repetidos semestralmente' },
        ],
        references: [
            { id: 1, title: 'Telomere elongation in immortalized human cells without detectable telomerase activity', source: 'Russia | Clinical | 2003', year: '2003', summary: 'Estudo russo demonstrando que o Epithalon pode ativar telomerase em células humanas.', pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/12937089/' },
        ],
    },
    54: {
        peptideId: 54,
        alternativeNames: ['Ozempic', 'Wegovy', 'Rybelsus', 'Semaglutide'],
        classification: 'Agonista do receptor GLP-1 (análogo de GLP-1 acilado)',
        evidenceLevel: 'Aprovado (FDA/EMA)',
        halfLife: '~7 dias',
        reconstitutionDifficulty: 'Fácil',
        whatIs: 'A Semaglutida é um análogo de longa ação do peptídeo semelhante ao glucagon tipo 1 (GLP-1), um hormônio intestinal naturalmente produzido em resposta à ingestão de alimentos. Aprovada pelo FDA, é amplamente utilizada para controle do diabetes tipo 2 (Ozempic) e obesidade (Wegovy). Na forma composta injetável (frasco), permite titulação personalizada. Atua suprimindo o apetite, retardando o esvaziamento gástrico e melhorando a sensibilidade à insulina.',
        benefits: ['Supressão significativa do apetite.', 'Perda de peso (%10-15% do peso corporal em média).', 'Melhora do controle glicêmico (HbA1c).', 'Redução de risco cardiovascular.', 'Melhora dos marcadores metabólicos (colesterol, triglicérides).'],
        mechanism: ['Agonista dos receptores GLP-1 no pâncreas, hipotálamo e TGI.', 'Estimula a secreção de insulina de forma glicose-dependente.', 'Inibe a secreção de glucagon.', 'Retarda o esvaziamento gástrico, prolongando a saciedade.', 'Atua no hipotálamo para reduzir o apetite.'],
        mechanismDetailed: 'A Semaglutida se liga com alta afinidade e duração prolongada aos receptores GLP-1 distribuídos pelo organismo. No pâncreas, estimula a secreção de insulina exclusivamente quando a glicose está elevada (ação glicose-dependente), eliminando o risco de hipoglicemia. No hipotálamo, ativa circuitos de saciedade que reduzem o apetite e a ingestão calórica. No estômago, retarda o esvaziamento, prolongando a sensação de plenitude. A meia-vida de 7 dias permite dose semanal única.',
        protocol: {
            title: 'Protocolo de Titulação Gradual',
            route: 'Via: Subcutânea | Frequência: 1x por semana',
            phases: [
                { phase: 'Semanas 1–4 (Início)', dose: '0.25 mg/semana', units: '5 unidades (seringa 100UI, frasco 5mg/mL)' },
                { phase: 'Semanas 5–8', dose: '0.5 mg/semana', units: '10 unidades' },
                { phase: 'Semanas 9–12', dose: '1.0 mg/semana', units: '20 unidades' },
                { phase: 'Manutenção (2,4mg máximo)', dose: '1–2.4 mg/semana', units: '20–48 unidades' },
            ],
        },
        dosageByIndication: [
            { indication: 'Controle glicêmico (T2D)', dose: '0.5–1.0 mg/semana', frequency: '1x por semana', duration: 'Longo prazo' },
            { indication: 'Emagrecimento', dose: '1.0–2.4 mg/semana', frequency: '1x por semana', duration: 'Mínimo 12–24 semanas' },
        ],
        interactions: [
            { type: 'avoid', name: 'Tirzepatida', description: 'NUNCA combinar dois agonistas GLP-1/GIP. Risco grave de vômito, desidratação e hipoglicemia.' },
            { type: 'monitor', name: 'Insulina', description: 'Risco de hipoglicemia. Pode ser necessário reduzir dose de insulina.' },
            { type: 'compatible', name: 'AOD-9604', description: 'Mecanismos complementares: Semaglutida reduz apetite, AOD-9604 estimula lipólise direta.' },
        ],
        stacks: [
            { name: 'Stack GLP-1 + Lipólise', peptides: ['Semaglutida', 'AOD-9604'], goal: 'Emagrecimento acelerado', description: 'Semaglutida para controle do apetite e glicemia, AOD-9604 para lipólise direta.' },
        ],
        timeline: [
            { period: 'Semana 1–4', description: 'Início da redução de apetite, possíveis náuseas (fase de adaptação)' },
            { period: 'Semana 4–8', description: 'Perda de peso de 1–3% visível, melhora do controle glicêmico' },
            { period: 'Mês 3–6', description: 'Perda de 5–10% do peso corporal, estabilização dos efeitos colaterais' },
            { period: 'Mês 6+', description: 'Perda total de 10–15% do peso corporal com adesão ao protocolo' },
        ],
        references: [
            { id: 1, title: 'Once-Weekly Semaglutide in Adults with Overweight or Obesity (STEP 1)', source: 'RCT | NEJM | 2021', year: '2021', summary: 'Ensaio clínico fase III demonstrando 14.9% de perda de peso com semaglutida 2.4mg vs 2.4% placebo.', pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/33567185/' },
        ],
    },
    66: {
        peptideId: 66,
        alternativeNames: ['Mounjaro', 'Zepbound', 'LY3298176', 'Tirzepatide'],
        classification: 'Agonista dual de receptores GIP/GLP-1',
        evidenceLevel: 'Aprovado (FDA/EMA)',
        halfLife: '~5 dias',
        reconstitutionDifficulty: 'Fácil',
        whatIs: 'A Tirzepatida é uma molécula inovadora, denominada "twincretin", que age simultaneamente como agonista dos receptores GIP (peptídeo insulinotrópico dependente de glicose) e GLP-1 (peptídeo semelhante ao glucagon tipo 1). Aprovada pelo FDA em 2022 para diabetes tipo 2 (Mounjaro) e em 2023 para obesidade (Zepbound), representa a próxima geração dos medicamentos incretínicos, com resultados superiores à semaglutida tanto em controle glicêmico quanto em perda de peso.',
        benefits: ['Perda de peso de até 20–22% do peso corporal.', 'Melhora significativa da HbA1c.', 'Redução da gordura visceral e hepática.', 'Melhora de marcadores cardiovasculares.', 'Benefícios metabólicos superiores à semaglutida.'],
        mechanism: ['Agonista dual dos receptores GIP e GLP-1.', 'Estimula secreção de insulina de forma glicose-dependente.', 'Inibe glucagon pós-prandial.', 'Reduz apetite via hipotálamo.', 'Retarda esvaziamento gástrico.', 'GIP potencializa os efeitos de GLP-1 no pâncreas e tecido adiposo.'],
        mechanismDetailed: 'A Tirzepatida age como um polipeptídeo híbrido que incorpora sequências de aminoácidos de GIP e GLP-1. A ativação dual dos receptores GIP e GLP-1 produz efeitos sinérgicos superiores à ativação de qualquer receptor isoladamente. O receptor GIP no tecido adiposo aumenta a lipólise e pode direcionar partículas lipídicas para depósitos subcutâneos em vez de viscerais. No pâncreas, a dupla ativação produz uma resposta insulinômica mais robusta. No hipotálamo, o efeito combinado no controle do apetite é significativamente maior que o do GLP-1 isolado.',
        protocol: {
            title: 'Protocolo de Titulação Gradual',
            route: 'Via: Subcutânea | Frequência: 1x por semana',
            phases: [
                { phase: 'Semanas 1–4', dose: '2.5 mg/semana', units: 'Conforme frasco reconstituído' },
                { phase: 'Semanas 5–8', dose: '5.0 mg/semana', units: 'Conforme frasco reconstituído' },
                { phase: 'Semanas 9–12', dose: '7.5 mg/semana', units: 'Conforme frasco reconstituído' },
                { phase: 'Manutenção (até 15mg)', dose: '10–15 mg/semana', units: 'Conforme titulação' },
            ],
        },
        dosageByIndication: [
            { indication: 'Controle do T2D', dose: '5–15 mg/semana', frequency: '1x por semana', duration: 'Longo prazo' },
            { indication: 'Emagrecimento (obesidade)', dose: '10–15 mg/semana', frequency: '1x por semana', duration: 'Mínimo 16–24 semanas' },
        ],
        interactions: [
            { type: 'avoid', name: 'Semaglutida', description: 'NUNCA combinar. Sobrecarga de receptores GLP-1: vômitos graves, desidratação, risco de pancreatite.' },
            { type: 'monitor', name: 'Insulina', description: 'Monitorar hipoglicemia. Frequentemente necessário reduzir ou eliminar insulina basal.' },
            { type: 'compatible', name: 'MOTS-c', description: 'MOTS-c pode complementar o metabolismo mitocondrial sem interferir nos receptores GIP/GLP-1.' },
        ],
        stacks: [
            { name: 'Stack Metabólico Avançado', peptides: ['Tirzepatida', 'MOTS-c'], goal: 'Otimização metabólica completa', description: 'Tirzepatida para controle hormonal/glicêmico, MOTS-c para otimização mitocondrial.' },
        ],
        timeline: [
            { period: 'Semana 1–4', description: 'Início de supressão do apetite, adaptação GI (náuseas comuns)' },
            { period: 'Semana 4–12', description: 'Perda de 5–8% do peso; melhora glicêmica visível' },
            { period: 'Mês 3–6', description: 'Perda de 10–15% do peso; estabilização dos efeitos colaterais' },
            { period: 'Mês 6–12', description: 'Perda total de até 20–22% com dose máxima' },
        ],
        references: [
            { id: 1, title: 'Tirzepatide Once Weekly for the Treatment of Obesity (SURMOUNT-1)', source: 'RCT | NEJM | 2022', year: '2022', summary: 'Ensaio fase III: perda de peso de 20.9% com tirzepatida 15mg vs 3.1% placebo.', pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/35658024/' },
        ],
    },
    62: {
        peptideId: 62,
        alternativeNames: ['Thymosin Beta-4', 'Tβ4', 'TB4'],
        classification: 'Peptídeo de 43 aminoácidos derivado da Timosina Beta-4',
        evidenceLevel: 'Pré-clínico',
        halfLife: '~30 minutos (endógena); efeitos prolongados por dias',
        reconstitutionDifficulty: 'Fácil',
        whatIs: 'O TB-500 é uma versão sintética do fragmento ativo da Timosina Beta-4 (Tβ4), uma proteína naturalmente presente em altas concentrações em plaquetas e tecidos em reparo. A Tβ4 é um dos peptídeos de cicatrização mais abundantes do corpo humano, sendo liberada imediatamente após uma lesão. O TB-500 reproduz a sequência de aminoácidos responsável pela maioria das propriedades terapêuticas da Tβ4, incluindo promoção da angiogênese, migração celular e modulação de actina.',
        benefits: ['Acelera a cicatrização de músculos, tendões e ligamentos.', 'Promove a formação de novos vasos sanguíneos (angiogênese).', 'Reduz a inflamação pós-lesão.', 'Melhora a flexibilidade e amplitude de movimento.', 'Pode ter efeitos cardioprotetores.'],
        mechanism: ['Liga-se à actina G monomérica, regulando polimerização.', 'Promove migração de células endoteliais e mioblastos para o local da lesão.', 'Estimula VEGF para angiogênese.', 'Ativa vias anti-apoptóticas nas células em reparo.'],
        mechanismDetailed: 'O principal mecanismo do TB-500 envolve a sequência LKKTETQ, que é o domínio de ligação à actina. Ao modular a dinâmica da actina, o TB-500 facilita a migração celular — um processo essencial para cicatrização. Células que precisam se mover para o local da lesão (fibroblastos, células endoteliais, mioblastos) dependem da reorganização do citoesqueleto de actina. O TB-500 também ativa a quinase Akt, promovendo a sobrevivência celular e inibindo a apoptose nas células danificadas.',
        protocol: {
            title: 'Protocolo Bifásico (Carga + Manutenção)',
            route: 'Via: Subcutânea ou Intramuscular | Frequência: 2x por semana (carga) / 1x por semana (manutenção)',
            phases: [
                { phase: 'Carga (Semanas 1–6)', dose: '2–2.5 mg 2x/semana', units: 'Conforme concentração do frasco' },
                { phase: 'Manutenção (Semana 7+)', dose: '2–2.5 mg 1x/semana', units: 'Conforme concentração do frasco' },
            ],
        },
        dosageByIndication: [
            { indication: 'Lesão aguda (músculo/tendão)', dose: '2.5 mg 2x/semana', frequency: '2x por semana', duration: '6 semanas + manutenção' },
            { indication: 'Lesão crônica / prevenção', dose: '2.0 mg 1x/semana', frequency: '1x por semana', duration: 'Indefinido' },
        ],
        interactions: [
            { type: 'synergic', name: 'BPC-157', description: 'A combinação mais estudada em recuperação. BPC-157 para cicatrização inicial + TB-500 para remodelamento e angiogênese.' },
            { type: 'compatible', name: 'GHK-Cu', description: 'GHK-Cu complementa com síntese de colágeno e reparo de DNA.' },
        ],
        stacks: [
            { name: 'Stack Recuperação Total', peptides: ['TB-500', 'BPC-157', 'GHK-Cu'], goal: 'Recuperação de lesões severas', description: 'O protocolo mais completo para recuperação: BPC-157 para cicatrização, TB-500 para remodelamento, GHK-Cu para colágeno.' },
        ],
        timeline: [
            { period: 'Semana 1–2', description: 'Início da redução de inflamação e dor' },
            { period: 'Semana 3–4', description: 'Melhora da amplitude de movimento, tecido se reorganizando' },
            { period: 'Semana 5–8', description: 'Recuperação funcional progressiva, remodelamento tecidual' },
        ],
        references: [
            { id: 1, title: 'Thymosin beta4 is a potent regulator of tumor cell motility and migration', source: 'In vitro | 2012', year: '2012', summary: 'Demonstra o papel do TB4 na regulação da migração celular via actina.', pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/22238667/' },
        ],
    },
};

export function getPeptideDetail(id: number): PeptideDetail | undefined {
    return PEPTIDE_DETAILS[id];
}
