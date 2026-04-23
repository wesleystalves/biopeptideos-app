// Auto-gerado do bundle JS do peptideoshealth.com.br — NÃO editar manualmente
// IDs com dados enriquecidos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 18, 20, 21, 22, 23, 31, 34, 37, 41, 50, 51, 53, 54, 56, 60, 61, 62, 63, 65, 66]

export type PeptideProtocolPhase = { phase: string; dose: string; units: string; };
export type PeptideProtocol = { title: string; route: string; phases: PeptideProtocolPhase[]; };
export type DosageByIndication = { indication: string; dose: string; frequency: string; duration: string; };
export type PeptideInteraction = { type: 'synergic' | 'compatible' | 'monitor' | 'avoid'; name: string; description: string; };
export type PeptideStack = { name: string; peptides: string[]; goal: string; description: string; };
export type PeptideTimeline = { period: string; description: string; };
export type PeptideReference = { id: number; title: string; source: string; year: string; summary: string; pubmedUrl?: string; };

export type PeptideDetail = {
  peptideId: number; alternativeNames: string[]; classification: string;
  evidenceLevel: string; halfLife: string; reconstitutionDifficulty: string;
  whatIs: string; benefits: string[]; mechanism: string[]; mechanismDetailed: string;
  protocol?: PeptideProtocol; dosageByIndication?: DosageByIndication[];
  reconstitution?: string[]; interactions?: PeptideInteraction[];
  stacks?: PeptideStack[]; timeline?: PeptideTimeline[]; references?: PeptideReference[];
};

export const PEPTIDE_DETAILS: Record<number, PeptideDetail> = {
  1: {
    peptideId: 1,
    alternativeNames: ["5-Amino-1-methylquinoline", "5A1MQ", "NNMT Inhibitor"],
    classification: "Inibidor enzimático de pequena molécula",
    evidenceLevel: "Pré-clínico",
    halfLife: "~6-8 horas (oral)",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O 5-Amino-1MQ é um peptídeo sintético que atua como um inibidor seletivo da enzima Nicotinamida N-metiltransferase (NNMT). Sua função principal é modular o metabolismo energético celular, elevando os níveis intracelulares de NAD+ e, consequentemente, ativando vias metabólicas como as mediadas pelas sirtuínas. Este mecanismo o posiciona como um agente promissor para o estudo de condições metabólicas e preservação de massa magra.",
    benefits: ["Potencializa a queima de gordura e a perda de peso.", "Preserva a massa muscular magra durante a perda de peso.", "Aumenta os níveis intracelulares de NAD+.", "Melhora a sensibilidade à insulina.", "Reduz a inflamação."],
    mechanism: ["Inibe a enzima Nicotinamida N-metiltransferase (NNMT).", "Aumenta os níveis de S-adenosilmetionina (SAM) e NAD+.", "Ativa as sirtuínas (SIRT1), que regulam o metabolismo energético.", "Modula a expressão gênica relacionada ao metabolismo de lipídios e glicose."],
    mechanismDetailed: "A NNMT é uma enzima que metila a nicotinamida, consumindo SAM (S-adenosilmetionina) no processo. Em tecidos adiposos de indivíduos obesos, a NNMT é superexpressa, o que reduz os níveis de SAM e NAD+, comprometendo o metabolismo energético celular. O 5-Amino-1MQ inibe seletivamente essa enzima, restaurando os níveis de SAM e NAD+. Com mais NAD+ disponível, as sirtuínas (especialmente SIRT1) são ativadas, promovendo a oxidação de ácidos graxos, a biogênese mitocondrial e a termogênese. Este mecani",
    timeline: [
      { period: "Semana 1-2", description: "Redução inicial do apetite e aumento do metabolismo basal." },
      { period: "Semana 3-6", description: "Perda de gordura perceptível e melhora da composição corporal." },
      { period: "Mês 2-3", description: "Otimização metabólica consolidada e manutenção de massa magra." },
    ],

    protocol: {
      title: "Protocolo de Uso de 5-Amino-1MQ",
      route: "Via oral (cápsulas)",
      phases: [
        { phase: "Fase Inicial", dose: "50-100mg/dia", units: "1x ao dia" },
        { phase: "Manutenção", dose: "100-200mg/dia", units: "Ciclos de 8-12 semanas" },
      ],
    },
    dosageByIndication: [
      { indication: "Perda de gordura", dose: "100mg", frequency: "1x/dia", duration: "8-12 semanas" },
      { indication: "Composição corporal", dose: "200mg", frequency: "1x/dia", duration: "12 semanas" },
    ],
    reconstitution: [
      "Disponível em cápsula — não requer reconstituição.",
      "Ingerir com água preferencialmente em jejum ou antes do treino.",
    ],
    interactions: [
      { name: "Semaglutide / GLP-1", type: "synergic", description: "Combinação sinérgica: inibe NNMT (5-Amino-1MQ) + reduce apetite (GLP-1)→ maior perda de gordura." },
      { name: "IGF-1 LR3", type: "compatible", description: "Compatível: IGF-1 preserva massa magra enquanto 5-Amino-1MQ queima gordura." },
    ],
    stacks: [
      { name: "Stack Queima de Gordura", peptides: ["5-Amino-1MQ", "AOD-9604", "Semaglutide"], goal: "Perda de gordura máxima", description: "Triple stack metabólico: inibição de NNMT + ação lipocito-seletiva + supressão de apetite." },
    ],
  },
  2: {
    peptideId: 2,
    alternativeNames: ["Adamax peptide", "ACTH(4-10) analogue", "Heptapeptídeo nootrópico"],
    classification: "Heptapeptídeo sintético (análogo de Semax)",
    evidenceLevel: "Pré-clínico",
    halfLife: "~2-4 horas",
    reconstitutionDifficulty: "Moderada",
    whatIs: "Adamax é um heptapeptídeo nootrópico e neuroprotetor, análogo modificado do Semax, que deriva do fragmento ACTH(4–10). Sua estrutura incorpora um grupo adamantano, o qual otimiza a penetração da barreira hematoencefálica e aumenta a estabilidade metabólica do peptídeo, potencializando seus efeitos cognitivos e protetores neuronais.",
    benefits: ["Melhora da função cognitiva, incluindo memória e aprendizado.", "Aumento da neuroproteção contra danos oxidativos e inflamatórios.", "Potencial para reduzir a ansiedade e o estresse.", "Aprimoramento do foco e da atenção.", "Possível melhora do humor e bem-estar geral."],
    mechanism: ["Modulação da atividade de neurotransmissores como dopamina e serotonina.", "Aumento da expressão de fatores neurotróficos, como o BDNF (fator neurotrófico derivado do cérebro).", "Regulação da plasticidade sináptica e formação de novas conexões neuronais.", "Redução da neuroinflamação e do estresse oxidativo no cérebro.", "Interação com receptores específicos no sistema nervoso central para exercer seus efeitos."],
    mechanismDetailed: "O Adamax atua como um análogo aprimorado do Semax, com a adição de um grupo adamantano que confere maior lipofilia e estabilidade metabólica. Isso permite uma melhor penetração na barreira hematoencefálica, resultando em maior biodisponibilidade cerebral. Uma vez no SNC, modula múltiplos sistemas de neurotransmissores, incluindo dopaminérgico e serotoninérgico, além de estimular a expressão de BDNF, um fator essencial para a sobrevivência neuronal, plasticidade sináptica e neurogênese. A combina",
    timeline: [
      { period: "Dias 1-7", description: "Melhora inicial do foco e clareza mental." },
      { period: "Semana 2-4", description: "Ganhos de memória e velocidade de aprendizado." },
      { period: "Mês 1-2+", description: "Neuroproteção consolidada e cognição superior." },
    ],

    protocol: {
      title: "Protocolo Adamax (BPC-157 + TB-500)",
      route: "Subcutâneo ou intramuscular",
      phases: [
        { phase: "Fase Aguda (Lesão)", dose: "500mcg BPC-157 + 1mg TB-500", units: "5x/semana por 2 semanas" },
        { phase: "Manutenção", dose: "250mcg BPC-157 + 500mcg TB-500", units: "2-3x/semana por 4-6 semanas" },
      ],
    },
    dosageByIndication: [
      { indication: "Lesão articular aguda", dose: "1mg blend", frequency: "Diária", duration: "2-4 semanas" },
      { indication: "Recuperação pós-cirurgia", dose: "500mcg blend", frequency: "3x/semana", duration: "6-8 semanas" },
    ],
    reconstitution: [
      "Reconstituir BPC-157 com 2mL de água bacteriostática.",
      "Reconstituir TB-500 com 1mL de água bacteriostática.",
      "Combinar conforme protocolo. Armazenar refrigerado 2-8°C.",
      "Usar dentro de 30 dias após a reconstituição.",
    ],
    interactions: [
      { name: "BPC-157", type: "synergic", description: "Adamax já contém BPC-157 — stack pré-formulado com ação combinada." },
      { name: "IGF-1 / MGF", type: "synergic", description: "Adicionar IGF-1 ou MGF amplifica os efeitos anabólicos e de reparo." },
      { name: "Anticoagulantes", type: "monitor", description: "Monitorar se em uso de anticoagulantes — BPC-157 pode modular a coagulação." },
    ],
    stacks: [
      { name: "Stack Ultimate Recovery", peptides: ["BPC-157", "TB-500", "GHK-Cu"], goal: "Recuperação máxima de lesões", description: "Triplo stack de recuperação: reparo tecidual sistêmico + regeneração local + remodelação de colágeno." },
    ],
  },
  3: {
    peptideId: 3,
    alternativeNames: ["Acadesine", "AICA-Riboside", "5-Aminoimidazole-4-carboxamide ribonucleoside"],
    classification: "Análogo nucleosídeo de adenosina",
    evidenceLevel: "Pré-clínico",
    halfLife: "~3-4 horas",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O AICAR é um análogo nucleosídeo de adenosina, um composto endógeno, que atua como um ativador direto da proteína quinase ativada por AMP (AMPK). Sua principal função farmacológica é mimetizar o estado de baixo consumo energético celular, promovendo a regulação metabólica e a biogênese mitocondrial, o que lhe confere propriedades de melhora da resistência física.",
    benefits: ["Aumento da resistência e desempenho físico.", "Potencial para melhorar a função metabólica em condições de repouso.", "Redução da gordura corporal e melhora da composição corporal.", "Proteção contra danos isquêmicos em órgãos.", "Possível aplicação no tratamento de doenças metabólicas como diabetes tipo 2."],
    mechanism: ["Ativação direta da AMPK, uma enzima chave na regulação do metabolismo energético celular.", "Mimetiza o estado de baixo nível de energia celular, induzindo vias metabólicas associadas ao exercício.", "Aumento da captação de glicose e oxidação de ácidos graxos nos músculos.", "Modulação da expressão gênica de enzimas envolvidas no metabolismo energético."],
    mechanismDetailed: "O AICAR é convertido intracelularmente em ZMP (AICA ribotídeo), um análogo do AMP que ativa diretamente a AMPK (proteína quinase ativada por AMP). A AMPK é um sensor energético master que, quando ativado, desencadeia uma cascata de respostas metabólicas: aumento da captação de glicose (independente de insulina), oxidação de ácidos graxos, biogênese mitocondrial e inibição de vias anabólicas energeticamente custosas. Essencialmente, o AICAR 'engana' a célula fazendo-a acreditar que está em um est",
    timeline: [
      { period: "Semana 1-2", description: "Aumento da resistência e melhora do metabolismo energético." },
      { period: "Semana 3-6", description: "Melhora da composição corporal e captação de glicose." },
      { period: "Mês 2-3", description: "Adaptações metabólicas consistentes e resistência física elevada." },
    ],

    protocol: {
      title: "Protocolo de Uso de AICAR",
      route: "Subcutâneo ou intravenoso",
      phases: [
        { phase: "Fase de Uso", dose: "50-100mg", units: "Diária por 14-21 dias" },
        { phase: "Off", dose: "—", units: "2-4 semanas de pausa" },
      ],
    },
    dosageByIndication: [
      { indication: "Performance atlética", dose: "50-100mg/dia", frequency: "Diária", duration: "2-3 semanas" },
      { indication: "Sensibilidade à insulina", dose: "50mg", frequency: "5x/semana", duration: "4 semanas" },
    ],
    reconstitution: [
      "Reconstituir com água bacteriostática ou solução salina.",
      "Concentração típica: 10mg/mL.",
      "Armazenar a 2-8°C. Usar dentro de 30 dias.",
    ],
    interactions: [
      { name: "Metformina", type: "synergic", description: "Ação complementar na ativação de AMPK e melhora metabólica." },
      { name: "GH / IGF-1", type: "compatible", description: "Compatível: AICAR melhora sensibilidade enquanto GH/IGF-1 promovem crescimento." },
      { name: "Anticoagulantes", type: "monitor", description: "AICAR pode ter efeitos no metabolismo — monitorar com cuidado." },
    ],
    stacks: [
      { name: "Stack Performance Endurance", peptides: ["AICAR", "SLU-PP-332", "TB-500"], goal: "Resistência e performance atlética", description: "Combinação de ativadores de AMPK e ERRγ para maximizar endurance + recuperação." },
    ],
  },
  4: {
    peptideId: 4,
    alternativeNames: ["Anti-Obesity Drug 9604", "hGH Fragment 177-191", "Tyr-hGH177-191"],
    classification: "Fragmento peptídico do hGH (16 aminoácidos)",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~30 minutos",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O AOD-9604 é um peptídeo sintético, um fragmento modificado da região C-terminal do hormônio do crescimento humano (hGH 177-191), projetado para promover a lipólise e inibir a lipogênese sem os efeitos metabólicos sistêmicos do hGH intacto. Sua ação se concentra na mobilização de gordura, distinguindo-o de outros análogos do hGH por não elevar os níveis de IGF-1 ou induzir resistência à insulina.",
    benefits: ["Redução da gordura corporal", "Potencial para melhorar o perfil lipídico", "Ausência de efeitos adversos comuns de GH, como elevação de IGF-1", "Não causa resistência à insulina", "Perfil de segurança favorável em estudos clínicos"],
    mechanism: ["Mimetiza a ação do hormônio do crescimento na regulação do metabolismo lipídico", "Atua especificamente no metabolismo da gordura, sem afetar o crescimento ou o metabolismo da glicose", "Estimula a liberação de ácidos graxos de adipócitos", "Inibe a conversão de nutrientes em gordura de armazenamento"],
    mechanismDetailed: "O AOD-9604 é um fragmento modificado do hGH que retém a atividade lipolítica do hormônio do crescimento sem seus efeitos anabólicos e diabetogênicos. Ele se liga a receptores específicos nos adipócitos, ativando a lipólise (quebra de triglicerídeos em ácidos graxos livres e glicerol) e simultaneamente inibindo a lipogênese (formação de novas moléculas de gordura). Diferentemente do hGH completo, o AOD-9604 não estimula a produção de IGF-1 nem afeta o metabolismo da glicose, o que confere um perf",
    timeline: [
      { period: "Semana 1-2", description: "Início da mobilização de gordura e aumento da lipólise." },
      { period: "Semana 3-6", description: "Redução perceptível da gordura corporal, especialmente abdominal." },
      { period: "Mês 2-3", description: "Melhora consolidada da composição corporal." },
    ],

    protocol: {
      title: "Protocolo AOD-9604",
      route: "Subcutâneo (SC)",
      phases: [
        { phase: "Fase Principal", dose: "300-500mcg/dia", units: "Em jejum matinal por 12 semanas" },
        { phase: "Manutenção", dose: "250mcg/dia", units: "3-4x/semana" },
      ],
    },
    dosageByIndication: [
      { indication: "Perda de gordura (geral)", dose: "300mcg", frequency: "1x/dia em jejum", duration: "12 semanas" },
      { indication: "Gordura abdominal", dose: "500mcg", frequency: "1x/dia", duration: "8-12 semanas" },
    ],
    reconstitution: [
      "Reconstituir com 2mL de água bacteriostática.",
      "Agitar suavemente. NÃO agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Aplicar subcutâneo 30min antes do café da manhã.",
    ],
    interactions: [
      { name: "Semaglutide / GLP-1", type: "synergic", description: "Sinergia potente: AOD-9604 queima gordura localmente + GLP-1 reduz apetite." },
      { name: "5-Amino-1MQ", type: "synergic", description: "Ambos atuam no metabolismo lipídico por vias diferentes → efeito aditivo." },
      { name: "HGH / GH exógeno", type: "compatible", description: "AOD-9604 não interfere com GH exógeno, pode ser usado junto com segurança." },
    ],
    stacks: [
      { name: "Stack Fat Loss Premium", peptides: ["AOD-9604", "5-Amino-1MQ", "Semaglutide"], goal: "Queima de gordura máxima", description: "Triple stack metabólico para composição corporal avançada." },
      { name: "Stack Corpo", peptides: ["AOD-9604", "Ipamorelin", "CJC-1295"], goal: "Queima de gordura + massa magra", description: "AOD-9604 queima gordura sem elevar GH; peptídeos GH preservam e constroem músculo." },
    ],
  },
  5: {
    peptideId: 5,
    alternativeNames: ["Cibinetide", "ARA 290", "EPO-derived peptide"],
    classification: "Peptídeo não-eritropoiético (11 aminoácidos)",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~2 minutos (IV); efeitos farmacológicos prolongados",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O Ara-290 é um peptídeo não-eritropoiético de 11 aminoácidos, derivado do domínio helix-B da eritropoietina, que atua como um agonista seletivo do receptor de reparo inato (IRR). Sua função principal é modular a inflamação e promover a proteção tecidual sem induzir a eritropoiese, oferecendo um perfil terapêutico distinto para condições como neuropatias.",
    benefits: ["Redução da dor neuropática", "Melhora da função nervosa em neuropatias", "Proteção contra danos teciduais", "Potencial tratamento para doenças autoimunes", "Efeitos anti-inflamatórios localizados"],
    mechanism: ["Ativação do receptor de reparo inato (IRR)", "Modulação de vias de sinalização intracelulares", "Redução da inflamação e apoptose celular", "Promoção da reparação tecidual", "Diferenciação de células progenitoras"],
    mechanismDetailed: "O Ara-290 é derivado da helix-B da eritropoietina e ativa seletivamente o receptor de reparo inato (IRR), um heterodímero composto pelo receptor de EPO e pelo receptor beta comum (CD131). Diferentemente da EPO, o Ara-290 não se liga ao receptor homodimérico de EPO responsável pela eritropoiese, evitando efeitos hematopoiéticos. A ativação do IRR desencadeia vias de sinalização anti-apoptóticas e anti-inflamatórias, incluindo JAK2/STAT5, PI3K/Akt e NF-κB, promovendo sobrevivência celular, redução",
    timeline: [
      { period: "Semana 1-2", description: "Início da redução da dor neuropática." },
      { period: "Semana 3-6", description: "Melhora perceptível da função nervosa e bem-estar." },
      { period: "Mês 2-3", description: "Neuroproteção e redução da dor consolidadas." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "2mg", units: "2x/sem" },
        { phase: "Duração do Ciclo", dose: "8-12 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "2mg", frequency: "2x/sem", duration: "8-12 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "BPC-157", type: "synergic", description: "Reparo neural complementar" },
      { name: "NAD+", type: "compatible", description: "Energia celular apoia neuroproteção" },
    ],
    stacks: [
      { name: "Stack Neuro", peptides: ["Ara-290", "NAD+"], goal: "Saúde neural", description: "Neuropeptídeo + coenzima vital" },
    ],
  },
  6: {
    peptideId: 6,
    alternativeNames: ["Body Protection Compound-157", "BPC 15", "Bepecin", "PL 14736", "PL-10"],
    classification: "Pentadecapeptídeo (15 aminoácidos)",
    evidenceLevel: "Pré-clínico",
    halfLife: "~4 horas (subcutâneo)",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O BPC-157 é um peptídeo sintético de 15 aminoácidos, derivado de uma proteína gástrica, que exibe potentes propriedades citoprotetoras e de cicatrização tecidual. Sua função principal reside na promoção da reparação de diversos tecidos, incluindo músculos, tendões e ossos, através de mecanismos que envolvem angiogênese e modulação inflamatória. Estudos pré-clínicos sugerem seu potencial terapêutico em uma ampla gama de condições que envolvem danos teciduais.",
    benefits: ["Acelera a cicatrização de tendões, ligamentos, músculos e ossos.", "Reduz a inflamação e a dor em lesões musculoesqueléticas.", "Promove a angiogênese (formação de novos vasos sanguíneos).", "Protege o trato gastrointestinal contra úlceras e inflamações.", "Pode melhorar a recuperação de lesões nervosas."],
    mechanism: ["Modula a expressão de fatores de crescimento, como o VEGF e o FGF-2.", "Aumenta a produção de óxido nítrico, melhorando o fluxo sanguíneo.", "Interage com o sistema de óxido nítrico para promover a angiogênese.", "Exibe efeitos anti-inflamatórios através da modulação de citocinas.", "Protege as células endoteliais e promove a sua proliferação."],
    mechanismDetailed: "",
    timeline: [
      { period: "Dias 3-7", description: "Redução da inflamação e início da cicatrização tecidual." },
      { period: "Semana 2-4", description: "Melhora perceptível da lesão e redução da dor." },
      { period: "Mês 1-2", description: "Recuperação funcional completa e cicatrização consolidada." },
    ],

    protocol: {
      title: "Protocolo BPC-157",
      route: "SC, IM ou oral (comprimido)",
      phases: [
        { phase: "Fase Aguda", dose: "500mcg 2x/dia", units: "Local à lesão — 2 semanas" },
        { phase: "Manutenção", dose: "250-500mcg/dia", units: "1x/dia por 4-6 semanas" },
      ],
    },
    dosageByIndication: [
      { indication: "Lesão tendinosa/muscular", dose: "500mcg", frequency: "2x/dia", duration: "2-4 semanas" },
      { indication: "Recuperação GI", dose: "500mcg", frequency: "1x/dia oral", duration: "4-8 semanas" },
      { indication: "Saúde geral preventiva", dose: "250mcg", frequency: "1x/dia", duration: "Ciclos de 12 semanas" },
    ],
    reconstitution: [
      "Reconstituir 5mg com 2mL de água bacteriostática (2500mcg/mL).",
      "Para 500mcg, usar 0.2mL da solução reconstituída.",
      "Armazenar a 2-8°C. Usar dentro de 30 dias.",
      "Aplicar próximo à área lesada para efeito local máximo.",
    ],
    interactions: [
      { name: "TB-500", type: "synergic", description: "Stack clássico de recuperação: BPC-157 (reparo local) + TB-500 (sistêmico)." },
      { name: "GHK-Cu", type: "synergic", description: "GHK-Cu amplifica a remodelação de colágeno gerada pelo BPC-157." },
      { name: "NSAIDS / AINEs", type: "monitor", description: "AINEs podem reduzir eficácia de BPC-157. Preferir paracetamol se necessário." },
      { name: "KPV", type: "synergic", description: "KPV amplifica ação anti-inflamatória intestinal do BPC-157 oral." },
    ],
    stacks: [
      { name: "Stack Recuperação Total", peptides: ["BPC-157", "TB-500", "GHK-Cu"], goal: "Recuperação máxima de lesões", description: "O stack mais estudado para recuperação: reparo local + sistêmico + colágeno." },
      { name: "Stack GI Health", peptides: ["BPC-157", "KPV"], goal: "Saúde intestinal", description: "BPC-157 (sistêmico) + KPV (anti-inflamatório GI) para saúde do trato gastrointestinal." },
    ],
  },
  7: {
    peptideId: 7,
    alternativeNames: ["BPC-157 Neuro", "BPC-157 Nootrópico"],
    classification: "Pentadecapeptídeo (15 aminoácidos) — uso nootrópico",
    evidenceLevel: "Pré-clínico",
    halfLife: "~4 horas (subcutâneo)",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O BPC-157 para Neuroproteção é um peptídeo gástrico sintético que atua como um potente agente neuroprotetor e nootrópico. Ele exerce sua função modulando neurotransmissores, promovendo a angiogênese cerebral e ativando vias de sinalização essenciais para o crescimento e a proteção neuronal contra danos. Este peptídeo multifuncional oferece um promissor potencial terapêutico na preservação da saúde cerebral e na recuperação de lesões neurológicas.",
    benefits: ["Proteção contra danos cerebrais", "Melhora do humor e motivação", "Recuperação de lesões no SNC", "Potencial contra neurodegeneração", "Melhora do eixo intestino-cérebro"],
    mechanism: ["Modula o sistema dopaminérgico e serotoninérgico", "Promove angiogênese cerebral", "Protege contra neurotoxicidade", "Ativa vias de sinalização de crescimento neuronal"],
    mechanismDetailed: "O BPC-157 exerce seus efeitos neuroprotetores através da modulação dos sistemas dopaminérgico e serotoninérgico no SNC. Ele protege contra a neurotoxicidade induzida por diversas substâncias, incluindo metanfetaminas, álcool e organofosforados. Promove a angiogênese cerebral, aumentando o suprimento sanguíneo para áreas lesionadas, e ativa vias de sinalização de crescimento neuronal como JAK-2/STAT-3 e Akt. Sua ação no eixo intestino-cérebro, mediada pela modulação do nervo vago e do sistema ent",
    timeline: [
      { period: "Dias 3-7", description: "Melhora do humor e redução da neuroinflamação." },
      { period: "Semana 2-4", description: "Melhora do eixo intestino-cérebro e clareza mental." },
      { period: "Mês 1-2", description: "Neuroproteção consolidada e bem-estar sustentado." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "SC/Oral",
      phases: [
        { phase: "Dose Principal", dose: "250mcg", units: "1x/dia" },
        { phase: "Duração do Ciclo", dose: "4-8 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "250mcg", frequency: "1x/dia", duration: "4-8 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC/Oral.",
    ],
    interactions: [
      { name: "BPC-157", type: "synergic", description: "Variante neuro + original GI = reparo total" },
      { name: "KPV", type: "synergic", description: "Anti-inflamatório intestinal adicional" },
    ],
    stacks: [
      { name: "Stack GI+Brain", peptides: ["BPC-157", "KPV"], goal: "Intestino e cérebro", description: "Reparo GI e neuroproteção simultâneos" },
    ],
  },
  8: {
    peptideId: 8,
    alternativeNames: ["NN9838", "AM833", "Long-acting amylin analogue"],
    classification: "Análogo acilado da amilina",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~160 horas (semanal)",
    reconstitutionDifficulty: "Moderada",
    whatIs: "Cagrilintide é um análogo acilado de ação prolongada do hormônio amilina, que atua como um agonista do receptor de amilina. Sua função principal é promover saciedade e retardar o esvaziamento gástrico, resultando na redução da ingestão alimentar e perda de peso. Este peptídeo sintético foi desenvolvido para mimetizar os efeitos fisiológicos da amilina endógena.",
    benefits: ["Promove perda de peso significativa e sustentada.", "Melhora o controle glicêmico em pacientes com diabetes tipo 2.", "Reduz o apetite e a ingestão calórica.", "Potencial para tratamento da obesidade e sobrepeso.", "Administração semanal conveniente."],
    mechanism: ["Ativa os receptores de amilina (AMY1, AMY2, AMY3) no sistema nervoso central.", "Aumenta a sensação de saciedade e plenitude.", "Retarda o esvaziamento gástrico, prolongando a sensação de saciedade.", "Modula a liberação de glucagon."],
    mechanismDetailed: "A Cagrilintide é um análogo da amilina humana com modificações químicas (acilação com ácido graxo C18) que prolongam drasticamente sua meia-vida, permitindo dosagem semanal. Ela ativa os receptores de amilina (AMY1-3), que são heterodímeros do receptor de calcitonina com proteínas RAMP. No SNC, particularmente na área postrema e núcleo do trato solitário, a ativação desses receptores reduz o apetite e promove saciedade. Perifericamente, retarda o esvaziamento gástrico e suprime a secreção de glu",
    timeline: [
      { period: "Semana 1-4", description: "Redução do apetite e início da perda de peso." },
      { period: "Mês 2-3", description: "Perda de peso de 5-10% do peso corporal." },
      { period: "Mês 4-6+", description: "Perda de peso sustentada e melhora metabólica." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "0.3-1mg", units: "1x/sem" },
        { phase: "Duração do Ciclo", dose: "24 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "0.3-1mg", frequency: "1x/sem", duration: "24 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Semaglutide", type: "synergic", description: "Mecanismos complementares de saciedade" },
      { name: "Metformina", type: "compatible", description: "Controle glicêmico aditivo" },
    ],
    stacks: [
      { name: "Stack Saciedade", peptides: ["Cagrilintide", "Semaglutide"], goal: "Saciedade máxima", description: "Amilina + GLP-1 = combo de saciedade premium" },
    ],
  },
  9: {
    peptideId: 9,
    alternativeNames: ["Ala-Glu-Asp-Arg", "AEDR", "Peptídeo biorregulador cardíaco"],
    classification: "Tetrapeptídeo biorregulador sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "~30-60 minutos",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Cardiogen é um tetrapeptídeo biorregulador sintético (Ala-Glu-Asp-Arg) que atua como um agente cardioprotetor e reparador celular. Ele modula vias de sobrevivência intracelulares, promovendo a integridade citoesquelética e inibindo a apoptose em cardiomiócitos sob estresse.",
    benefits: ["Suporte à função cardíaca em condições de estresse.", "Potencial para melhorar a recuperação após lesão isquêmica.", "Redução da inflamação em tecido cardíaco.", "Otimização da bioenergética celular cardíaca.", "Proteção contra danos oxidativos no miocárdio."],
    mechanism: ["Modulação da expressão gênica de proteínas envolvidas na integridade celular.", "Ativação de vias de sinalização anti-apoptóticas.", "Estabilização da membrana celular e do citoesqueleto.", "Regulação da homeostase de cálcio intracelular.", "Aumento da atividade de enzimas antioxidantes endógenas."],
    mechanismDetailed: "O Cardiogen, como outros peptídeos biorreguladores desenvolvidos pelo Prof. Khavinson, atua ao nível da regulação epigenética da expressão gênica. O tetrapeptídeo Ala-Glu-Asp-Arg se liga ao DNA em regiões promotoras específicas de genes relacionados à função cardíaca, modulando a transcrição de proteínas essenciais para a integridade do cardiomiócito. Isso inclui proteínas anti-apoptóticas (Bcl-2), enzimas antioxidantes (SOD, catalase), e componentes do citoesqueleto. Além disso, regula a homeos",
    timeline: [
      { period: "Semana 1-2", description: "Melhora do metabolismo energético cardíaco." },
      { period: "Semana 3-6", description: "Redução da inflamação cardíaca e proteção celular." },
      { period: "Mês 2-3", description: "Cardioproteção consolidada e melhora da função cardíaca." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1mg", units: "2x/sem" },
        { phase: "Duração do Ciclo", dose: "8 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1mg", frequency: "2x/sem", duration: "8 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "BPC-157", type: "synergic", description: "Reparo + proteção cardíaca sinérgica" },
      { name: "SS-31", type: "synergic", description: "Saúde mitocondrial cardíaca" },
    ],
    stacks: [
      { name: "Stack Cardio", peptides: ["Cardiogen", "SS-31", "NAD+"], goal: "Saúde cardíaca", description: "Proteção cardíaca + mitocôndria + energia" },
    ],
  },
  10: {
    peptideId: 10,
    alternativeNames: ["Ala-Glu-Asp", "AED", "Peptídeo biorregulador cartilaginoso"],
    classification: "Tripeptídeo biorregulador sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "Curta (minutos); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Cartalax é um tripeptídeo biorregulador sintético (Ala-Glu-Asp) que atua modulando a expressão gênica em condrócitos, promovendo a síntese de componentes da matriz extracelular como colágeno tipo II e agrecan. Sua função principal é a proteção e regeneração da cartilagem articular, com propriedades anti-aging que atuam na preservação da integridade tecidual.",
    benefits: ["Proteção e regeneração da cartilagem articular", "Melhora da função articular e mobilidade", "Propriedades anti-aging celulares", "Modulação da expressão gênica em condrócitos", "Suporte à saúde musculoesquelética"],
    mechanism: ["Modulação da expressão gênica em condrócitos", "Estímulo à síntese de colágeno tipo II e agrecan", "Supressão de sinais pró-degenerativos", "Regulação epigenética da homeostase cartilaginosa"],
    mechanismDetailed: "O Cartalax (AED) é um citomédino que atua modulando a expressão gênica em células cartilaginosas. Ele estimula a síntese de componentes da matriz extracelular como colágeno tipo II e agrecan, enquanto suprime vias de sinalização pró-degenerativas. Também pode atuar como agente senomórfico, suprimindo o fenótipo secretório associado à senescência (SASP) em condrócitos envelhecidos.",
    timeline: [
      { period: "Semana 1-2", description: "Redução inicial da inflamação articular." },
      { period: "Semana 3-6", description: "Melhora da mobilidade e redução da dor articular." },
      { period: "Mês 2-3", description: "Regeneração cartilaginosa e proteção articular consolidadas." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1mg", units: "2x/sem" },
        { phase: "Duração do Ciclo", dose: "8-12 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1mg", frequency: "2x/sem", duration: "8-12 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "BPC-157", type: "synergic", description: "Reparo tecidual total inclui articulações" },
      { name: "TB-500", type: "synergic", description: "Recuperação sistêmica amplificada" },
    ],
    stacks: [
      { name: "Stack Articular", peptides: ["Cartalax", "BPC-157", "TB-500"], goal: "Recuperação articular", description: "Cartilagem + reparo local + sistêmico" },
    ],
  },
  12: {
    peptideId: 12,
    alternativeNames: ["FPF-1070", "Cerebrolysina"],
    classification: "Mistura peptídica neurotrófica (derivada de suínos)",
    evidenceLevel: "Clínico Fase III",
    halfLife: "~6-8 horas (IM); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "A Cerebrolysina é uma mistura peptídica biotecnológica derivada de proteínas cerebrais purificadas de suínos. Contém neuropeptídeos de baixo peso molecular que mimetizam BDNF, GDNF, CNTF e NGF. É um dos tratamentos mais validados clinicamente para AVC isquêmico, demência vascular, Alzheimer e lesões cerebrais traumáticas.",
    benefits: ["Acelera recuperação pós-AVC e traumatismo craniano", "Melhora memória, atenção e cognição em idosos", "Protege contra declínio neurodegenerativo", "Melhora humor e clareza mental", "Estimula regeneração de nervos periféricos"],
    mechanism: ["Proteção contra estresse oxidativo e excitotoxicidade do glutamato", "Estimulação da neuroplasticidade e sinaptogênese", "Melhora do metabolismo energético cerebral", "Inibição da formação de placas amiloides"],
    mechanismDetailed: "A Cerebrolysina atua através de um mecanismo multimodal: protege neurônios contra estresse oxidativo e excitotoxicidade do glutamato; estimula neuroplasticidade e formação de novas sinapses; melhora metabolismo energético cerebral; e inibe formação de placas amiloides e emaranhados neurofibrilares. Seus neuropeptídeos mimetizam a ação de fatores neurotróficos endógenos.",
    timeline: [
      { period: "Dias 1-7", description: "Melhora progressiva na clareza mental e humor." },
      { period: "Semana 2-4", description: "Melhora perceptível na memória de trabalho." },
      { period: "Mês 2-3", description: "Ganhos cognitivos e neuroproteção consolidados." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "IV/IM",
      phases: [
        { phase: "Dose Principal", dose: "5-10mL", units: "1x/dia" },
        { phase: "Duração do Ciclo", dose: "10-20 dias", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "5-10mL", frequency: "1x/dia", duration: "10-20 dias" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: IV/IM.",
    ],
    interactions: [
      { name: "Semax", type: "synergic", description: "Neuroproteção + nootrópico potenciada" },
      { name: "NAD+", type: "synergic", description: "Energia celular para função neural otimizada" },
    ],
    stacks: [
      { name: "Stack Brain", peptides: ["Cerebrolysin", "Semax", "NAD+"], goal: "Cognição máxima", description: "Fator trófico + nootrópico + energia" },
    ],
  },
  14: {
    peptideId: 14,
    alternativeNames: ["CJC-1295 with DAC", "Drug Affinity Complex", "DAC:GRF"],
    classification: "Análogo de GHRH com Drug Affinity Complex",
    evidenceLevel: "Clínico Fase II",
    halfLife: "6-8 dias",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O CJC-1295 DAC é um análogo sintético do hormônio liberador do hormônio do crescimento (GHRH) modificado com um Drug Affinity Complex (DAC) que se liga reversivelmente à albumina sérica, estendendo drasticamente sua meia-vida para 6-8 dias. Isso permite administração semanal e elevação sustentada dos níveis de GH e IGF-1.",
    benefits: ["Liberação sustentada e elevada de GH", "Aumento significativo de IGF-1", "Melhora da composição corporal", "Recuperação muscular acelerada", "Melhora da qualidade do sono"],
    mechanism: ["Ativação sustentada do receptor GHRH na hipófise", "Ligação reversível à albumina via DAC prolongando meia-vida", "Estímulo à liberação pulsátil de GH", "Aumento dos níveis de IGF-1 sistêmico"],
    mechanismDetailed: "O CJC-1295 DAC contém o peptídeo Mod GRF 1-29 conjugado a um Drug Affinity Complex (DAC) que se liga reversivelmente à albumina sérica. Essa modificação estende a meia-vida de ~30 minutos para 6-8 dias, mantendo elevação contínua de GH e IGF-1.",
    timeline: [
      { period: "Semana 1-2", description: "Aumento gradual de GH e IGF-1 circulante." },
      { period: "Semana 3-6", description: "Melhora do sono e composição corporal inicial." },
      { period: "Mês 2-3", description: "Ganho de massa magra e redução de gordura consolidados." },
    ],

    protocol: {
      title: "Protocolo CJC-1295 com DAC",
      route: "Subcutâneo (SC)",
      phases: [
        { phase: "Fase Principal", dose: "1-2mg/semana", units: "1 injeção por semana" },
        { phase: "Manutenção", dose: "1mg/semana", units: "Ciclos de 12-16 semanas" },
      ],
    },
    dosageByIndication: [
      { indication: "Composição corporal (avançado)", dose: "2mg", frequency: "1x/semana", duration: "12-16 semanas" },
      { indication: "Anti-aging / longevidade", dose: "1mg", frequency: "1x/semana", duration: "Ciclos de 16 semanas" },
    ],
    reconstitution: [
      "Reconstituir 2mg com 2mL de água bacteriostática.",
      "Agitar suavemente até dissolver completamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias.",
      "Aplicar subcutâneo no abdômen, coxa ou glúteo.",
    ],
    interactions: [
      { name: "Ipamorelin", type: "synergic", description: "Stack clássico: CJC-1295 DAC (eleva pool de GH) + Ipamorelin (libera seletivamente) = liberação máxima." },
      { name: "GHK-Cu", type: "compatible", description: "GHK-Cu complementa os efeitos anti-aging de CJC-1295 com regeneração de colágeno." },
      { name: "Insulina", type: "monitor", description: "CJC-1295 eleva GH/IGF-1 — monitorar glicemia se diabético ou em uso de insulina." },
    ],
    stacks: [
      { name: "Stack GH Premium", peptides: ["CJC-1295 DAC", "Ipamorelin"], goal: "Liberação máxima de GH", description: "Stack mais popular de GH: GHRH + GHRP seletivo. Libera GH 3-5x mais que isolado." },
      { name: "Stack Anti-Aging", peptides: ["CJC-1295 DAC", "Epithalon", "GHK-Cu"], goal: "Longevidade e anti-aging", description: "Longevidade completa: GH restaurado + telômeros protegidos + pele regenerada." },
    ],
  },
  15: {
    peptideId: 15,
    alternativeNames: ["Modified GRF 1-29", "Mod GRF", "CJC-1295 without DAC"],
    classification: "Análogo de GHRH (29 aminoácidos modificados)",
    evidenceLevel: "Pré-clínico",
    halfLife: "~30 minutos",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O CJC-1295 NO DAC, também conhecido como Mod GRF 1-29, é um análogo truncado e modificado do GHRH que preserva a liberação pulsátil natural de GH. Sem o Drug Affinity Complex, tem meia-vida curta (~30 min), produzindo pulsos de GH mais fisiológicos e com menos efeitos colaterais como retenção hídrica.",
    benefits: ["Pulsos naturais e fisiológicos de GH", "Menos retenção hídrica que versão com DAC", "Melhora da recuperação muscular", "Melhora da qualidade do sono", "Melhor perfil de efeitos colaterais"],
    mechanism: ["Ativação do receptor GHRH na hipófise anterior", "Estímulo à liberação pulsátil de GH", "Meia-vida curta permite padrão fisiológico de GH", "Quatro substituições estabilizantes (D-Ala2, Gln8, Ala15, Leu27)"],
    mechanismDetailed: "O Mod GRF 1-29 é um análogo do GHRH com quatro substituições de aminoácidos que aumentam sua estabilidade contra degradação enzimática. Sem o DAC, mantém meia-vida curta (~30 min), gerando pulsos agudos de GH similares ao padrão fisiológico.",
    timeline: [
      { period: "Semana 1-2", description: "Melhora do sono profundo pela liberação pulsátil de GH." },
      { period: "Semana 3-6", description: "Recuperação muscular melhorada e aumento de IGF-1." },
      { period: "Mês 2-3", description: "Mudança na composição corporal consolidada." },
    ],

    protocol: {
      title: "Protocolo CJC-1295 sem DAC (Mod GRF)",
      route: "Subcutâneo (SC)",
      phases: [
        { phase: "Diário", dose: "100mcg 2-3x/dia", units: "Antes de dormir — pico fisiológico de GH" },
        { phase: "Ciclo de 12 semanas", dose: "100mcg", units: "Seguido de 4 semanas off" },
      ],
    },
    dosageByIndication: [
      { indication: "Composição corporal", dose: "100mcg 2x/dia", frequency: "2x/dia", duration: "12 semanas" },
      { indication: "Anti-aging", dose: "100mcg", frequency: "1x à noite", duration: "Uso contínuo com ciclos" },
    ],
    reconstitution: [
      "Reconstituir 2mg com 2mL de água bacteriostática.",
      "Concentração: 1mg/mL (1000mcg/mL).",
      "Para 100mcg, usar 0.1mL.",
      "Aplicar 30-60 min antes de dormir para sincronizar com pico natural de GH.",
    ],
    interactions: [
      { name: "Ipamorelin", type: "synergic", description: "Combinação clássica: NON-DAC (liberação aguda) + Ipamorelin (GHRP seletivo) = pico de GH fisiológico." },
      { name: "GHRP-6", type: "compatible", description: "GHRP-6 potencia a liberação de GH, apesar de aumentar fome — usar em cutting evitar." },
    ],
    stacks: [
      { name: "Stack GH Noturno", peptides: ["CJC-1295 no DAC", "Ipamorelin"], goal: "Recuperação e GH noturno", description: "Aplicar juntos 30min antes de dormir para maximizar o pico noturno fisiológico de GH." },
    ],
  },
  18: {
    peptideId: 18,
    alternativeNames: ["PNB-0408", "N-hexanoic-Tyr-Ile-(6) aminohexanoic amide"],
    classification: "Oligopeptídeo derivado de angiotensina IV",
    evidenceLevel: "Pré-clínico",
    halfLife: "~12-24 horas (oral)",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O Dihexa é um pequeno peptídeo derivado da angiotensina IV, considerado um dos nootrópicos mais potentes já descobertos. Com capacidade de promover sinaptogênese ordens de magnitude superior ao BDNF natural, ele atua via ativação da via HGF/c-Met para reparar e criar novas conexões neurais. Desenvolvido para Alzheimer, é reservado para declínio cognitivo significativo.",
    benefits: ["Potencial de reverter danos cognitivos e perda de memória", "Estimula criação massiva de novas conexões neurais", "Melhora drástica do aprendizado e retenção", "Neuroproteção contra doenças degenerativas", "Melhora da coordenação motora e função executiva"],
    mechanism: ["Agonismo do Fator de Crescimento de Hepatócitos (HGF)", "Ativação do receptor c-Met no cérebro", "Estimulação da formação de espinhas dendríticas", "Fortalecimento de conexões sinápticas existentes"],
    mechanismDetailed: "O Dihexa atua como agonista do HGF e seu receptor c-Met. No cérebro, a sinalização HGF/c-Met é fundamental para desenvolvimento sináptico, sobrevivência neuronal e plasticidade. Estudos demonstraram que é 7 ordens de magnitude mais potente que o BDNF na formação de sinapses, tornando-o o nootrópico mais potente conhecido.",
    timeline: [
      { period: "Semana 1-2", description: "Melhora inicial do foco e velocidade de raciocínio." },
      { period: "Semana 3-6", description: "Ganhos significativos de memória e aprendizado." },
      { period: "Mês 2-3", description: "Neuroproteção máxima e melhorias cognitivas consolidadas." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "SC/IN",
      phases: [
        { phase: "Dose Principal", dose: "1-4mg", units: "1x/dia" },
        { phase: "Duração do Ciclo", dose: "4-6 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1-4mg", frequency: "1x/dia", duration: "4-6 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC/IN.",
    ],
    interactions: [
      { name: "Semax", type: "synergic", description: "Dihexa + Semax = neurogênese máxima" },
      { name: "NAD+", type: "synergic", description: "Energia celular potencia cognição" },
    ],
    stacks: [
      { name: "Stack Cognitivo", peptides: ["Dihexa", "Semax", "NAD+"], goal: "Cognição máxima", description: "O stack nootrópico mais potente disponível" },
    ],
  },
  20: {
    peptideId: 20,
    alternativeNames: ["Epitalon", "AEDG", "Ala-Glu-Asp-Gly", "Epithalamin sintético"],
    classification: "Tetrapeptídeo biorregulador sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "Curta (minutos); efeitos epigenéticos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Epithalon é um tetrapeptídeo sintético (Ala-Glu-Asp-Gly) baseado no Epithalamin, um extrato natural da glândula pineal. Sua principal ação é a ativação da telomerase, a enzima responsável por estender os telômeros, conferindo-lhe propriedades anti-aging. Também regula o ciclo circadiano através da modulação da melatonina e exerce efeitos antioxidantes e epigenéticos.",
    benefits: ["Ativação da telomerase e extensão de telômeros", "Regulação do ciclo circadiano e melatonina", "Propriedades antioxidantes celulares", "Modulação epigenética do envelhecimento", "Melhora da qualidade do sono"],
    mechanism: ["Ativação direta da telomerase (hTERT)", "Extensão dos telômeros em células somáticas", "Modulação da produção de melatonina pela glândula pineal", "Regulação epigenética via interação com promotores gênicos", "Proteção contra estresse oxidativo celular"],
    mechanismDetailed: "O Epithalon ativa a telomerase interagindo diretamente com regiões promotoras do gene hTERT, a subunidade catalítica da telomerase. Isso resulta em extensão dos telômeros além do limite de Hayflick. Também modula a produção de melatonina pela glândula pineal e atua na remodelação da cromatina.",
    timeline: [
      { period: "Semana 1-4", description: "Melhora do sono e regulação circadiana." },
      { period: "Mês 1-3", description: "Ativação da telomerase e efeitos antioxidantes." },
      { period: "Mês 3-6+", description: "Efeitos anti-aging e epigenéticos de longo prazo." },
    ],

    protocol: {
      title: "Protocolo Epithalon",
      route: "SC ou IV (padrão russo)",
      phases: [
        { phase: "Ciclo Anual", dose: "10mg total", units: "5-10 injeções de 1-2mg — 1 ciclo/ano" },
        { phase: "Protocolo Intensivo", dose: "20mg total", units: "20 dias consecutivos de 1mg/dia" },
      ],
    },
    dosageByIndication: [
      { indication: "Anti-aging geral", dose: "1-2mg/dia", frequency: "Diária por 10-20 dias", duration: "1-2 ciclos/ano" },
      { indication: "Regulação do sono", dose: "1mg/dia", frequency: "Antes de dormir", duration: "10-15 dias" },
    ],
    reconstitution: [
      "Reconstituir 10mg com 2mL de água bacteriostática.",
      "Concentração: 5mg/mL. Para 1mg, usar 0.2mL.",
      "Aplicar SC ou IV. Armazenar a 2-8°C.",
      "Protocolo russo clássico: 1mg/dia por 10 dias, 1-2x/ano.",
    ],
    interactions: [
      { name: "GHK-Cu", type: "synergic", description: "Epithalon (telômeros) + GHK-Cu (colágeno/pele) = anti-aging completo." },
      { name: "Pinealon", type: "synergic", description: "Pinealon complementa a regulação pineal e do sono que Epithalon inicia." },
      { name: "NAD+", type: "compatible", description: "NAD+ IV + Epithalon = stack de longevidade potente." },
    ],
    stacks: [
      { name: "Stack Longevidade Premium", peptides: ["Epithalon", "NAD+", "GHK-Cu", "SS-31"], goal: "Anti-aging máximo", description: "Telômeros + coenzima vital + regeneração de pele + mitocôndrias = longevidade completa." },
    ],
  },
  21: {
    peptideId: 21,
    alternativeNames: ["Proxofim", "FOXO4-D-Retro-Inverso"],
    classification: "Peptídeo senolítico D-retro-inverso",
    evidenceLevel: "Pré-clínico",
    halfLife: "~24-48 horas",
    reconstitutionDifficulty: "Avançada",
    whatIs: "O FOXO4-DRI é um peptídeo senolítico de última geração que elimina seletivamente células senescentes ('células zumbis'). Ele interfere na interação FOXO4-p53, forçando células senescentes à apoptose sem afetar células saudáveis. Em estudos animais, resultou em melhoras drásticas na densidade do pelo, função renal, força física e saúde geral.",
    benefits: ["Eliminação de células senescentes em todo o corpo", "Redução da inflamação sistêmica crônica (inflammaging)", "Melhora da função dos órgãos (rins, fígado)", "Reversão de sinais físicos de envelhecimento", "Aumento da vitalidade física e resistência"],
    mechanism: ["Interrupção da interação FOXO4-p53", "Liberação de p53 para induzir apoptose em células senescentes", "Seletividade: células saudáveis não são afetadas", "Redução do fenótipo secretório associado à senescência (SASP)"],
    mechanismDetailed: "O FOXO4-DRI atua interrompendo a interação entre FOXO4 e p53 em células senescentes. Normalmente, FOXO4 mantém p53 sequestrada no núcleo, impedindo apoptose. O peptídeo compete com FOXO4, liberando p53 para sinalizar morte celular programada. Células saudáveis, que não dependem dessa interação para sobrevivência, não são afetadas.",
    timeline: [
      { period: "Dias 1-14", description: "Início da eliminação de células senescentes." },
      { period: "Semana 3-6", description: "Redução da inflammaging e melhora da vitalidade." },
      { period: "Mês 2-3", description: "Reversão de sinais de envelhecimento e função orgânica melhorada." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1.5mg", units: "3x/sem" },
        { phase: "Duração do Ciclo", dose: "3 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1.5mg", frequency: "3x/sem", duration: "3 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "NAD+", type: "synergic", description: "Senólise + energia celular restaurada" },
      { name: "Quercetin", type: "compatible", description: "Senolítico natural complementar" },
    ],
    stacks: [
      { name: "Stack Senolítico", peptides: ["FOXO4-DRI", "NAD+"], goal: "Eliminação de senescência", description: "Células zumbi + energia = rejuvenescimento" },
    ],
  },
  22: {
    peptideId: 22,
    alternativeNames: ["Glycyl-L-histidyl-L-lysine:copper(II)", "Copper peptide", "Lamin", "Iamin"],
    classification: "Tripeptídeo-cobre(II)",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~30 minutos (IV); tópico: contínuo",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O GHK-Cu é um tripeptídeo naturalmente presente no plasma humano, composto por glicil-L-histidil-L-lisina ligado a um íon cobre (II). Descoberto em 1973, seus níveis diminuem com a idade. É um potente agente de remodelação tecidual com propriedades anti-aging, anti-inflamatórias e regenerativas comprovadas.",
    benefits: ["Estimula a síntese de colágeno e elastina na pele.", "Promove crescimento capilar e reduz queda de cabelo.", "Acelera a cicatrização de feridas e lesões.", "Possui propriedades antioxidantes e anti-inflamatórias.", "Reduz linhas finas e rugas, melhorando a textura da pele."],
    mechanism: ["Ativa vias de sinalização de remodelação de matriz extracelular.", "Estimula a produção de metaloproteinases (MMPs) e TIMPs.", "Modula a expressão de mais de 4000 genes humanos.", "Promove angiogênese e atração de células-tronco mesenquimais."],
    mechanismDetailed: "",
    timeline: [
      { period: "Semana 1-2", description: "Melhora da textura e hidratação da pele." },
      { period: "Semana 3-6", description: "Aumento de colágeno, redução de linhas finas." },
      { period: "Mês 2-3", description: "Melhora consolidada da aparência e crescimento capilar." },
    ],

    protocol: {
      title: "Protocolo GHK-Cu",
      route: "Tópico, SC ou injetável sistêmico",
      phases: [
        { phase: "Tópico (cosmético)", dose: "Aplicação 2x/dia", units: "Sobre pele limpa — uso contínuo" },
        { phase: "Injetável SC", dose: "1-2mg 2x/semana", units: "Ciclos de 8-12 semanas" },
      ],
    },
    dosageByIndication: [
      { indication: "Anti-aging cutâneo", dose: "Creme 3-5%", frequency: "2x/dia tópico", duration: "Uso contínuo" },
      { indication: "Reparo sistêmico tecidual", dose: "1-2mg SC", frequency: "2x/semana", duration: "8-12 semanas" },
      { indication: "Crescimento capilar", dose: "Solução capilar 1-5%", frequency: "1x/dia", duration: "12-24 semanas" },
    ],
    reconstitution: [
      "Para uso injetável: reconstituir com 2mL de água bacteriostática.",
      "Concentração: 500mcg/mL.",
      "Para cosmético tópico: já disponível em formulações prontas.",
      "Armazenar a 2-8°C. Proteger da luz.",
    ],
    interactions: [
      { name: "BPC-157", type: "synergic", description: "BPC-157 promove cicatrização enquanto GHK-Cu aumenta qualidade do colágeno formado." },
      { name: "Epithalon", type: "synergic", description: "Epithalon + GHK-Cu = stack anti-aging completo: nível genético + tecidual." },
      { name: "Retinol (tópico)", type: "monitor", description: "Usar GHK-Cu e retinol em turnos (manhã/noite) para evitar irritação." },
    ],
    stacks: [
      { name: "Stack Anti-Aging Skin", peptides: ["GHK-Cu", "Epithalon", "SNAP-8"], goal: "Rejuvenescimento cutâneo", description: "Colágeno + telômeros + relaxamento muscular = protocolo completo de anti-aging facial." },
    ],
  },
  23: {
    peptideId: 23,
    alternativeNames: ["Growth Hormone Releasing Peptide 2", "Pralmorelin", "KP-102"],
    classification: "Hexapeptídeo secretagogo de GH (GHRP)",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~25-30 minutos",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O GHRP-2 é um secretagogo de GH de segunda geração que atua como agonista do receptor de grelina (GHS-R1a), estimulando forte liberação de hormônio do crescimento pela hipófise. É considerado um dos GHRPs mais potentes, com efeitos adicionais no estímulo ao apetite e modulação do eixo somatotrófico.",
    benefits: ["Forte liberação de GH pela hipófise", "Aumento do apetite e ingestão calórica", "Recuperação muscular acelerada", "Melhora da qualidade do sono", "Aumento da densidade óssea"],
    mechanism: ["Agonismo do receptor de grelina (GHS-R1a) na hipófise", "Estímulo à liberação pulsátil de GH", "Aumento moderado de cortisol e prolactina", "Sinergismo com GHRH endógeno ou exógeno"],
    mechanismDetailed: "O GHRP-2 se liga ao receptor de secretagogos de GH (GHS-R1a) na hipófise anterior, desencadeando liberação aguda de GH. Possui maior potência na liberação de GH com menos estímulo de apetite que GHRP-6. Quando combinado com GHRH (como CJC-1295), produz liberação sinérgica significativamente maior.",
    timeline: [
      { period: "Semana 1-2", description: "Aumento do apetite e melhora da qualidade do sono." },
      { period: "Semana 3-4", description: "Melhora da recuperação muscular e aumento de IGF-1." },
      { period: "Mês 2-3", description: "Melhora da composição corporal e densidade óssea." },
    ],

    protocol: {
      title: "Protocolo GHRP-2",
      route: "Subcutâneo (SC)",
      phases: [
        { phase: "Fase Bulking", dose: "200-300mcg 3x/dia", units: "Em jejum — antes das refeições e ao dormir" },
        { phase: "Manutenção", dose: "100-200mcg 2x/dia", units: "Manhã em jejum + noite" },
      ],
    },
    dosageByIndication: [
      { indication: "Ganho de massa muscular", dose: "200-300mcg", frequency: "3x/dia", duration: "8-12 semanas" },
      { indication: "Anti-aging / GH geral", dose: "100mcg", frequency: "2x/dia", duration: "12-16 semanas" },
    ],
    reconstitution: [
      "Reconstituir 5mg com 2mL de água bacteriostática (2500mcg/mL).",
      "Para 200mcg, usar 0.08mL (80 unidades em seringa U-100).",
      "Armazenar a 2-8°C. Usar dentro de 30 dias.",
      "Aplicar sempre em jejum (mínimo 2h sem comer antes).",
    ],
    interactions: [
      { name: "CJC-1295", type: "synergic", description: "Stack GHRH + GHRP: CJC-1295 eleva pool de GH e GHRP-2 dispara a liberação — sinergia máxima." },
      { name: "Ipamorelin", type: "synergic", description: "Alternativa sinérgica: GHRP-2 + Ipamorelin é mais potente que cada um isolado." },
      { name: "Insulina", type: "monitor", description: "GHRP-2 aumenta GH/IGF-1 — monitorar glicemia em diabéticos." },
      { name: "Cortisol alto", type: "monitor", description: "GHRP-2 pode elevar cortisol e prolactina em doses altas — monitorar labs." },
    ],
    stacks: [
      { name: "Stack GH Intensivo", peptides: ["GHRP-2", "CJC-1295 no DAC"], goal: "Liberação máxima de GH", description: "Stack clássico de GH: GHRH + GHRP. Aplicar juntos em jejum para pico sinérgico." },
    ],
  },
  31: {
    peptideId: 31,
    alternativeNames: ["IPA", "NNC 26-0161"],
    classification: "Pentapeptídeo secretagogo de GH (GHRP)",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~2 horas",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Ipamorelin é um secretagogo de GH altamente seletivo que estimula a liberação de hormônio do crescimento sem causar elevações significativas de cortisol ou prolactina. É considerado o GHRP mais 'limpo', com o melhor perfil de efeitos colaterais entre os secretagogos de GH.",
    benefits: ["Liberação seletiva de GH sem elevar cortisol ou prolactina", "Melhora significativa da qualidade do sono", "Recuperação muscular acelerada", "Melhora da composição corporal", "Perfil de segurança superior entre os GHRPs"],
    mechanism: ["Agonismo seletivo do receptor de grelina (GHS-R1a)", "Liberação de GH sem afetar cortisol, prolactina ou aldosterona", "Preservação do padrão pulsátil natural de GH", "Sinergismo com GHRH exógeno"],
    mechanismDetailed: "O Ipamorelin se liga seletivamente ao receptor GHS-R1a na hipófise, estimulando a liberação de GH de forma dose-dependente. Sua alta seletividade significa que não causa elevações de cortisol ou prolactina em doses terapêuticas. Quando combinado com CJC-1295, produz liberação sinérgica de GH 3-5x maior.",
    timeline: [
      { period: "Semana 1-2", description: "Melhora significativa do sono profundo." },
      { period: "Semana 3-6", description: "Aumento de GH e IGF-1, melhora da recuperação." },
      { period: "Mês 2-3", description: "Melhora da composição corporal sem elevação de cortisol." },
    ],

    protocol: {
      title: "Protocolo Ipamorelin",
      route: "Subcutâneo (SC)",
      phases: [
        { phase: "Fase Inicial", dose: "200-300mcg 2-3x/dia", units: "Em jejum — manhã e noite" },
        { phase: "Manutenção", dose: "200mcg 2x/dia", units: "Ciclos de 12-16 semanas" },
      ],
    },
    dosageByIndication: [
      { indication: "Composição corporal", dose: "200-300mcg", frequency: "2-3x/dia", duration: "12 semanas" },
      { indication: "Melhora do sono", dose: "200mcg", frequency: "1x à noite", duration: "Uso contínuo" },
    ],
    reconstitution: [
      "Reconstituir 5mg com 2mL de água bacteriostática (2500mcg/mL).",
      "Para 200mcg, usar 0.08mL.",
      "Armazenar a 2-8°C. Usar dentro de 30 dias.",
      "Aplicar em jejum 30-60 min antes de dormir.",
    ],
    interactions: [
      { name: "CJC-1295", type: "synergic", description: "O stack mais popular: CJC-1295 eleva GH e Ipamorelin libera seletivamente sem cortisol/prolactina." },
      { name: "Sermorelin", type: "synergic", description: "Sermorelin (GHRH) + Ipamorelin (GHRP) = stack de GH semelhante ao CJC-1295/Ipamorelin." },
      { name: "GHRP-2 / GHRP-6", type: "monitor", description: "Não empilhar múltiplos GHRPs — não adição de benefício, pode aumentar efeitos colaterais." },
    ],
    stacks: [
      { name: "Stack GH Padrão Ouro", peptides: ["Ipamorelin", "CJC-1295 DAC"], goal: "GH ótimo sem efeitos colaterais", description: "O stack de GH mais seguro e eficaz: sem elevação de cortisol, prolactina ou cortisol." },
      { name: "Stack Anti-Aging GH", peptides: ["Ipamorelin", "Sermorelin"], goal: "Restauração de GH endógeno", description: "GH restaurado por dupla via fisiológica — indicado para longevidade e anti-aging." },
    ],
  },
  34: {
    peptideId: 34,
    alternativeNames: ["Lysine-Proline-Valine", "α-MSH C-terminal tripeptide"],
    classification: "Tripeptídeo anti-inflamatório",
    evidenceLevel: "Pré-clínico",
    halfLife: "~1-2 horas",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O KPV é um tripeptídeo (Lisina-Prolina-Valina) derivado da porção C-terminal do alfa-MSH. Sem propriedades de pigmentação, foca nas potentes capacidades anti-inflamatórias e antimicrobianas do hormônio original. É particularmente eficaz contra doenças inflamatórias intestinais, dermatites e infecções, com perfil de toxicidade quase nulo.",
    benefits: ["Redução potente da inflamação intestinal (Colite, Crohn)", "Melhora de psoríase, eczema e acne", "Acelera cicatrização e reduz cicatrizes", "Propriedades antimicrobianas naturais", "Reduz inchaço e edema tecidual"],
    mechanism: ["Inibição da ativação do NF-κB", "Bloqueio da produção de citocinas pró-inflamatórias", "Propriedades antimicrobianas contra S. aureus e Candida", "Modulação direta intracelular de vias inflamatórias"],
    mechanismDetailed: "O KPV atua principalmente inibindo a ativação do NF-kappaB, o complexo proteico que controla a transcrição de genes inflamatórios. Ele entra nas células e bloqueia a sinalização que leva à produção de citocinas pró-inflamatórias. Além disso, possui propriedades antimicrobianas diretas contra Staphylococcus aureus e Candida albicans.",
    timeline: [
      { period: "Dias 3-7", description: "Redução da inflamação intestinal e cutânea." },
      { period: "Semana 2-4", description: "Melhora dos sintomas GI e pele." },
      { period: "Mês 1-2", description: "Controle inflamatório consolidado." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "SC/Oral",
      phases: [
        { phase: "Dose Principal", dose: "500mcg", units: "1-2x/dia" },
        { phase: "Duração do Ciclo", dose: "4-8 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "500mcg", frequency: "1-2x/dia", duration: "4-8 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC/Oral.",
    ],
    interactions: [
      { name: "BPC-157", type: "synergic", description: "KPV + BPC = GI anti-inflamatório completo" },
      { name: "Semaglutide", type: "monitor", description: "KPV pode modular absorção de Semaglutide" },
    ],
    stacks: [
      { name: "Stack GI", peptides: ["KPV", "BPC-157"], goal: "Saúde intestinal", description: "Anti-inflamatório intestinal dual" },
    ],
  },
  37: {
    peptideId: 37,
    alternativeNames: ["Cathelicidin", "hCAP-18", "CAMP"],
    classification: "Peptídeo antimicrobiano catelicidina (37 aminoácidos)",
    evidenceLevel: "Pré-clínico",
    halfLife: "~2-4 horas",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O LL-37 é o único peptídeo antimicrobiano da família catelicidina em humanos. Produzido por glóbulos brancos e células epiteliais, atua como linha de frente do sistema imunológico inato contra bactérias, vírus e fungos. Além de matar patógenos diretamente ao romper membranas, é um potente imunomodulador que atrai células imunes e regula a resposta inflamatória.",
    benefits: ["Atividade antibacteriana de amplo espectro (incluindo resistentes)", "Ação antiviral e antifúngica potente", "Acelera cicatrização de feridas crônicas", "Modula e fortalece resposta imunológica inata", "Ajuda na reparação de tecidos infectados"],
    mechanism: ["Estrutura anfipática que perfura membranas de microrganismos", "Quimiotaxia — atrai células imunes para o local da infecção", "Neutralização de LPS bacteriano (prevenção de sepse)", "Promoção de angiogênese e reepitelização"],
    mechanismDetailed: "O LL-37 possui uma estrutura anfipática que permite inserção e perfuração de membranas de microrganismos carregados negativamente, levando à lise celular. Como imunomodulador, liga-se a receptores FPR2 para estimular migração celular e liberação de citocinas protetoras, além de neutralizar lipopolissacarídeo bacteriano para prevenir sepse.",
    timeline: [
      { period: "Dias 1-5", description: "Atividade antimicrobiana e redução da infecção local." },
      { period: "Semana 2-3", description: "Melhora da cicatrização e modulação imune." },
      { period: "Semana 4-6", description: "Função imune restaurada e lesões curadas." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "Tópico/SC",
      phases: [
        { phase: "Dose Principal", dose: "100mcg", units: "1-2x/dia" },
        { phase: "Duração do Ciclo", dose: "4-8 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "100mcg", frequency: "1-2x/dia", duration: "4-8 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: Tópico/SC.",
    ],
    interactions: [
      { name: "BPC-157", type: "synergic", description: "LL-37 antimicrobiano + BPC cicatrizante" },
      { name: "GHK-Cu", type: "synergic", description: "Colágeno + cicatrização premium" },
    ],
    stacks: [
      { name: "Stack Wound", peptides: ["LL-37", "BPC-157", "GHK-Cu"], goal: "Cicatrização e imunidade", description: "Antimicrobiano + reparo + colágeno" },
    ],
  },
  41: {
    peptideId: 41,
    alternativeNames: ["Mitochondrial Open Reading Frame of the 12S rRNA-c", "Exercício em Frasco"],
    classification: "Peptídeo derivado de mitocôndria (16 aminoácidos)",
    evidenceLevel: "Pré-clínico",
    halfLife: "~4-8 horas",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O MOTS-c é um peptídeo derivado da mitocôndria, chamado de 'exercício em frasco' por mimetizar os efeitos metabólicos da atividade física. É codificado pelo DNA mitocondrial (não nuclear) e atua como mensageiro entre mitocôndria e núcleo celular. Promove flexibilidade metabólica, permitindo alternância eficiente entre queima de glicose e gordura.",
    benefits: ["Aumenta sensibilidade à insulina e metabolismo da glicose", "Promove perda de peso e queima de gordura", "Aumenta resistência física e performance atlética", "Melhora função mitocondrial e biogênese", "Efeitos anti-envelhecimento sistêmicos"],
    mechanism: ["Ativação da via AMPK (sensor de energia celular)", "Aumento da captação de glicose nos músculos", "Aumento da oxidação de ácidos graxos", "Regulação do metabolismo do folato", "Síntese de novos transportadores de glicose (GLUT)"],
    mechanismDetailed: "O MOTS-c ativa a via da proteína quinase ativada por AMP (AMPK), o 'sensor de energia' da célula. Isso aumenta captação de glicose nos músculos e oxidação de ácidos graxos. Também regula metabolismo do folato e aumenta síntese de transportadores de glicose. Com o envelhecimento, os níveis naturais de MOTS-c diminuem, associados à resistência à insulina.",
    timeline: [
      { period: "Semana 1-2", description: "Aumento da sensibilidade à insulina e energia celular." },
      { period: "Semana 3-6", description: "Melhora da performance atlética e composição corporal." },
      { period: "Mês 2-3", description: "Efeitos anti-aging e metabólicos consolidados." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "5mg", units: "2x/sem" },
        { phase: "Duração do Ciclo", dose: "4-6 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "5mg", frequency: "2x/sem", duration: "4-6 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "NAD+", type: "synergic", description: "MOTS-C metabólico + NAD+ energético" },
      { name: "Metformina", type: "compatible", description: "Ativação de AMPK complementar" },
    ],
    stacks: [
      { name: "Stack Longev Metab", peptides: ["MOTS-C", "NAD+", "Epithalon"], goal: "Anti-aging metabólico", description: "Metabolismo + energia + telômeros" },
    ],
  },
  50: {
    peptideId: 50,
    alternativeNames: ["Bremelanotide", "Vyleesi"],
    classification: "Agonista de receptor de melanocortina",
    evidenceLevel: "Aprovado (FDA/EMA)",
    halfLife: "~2.7 horas",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O PT-141 (Bremelanotide) é um agonista não-seletivo de receptores de melanocortina aprovado pela FDA para o tratamento do Transtorno do Desejo Sexual Hipoativo (HSDD) em mulheres pré-menopausa. Diferentemente de inibidores de PDE5, atua diretamente no sistema nervoso central, estimulando o desejo sexual através de vias de neurotransmissão.",
    benefits: ["Aumento do desejo sexual em homens e mulheres", "Aprovado pela FDA para HSDD", "Ação central no SNC (não apenas vascular)", "Eficaz em casos refratários a PDE5i", "Melhora da excitação e satisfação sexual"],
    mechanism: ["Agonismo de receptores de melanocortina (MC4R principal)", "Ativação de vias de sinalização no hipotálamo", "Liberação de neuropeptídeos relacionados ao desejo", "Aumento do fluxo sanguíneo genital via mecanismos centrais"],
    mechanismDetailed: "O PT-141 ativa receptores de melanocortina, particularmente MC4R, no hipotálamo e tronco cerebral, modulando neurotransmissores como dopamina e oxitocina para aumentar desejo e excitação sexual. Aprovado pela FDA em 2019 como Vyleesi® na dose de 1.75 mg SC.",
    timeline: [
      { period: "Minutos 30-90", description: "Aumento do desejo sexual após administração." },
      { period: "Dias 1-3", description: "Engorgimento genital e excitação aprimorada." },
      { period: "Semana 1-2+", description: "Melhora consistente da função sexual." },
    ],

    protocol: {
      title: "Protocolo PT-141 (Bremelanotide)",
      route: "Subcutâneo (SC) ou intranasal",
      phases: [
        { phase: "Dose Inicial", dose: "500mcg-1mg SC", units: "1-2h antes da atividade sexual" },
        { phase: "Dose Padrão", dose: "1-2mg SC", units: "Conforme necessidade — máx. 1x/72h" },
      ],
    },
    dosageByIndication: [
      { indication: "Disfunção erétil / libido masculina", dose: "1-2mg", frequency: "Conforme necessidade", duration: "Máx. 1x/72h" },
      { indication: "Disfunção sexual feminina", dose: "500mcg-1mg", frequency: "Conforme necessidade", duration: "Máx. 1x/72h" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Concentração típica: 1mg/mL.",
      "Armazenar a 2-8°C. Usar dentro de 30 dias.",
      "Aplicar 1-2h antes da atividade sexual. Pode causar náusea inicial.",
    ],
    interactions: [
      { name: "Sildenafil (Viagra)", type: "synergic", description: "Ação central (PT-141) + ação periférica vascular (Sildenafil) = sinergía potente para DE." },
      { name: "Oxitocina", type: "synergic", description: "PT-141 aumenta desejo e Oxitocina aumenta vínculo emocional e intensidade." },
      { name: "Antidepressivos (ISRS)", type: "monitor", description: "ISRSs podem reduzir libido; PT-141 pode contrariar esse efeito — monitorar com médico." },
    ],
    stacks: [
      { name: "Stack Libido & Performance", peptides: ["PT-141", "Oxitocina"], goal: "Função sexual otimizada", description: "PT-141 (desejo) + Oxitocina (vínculo/intensidade) = experiência sexual completa." },
    ],
  },
  51: {
    peptideId: 51,
    alternativeNames: ["LY3437943", "Agonista triplo GIP/GLP-1/Glucagon"],
    classification: "Agonista triplo de receptores incretínicos",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~6 dias",
    reconstitutionDifficulty: "Moderada",
    whatIs: "Retatrutide é um agonista triplo dos receptores GIP, GLP-1 e glucagon, representando uma nova classe de peptídeos para o tratamento da obesidade e controle metabólico. Sua ação simultânea nos três receptores promove efeitos sinérgicos na perda de peso, controle glicêmico e metabolismo energético, superando os resultados observados com agonistas simples ou duplos.",
    benefits: ["Perda de peso significativa (até 24% em estudos clínicos)", "Melhora do controle glicêmico", "Redução da gordura hepática", "Melhora dos marcadores cardiovasculares", "Supressão do apetite e aumento da saciedade", "Potencial para tratamento de MAFLD (doença hepática gordurosa)"],
    mechanism: ["Ativação do receptor GLP-1: promove secreção de insulina e suprime glucagon de forma glicose-dependente", "Ativação do receptor GIP: potencializa a secreção de insulina e melhora a sensibilidade à insulina", "Ativação do receptor de Glucagon: aumenta o gasto energético e a oxidação de gordura", "Retardo do esvaziamento gástrico, contribuindo para saciedade", "Efeitos centrais na regulação do apetite"],
    mechanismDetailed: "Retatrutide é o primeiro agonista triplo dos receptores GIP, GLP-1 e glucagon em desenvolvimento clínico avançado. A ativação do GLP-1R promove secreção de insulina glicose-dependente, suprime glucagon e retarda o esvaziamento gástrico. A ativação do GIPR potencializa a secreção de insulina e melhora a sensibilidade periférica. A ativação do receptor de glucagon aumenta o gasto energético hepático e a oxidação de ácidos graxos, contribuindo para uma perda de peso superior à observada com agonist",
    timeline: [
      { period: "Semana 1-4", description: "Supressão do apetite e início da perda de peso." },
      { period: "Mês 2-3", description: "Perda de 10-15% do peso corporal." },
      { period: "Mês 4-6+", description: "Perda de até 24% com protocolo contínuo." },
    ],

    protocol: {
      title: "Protocolo Retatrutide",
      route: "Subcutâneo (SC) semanal",
      phases: [
        { phase: "Titulação", dose: "1-2mg/semana", units: "4 semanas — ajuste à tolerância" },
        { phase: "Manutenção", dose: "4-8mg/semana", units: "Dose alvo para perda de peso máxima" },
        { phase: "Sustentação", dose: "2-4mg/semana", units: "Dose de manutenção após objetivo atingido" },
      ],
    },
    dosageByIndication: [
      { indication: "Obesidade / sobrepeso severo", dose: "8mg", frequency: "1x/semana", duration: "24-52 semanas" },
      { indication: "Perda de peso moderada", dose: "4mg", frequency: "1x/semana", duration: "24 semanas" },
    ],
    reconstitution: [
      "Disponível em formulação pronta para injeção.",
      "Aplicar SC no abdômen, coxa ou braço — rotacionar locais.",
      "Refrigerar a 2-8°C. Nunca congelar.",
      "Titulação lenta é essencial para tolerabilidade GI.",
    ],
    interactions: [
      { name: "Metformina", type: "compatible", description: "Combinação segura e aditiva no controle glicêmico e perda de peso." },
      { name: "Tireoide (Levotiroxina)", type: "monitor", description: "Perda de peso altera absorção — monitorar e ajustar dose de T4." },
      { name: "Anticoagulantes orais", type: "monitor", description: "Velocidade de esvaziamento gástrico afeta absorção de outros medicamentos." },
    ],
    stacks: [
      { name: "Stack Metabólico Máximo", peptides: ["Retatrutide", "AOD-9604"], goal: "Perda de gordura máxima", description: "Triple agonista GLP-1/GIP/Glucagon + ação lipocito-seletiva do AOD = composição corporal premium." },
    ],
  },
  53: {
    peptideId: 53,
    alternativeNames: ["TP-7", "Selanc", "Análogo de Tuftsin"],
    classification: "Heptapeptídeo sintético (análogo de Tuftsin)",
    evidenceLevel: "Clínico Fase III",
    halfLife: "~5-10 minutos (intranasal; efeitos prolongados)",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Selank é um peptídeo ansiolítico sintético derivado do Tuftsin, aprovado na Rússia para uso clínico. Exerce efeitos ansiolíticos potentes sem sedação ou dependência, através da modulação do sistema GABAérgico e influência nos níveis de BDNF, serotonina e dopamina.",
    benefits: ["Redução da ansiedade sem sedação", "Melhora do humor e estabilidade emocional", "Efeitos nootrópicos (memória e aprendizado)", "Propriedades imunomoduladoras", "Sem potencial de dependência"],
    mechanism: ["Modulação alostérica de receptores GABA-A", "Aumento dos níveis de BDNF", "Regulação de serotonina, dopamina e norepinefrina", "Modulação da expressão gênica de encefalinas", "Propriedades imunomoduladoras via tuftsin"],
    mechanismDetailed: "O Selank modula alostericamente os receptores GABA-A de forma similar a benzodiazepínicos de baixa dose, mas sem sedação ou dependência. Aumenta BDNF, regulando neuroplasticidade. Sua porção tuftsin confere propriedades imunomoduladoras.",
    timeline: [
      { period: "Minutos 15-30", description: "Efeito ansiolítico agudo após dose intranasal." },
      { period: "Dias 1-7", description: "Redução progressiva da ansiedade e melhora do humor." },
      { period: "Semana 2-4+", description: "Estabilidade emocional e efeitos cognitivos consolidados." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "IN",
      phases: [
        { phase: "Dose Principal", dose: "300-900mcg", units: "1-3x/dia" },
        { phase: "Duração do Ciclo", dose: "Ciclos 4-8 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "300-900mcg", frequency: "1-3x/dia", duration: "Ciclos 4-8 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: IN.",
    ],
    interactions: [
      { name: "PE-22-28", type: "synergic", description: "Selank + PE-22-28 = ansiedade + depressão" },
      { name: "Oxitocina", type: "compatible", description: "Estabilidade emocional + comportamento social" },
    ],
    stacks: [
      { name: "Stack Mental", peptides: ["Selank", "PE-22-28"], goal: "Saúde mental", description: "Ansiolítico + antidepressivo rápido" },
    ],
  },
  54: {
    peptideId: 54,
    alternativeNames: ["Ozempic", "Wegovy", "Rybelsus", "GLP-1 RA"],
    classification: "Agonista do receptor GLP-1 (análogo de GLP-1)",
    evidenceLevel: "Aprovado (FDA/EMA)",
    halfLife: "~7 dias",
    reconstitutionDifficulty: "Fácil",
    whatIs: "",
    benefits: ["Redução significativa do peso corporal", "Melhora do controle glicêmico em pacientes com diabetes tipo 2", "Diminuição do risco de eventos cardiovasculares adversos maiores em pacientes com diabetes tipo 2 e doença cardiovascular estabelecida", "Supressão do apetite e aumento da saciedade", "Conveniência de dosagem semanal"],
    mechanism: ["Ativação do receptor de GLP-1, resultando em aumento da secreção de insulina dependente de glicose", "Supressão da secreção de glucagon de forma dependente de glicose", "Retardo do esvaziamento gástrico, contribuindo para a saciedade", "Efeitos diretos no sistema nervoso central, reduzindo o apetite e a ingestão alimentar"],
    mechanismDetailed: "O Semaglutide é um análogo do GLP-1 com 94% de homologia ao GLP-1 humano, modificado com uma cadeia lateral de ácido graxo C18 que se liga à albumina sérica, prolongando sua meia-vida para aproximadamente 7 dias. Ele ativa o receptor GLP-1 (GLP-1R) nas células beta pancreáticas, estimulando a secreção de insulina de forma glicose-dependente e suprimindo a secreção de glucagon. No sistema nervoso central, atua nos núcleos hipotalâmicos e no tronco cerebral para reduzir o apetite e a ingestão alim",
    timeline: [
      { period: "Semana 1-4", description: "Redução do apetite e início da perda de peso." },
      { period: "Mês 2-3", description: "Perda de 5-10% do peso corporal." },
      { period: "Mês 4-12", description: "Perda sustentada de 15-20% com protocolo completo." },
    ],

    protocol: {
      title: "Protocolo Semaglutide",
      route: "Subcutâneo (SC) semanal",
      phases: [
        { phase: "Titulação (Sem 1-4)", dose: "0.25mg/semana", units: "4 semanas de adaptação" },
        { phase: "Dose Terapêutica (Sem 5-16)", dose: "0.5-1mg/semana", units: "Dose padrão de manutenção" },
        { phase: "Dose Máxima (Opcional)", dose: "2mg/semana", units: "Para resposta máxima" },
      ],
    },
    dosageByIndication: [
      { indication: "Perda de peso", dose: "1-2mg", frequency: "1x/semana", duration: "52+ semanas" },
      { indication: "Diabetes tipo 2", dose: "0.5-1mg", frequency: "1x/semana", duration: "Uso contínuo" },
    ],
    reconstitution: [
      "Disponível em caneta injetora pré-carregada (Ozempic/Wegovy) ou pó.",
      "Para pó: reconstituir com 1mL de água bacteriostática.",
      "Refrigerar a 2-8°C. Após abertura: até 56 dias em temperatura ambiente.",
      "Titulação lenta é fundamental para tolerabilidade GI.",
    ],
    interactions: [
      { name: "AOD-9604", type: "synergic", description: "Semaglutide reduz apetite + AOD-9604 queima gordura localmente = stack de composição corporal." },
      { name: "Metformina", type: "synergic", description: "Combinação aprovada e sinérgica para DM2 e perda de peso." },
      { name: "Anticoagulantes", type: "monitor", description: "Semaglutide muda velocidade gástrica — ajustar dose de anticoagulantes se necessário." },
      { name: "Insulina", type: "monitor", description: "Risco de hipoglicemia aumentado — reduzir insulina ao iniciar semaglutide." },
    ],
    stacks: [
      { name: "Stack GLP-1 + Body Comp", peptides: ["Semaglutide", "AOD-9604", "Ipamorelin"], goal: "Perda de gordura + preservação muscular", description: "GLP-1 (apetite) + lipólise direta (AOD) + GH seletivo (Ipamorelin) = recomposição corporal premium." },
    ],
  },
  56: {
    peptideId: 56,
    alternativeNames: ["MEHFPGP", "Análogo ACTH(4-10)"],
    classification: "Heptapeptídeo sintético (análogo de ACTH 4-10)",
    evidenceLevel: "Clínico Fase III",
    halfLife: "~3-5 minutos (intranasal; efeitos 20-24h)",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Semax é um neuropeptídeo sintético derivado do fragmento ACTH(4-10) com potentes propriedades nootrópicas e neuroprotetoras. Aprovado na Rússia, melhora cognição, memória e aprendizado sem elevar cortisol. Atua aumentando BDNF e modulando neurotransmissores.",
    benefits: ["Melhora da memória e velocidade de processamento", "Neuroproteção contra danos isquêmicos", "Aumento do BDNF cerebral", "Melhora do foco e atenção", "Sem efeitos hormonais (não eleva cortisol)"],
    mechanism: ["Aumento da expressão de BDNF", "Modulação dopaminérgica e serotoninérgica", "Proteção contra excitotoxicidade", "Melhora da microcirculação cerebral", "Regulação da expressão gênica neuronal"],
    mechanismDetailed: "O Semax retém propriedades neurotrópicas do ACTH sem efeitos endócrinos. Aumenta BDNF, promove neuroplasticidade e modula sistemas dopaminérgico e serotoninérgico. Doses intranasais de 0.25-1.0 mg produzem efeitos nootrópicos sustentados por 20-24h.",
    timeline: [
      { period: "Minutos 15-30", description: "Aumento imediato do foco após dose intranasal." },
      { period: "Dias 1-7", description: "Melhora progressiva de memória e processamento." },
      { period: "Semana 2-4+", description: "Neuroproteção e ganhos cognitivos consolidados." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "IN",
      phases: [
        { phase: "Dose Principal", dose: "200-900mcg", units: "1-2x/dia" },
        { phase: "Duração do Ciclo", dose: "Ciclos 4-8 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "200-900mcg", frequency: "1-2x/dia", duration: "Ciclos 4-8 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: IN.",
    ],
    interactions: [
      { name: "P21", type: "synergic", description: "Semax + P21 = neurogênese + nootrópico" },
      { name: "Selank", type: "synergic", description: "Cognição + estabilidade mental" },
    ],
    stacks: [
      { name: "Stack Brain", peptides: ["Semax", "P21", "NAD+"], goal: "Nootrópico completo", description: "Nootrópico + neurogênese + energia cerebral" },
    ],
  },
  60: {
    peptideId: 60,
    alternativeNames: ["Elamipretide", "Bendavia", "MTP-131"],
    classification: "Tetrapeptídeo mitocondrial",
    evidenceLevel: "Clínico Fase III",
    halfLife: "~4-6 horas",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O SS-31 (Elamipretide) é um peptídeo inovador que tem como alvo direto as mitocôndrias. Diferente de antioxidantes comuns, atua na fonte otimizando a eficiência mitocondrial e prevenindo produção excessiva de danos oxidativos. Eficaz em tecidos com alta demanda energética (coração, cérebro, rins), representa um dos bioenergéticos mais potentes para longevidade.",
    benefits: ["Melhora significativa da função e energia mitocondrial", "Proteção potente do coração e rins contra danos oxidativos", "Aumento da resistência física e recuperação muscular", "Efeitos neuroprotetores e melhora da clareza mental", "Redução da inflamação de origem mitocondrial"],
    mechanism: ["Ligação seletiva à cardiolipina mitocondrial", "Otimização da cadeia de transporte de elétrons", "Redução do vazamento de elétrons (radicais livres)", "Aumento da produção de ATP", "Manutenção da estrutura física mitocondrial"],
    mechanismDetailed: "O SS-31 liga-se seletivamente à cardiolipina, um fosfolipídio único da membrana mitocondrial interna. Ao estabilizar a cardiolipina, otimiza a cadeia de transporte de elétrons, reduz vazamento de elétrons e aumenta eficiência na produção de ATP. Também ajuda a manter a estrutura física das cristas mitocondriais.",
    timeline: [
      { period: "Semana 1-2", description: "Início da mobilização de gordura visceral e subcutânea." },
      { period: "Semana 3-6", description: "Redução perceptível de gordura corporal sem retenção hídrica." },
      { period: "Mês 2-3", description: "Mudança na composição corporal consolidada e metabolismo acelerado." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "500mcg", units: "1x/dia jejum" },
        { phase: "Duração do Ciclo", dose: "12 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "500mcg", frequency: "1x/dia jejum", duration: "12 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "AOD-9604", type: "compatible", description: "Ambos queimam gordura sem GH sistêmico" },
      { name: "Ipamorelin", type: "compatible", description: "GH seletivo preserva massa sem adipogênese" },
    ],
    stacks: [
      { name: "Stack Lipólise", peptides: ["HGH Frag 176-191", "AOD-9604"], goal: "Lipólise pura", description: "Queima de gordura específica sem dose plena de GH" },
    ],
  },
  61: {
    peptideId: 61,
    alternativeNames: ["BI 456906", "Agonista dual GLP-1/Glucagon"],
    classification: "Agonista dual de receptores GLP-1/GCGR",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~5-7 dias",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O Survodutide é um peptídeo agonista dual de próxima geração que atua nos receptores de GLP-1 (peptídeo-1 semelhante ao glucagon) e GCGR (receptor de glucagon), projetado para modular vias metabólicas cruciais. Este mecanismo de ação combinado visa promover a perda de peso e melhorar a saúde metabólica, sendo desenvolvido para o tratamento de obesidade e doenças hepáticas gordurosas não alcoólicas (NAFLD/NASH).",
    benefits: ["Promove perda de peso significativa e sustentada.", "Melhora o controle glicêmico em pacientes com diabetes tipo 2.", "Reduz a esteatose hepática e a inflamação em NAFLD/NASH.", "Potencial para reverter a fibrose hepática em NASH.", "Melhora parâmetros metabólicos como colesterol e triglicerídeos."],
    mechanism: ["Agonismo do receptor do peptídeo-1 semelhante ao glucagon (GLP-1R), aumentando a secreção de insulina dependente de glicose e suprimindo o glucagon.", "Agonismo do receptor do glucagon (GCGR), promovendo a lipólise e a oxidação de ácidos graxos no fígado.", "Ação sinérgica GLP-1/GCGR para otimizar a perda de peso e melhorar a sensibilidade à insulina.", "Redução do apetite e aumento da saciedade via GLP-1R no sistema nervoso central.", "Modulação do metabolismo lipídico e hepático através da ativação do GCGR."],
    mechanismDetailed: "O Survodutide é um agonista dual que combina a ativação do receptor GLP-1 e do receptor de glucagon em uma única molécula peptídica. A ativação do GLP-1R promove secreção de insulina glicose-dependente, suprime glucagon pós-prandial, retarda o esvaziamento gástrico e reduz o apetite via SNC. A ativação do GCGR estimula a lipólise hepática, aumenta a oxidação de ácidos graxos e o gasto energético, e reduz a esteatose hepática. A combinação desses dois mecanismos resulta em perda de peso superior ",
    timeline: [
      { period: "Semana 1-4", description: "Redução do apetite e início da perda de peso." },
      { period: "Mês 2-3", description: "Perda de peso progressiva e melhora dos lipídeos hepáticos." },
      { period: "Mês 4-6", description: "Perda de peso consolidada e reversão da esteatose hepática." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1-6mg", units: "1x/sem" },
        { phase: "Duração do Ciclo", dose: "24 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1-6mg", frequency: "1x/sem", duration: "24 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Semaglutide", type: "compatible", description: "GLP-1 + Glucagon = perda de peso + fígado" },
      { name: "AOD-9604", type: "synergic", description: "Lipólise direta complementar ao Survodutide" },
    ],
    stacks: [
      { name: "Stack Liver Fat", peptides: ["Survodutide", "AOD-9604"], goal: "MASLD/NAFLD + peso", description: "GLP-1/Glucagon + lipólise para fígado e peso" },
    ],
  },
  62: {
    peptideId: 62,
    alternativeNames: ["Thymosin Beta-4", "Tβ4", "Ac-LKKTETQ"],
    classification: "Peptídeo de 43 aminoácidos (fragmento ativo: 7 aa)",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~2-3 horas",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O TB-500 é um peptídeo sintético derivado da Timosina Beta-4 (Tβ4), uma proteína presente em quase todas as células humanas. Reproduz o domínio ativo de ligação à actina, promovendo migração celular, angiogênese, redução da inflamação e aceleração da cicatrização. Sua ação é sistêmica — não precisa ser aplicado localmente.",
    benefits: ["Cicatrização acelerada de feridas e lesões", "Redução da inflamação", "Angiogênese (novos vasos sanguíneos)", "Melhora da flexibilidade e mobilidade", "Recuperação muscular e tendínea"],
    mechanism: ["Regulação da actina e motilidade celular", "Promoção de migração celular e angiogênese", "Redução da inflamação via modulação de citocinas", "Regulação de metaloproteinases (MMPs)", "Ação sistêmica"],
    mechanismDetailed: "O TB-500 reproduz o domínio de ligação à actina da Tβ4, regulando polimerização de actina e promovendo migração celular. Estimula angiogênese e reduz inflamação. Estudos demonstraram aumento de 42-61% na re-epitelização de feridas.",
    timeline: [
      { period: "Dias 3-7", description: "Redução da inflamação e início da cicatrização." },
      { period: "Semana 2-4", description: "Melhora perceptível da flexibilidade e lesões." },
      { period: "Mês 1-2", description: "Recuperação funcional completa e cicatrização consolidada." },
    ],

    protocol: {
      title: "Protocolo TB-500 (Thymosin Beta-4)",
      route: "Subcutâneo (SC) ou intramuscular (IM)",
      phases: [
        { phase: "Fase Aguda (Lesão)", dose: "5-10mg/semana", units: "2 injeções semanais por 4-6 semanas" },
        { phase: "Manutenção", dose: "2.5-5mg/semana", units: "1-2x/semana por 4-6 semanas" },
      ],
    },
    dosageByIndication: [
      { indication: "Lesão aguda muscular/tendinosa", dose: "5mg", frequency: "2x/semana", duration: "4-6 semanas" },
      { indication: "Recuperação pós-cirurgia", dose: "2.5mg", frequency: "2x/semana", duration: "8 semanas" },
      { indication: "Anti-aging preventivo", dose: "2mg", frequency: "1x/semana", duration: "Ciclos de 12 semanas" },
    ],
    reconstitution: [
      "Reconstituir 5mg com 2mL de água bacteriostática.",
      "Agitar suavemente. Não sacudir vigorosamente.",
      "Armazenar a 2-8°C. Usar dentro de 30 dias.",
      "Aplicar SC ou IM. SC no abdômen para absorção mais uniforme.",
    ],
    interactions: [
      { name: "BPC-157", type: "synergic", description: "O stack mais famoso de recuperação: BPC-157 (local/GI) + TB-500 (sistêmico) = recuperação completa." },
      { name: "GHK-Cu", type: "synergic", description: "TB-500 acelera cicatrização e GHK-Cu melhora qualidade do colágeno resultante." },
      { name: "MGF", type: "synergic", description: "TB-500 (tecido geral) + MGF (músculo específico) = recuperação muscular máxima." },
    ],
    stacks: [
      { name: "Stack Recovery Pro", peptides: ["TB-500", "BPC-157", "GHK-Cu"], goal: "Recuperação máxima de lesões", description: "O stack de recuperação mais completo disponível — combina reparo sistêmico, local e de colágeno." },
    ],
  },
  63: {
    peptideId: 63,
    alternativeNames: ["Egrifta", "TH9507", "Trans-3-hexenoic acid GHRH(1-44)"],
    classification: "Análogo sintético de GHRH (44 aminoácidos + ácido hexenóico)",
    evidenceLevel: "Aprovado (FDA/EMA)",
    halfLife: "~26-38 minutos",
    reconstitutionDifficulty: "Moderada",
    whatIs: "A Tesamorelina é um análogo de GHRH aprovado pelo FDA para lipodistrofia em HIV. Estimula liberação pulsátil e fisiológica de GH pela hipófise, com eficácia inigualável na redução de gordura visceral. A adição do ácido hexenóico aumenta estabilidade e resistência à degradação enzimática.",
    benefits: ["Redução drástica da gordura abdominal visceral", "Aumento dos níveis naturais de GH e IGF-1", "Melhora do perfil lipídico", "Melhora da cognição em idosos", "Não causa aumento significativo da fome"],
    mechanism: ["Ligação aos receptores de GHRH na hipófise anterior", "Estímulo à síntese e liberação pulsátil de GH", "GH atua no fígado para produzir IGF-1", "Ação direta nos adipócitos para lipólise visceral"],
    mechanismDetailed: "A Tesamorelina liga-se aos receptores de GHRH na hipófise anterior, estimulando síntese e liberação pulsátil de GH. O GH atua no fígado para produzir IGF-1 e diretamente nos adipócitos para estimular lipólise, com afinidade particular pelo tecido adiposo visceral. Diferente dos GHRPs, não estimula significativamente o apetite.",
    timeline: [
      { period: "Semana 1-4", description: "Aumento de GH e IGF-1 e início da lipólise visceral." },
      { period: "Mês 2-3", description: "Redução significativa da gordura abdominal visceral." },
      { period: "Mês 4-6", description: "Melhora da cognição e composição corporal consolidadas." },
    ],

    protocol: {
      title: "Protocolo Tesamorelin",
      route: "Subcutâneo (SC)",
      phases: [
        { phase: "Diário", dose: "2mg/dia SC", units: "1 injeção diária em jejum (aprovado FDA)" },
        { phase: "Off-Label", dose: "1-2mg/dia", units: "Ciclos de 12-24 semanas" },
      ],
    },
    dosageByIndication: [
      { indication: "Lipodistrofia (aprovado FDA)", dose: "2mg/dia", frequency: "1x/dia", duration: "26 semanas" },
      { indication: "Cognição e anti-aging", dose: "1-2mg/dia", frequency: "1x/dia", duration: "12-24 semanas" },
    ],
    reconstitution: [
      "Reconstituir 2mg com 2.2mL de água estéril (fornecida).",
      "Injetar o diluente na lateral do vial — não diretamente no pó.",
      "Rodar gentilmente. NÃO agitar.",
      "Usar imediatamente após reconstituição. Não armazenar reconstituído.",
    ],
    interactions: [
      { name: "Ipamorelin", type: "synergic", description: "Stack de GH: Tesamorelin (GHRH analóg) + Ipamorelin (GHRP seletivo) = liberação sinérgica." },
      { name: "Corticosteroides", type: "monitor", description: "Corticosteroides podem reduzir eficácia de Tesamorelin — monitorar resposta." },
      { name: "Insulina", type: "monitor", description: "Tesamorelin aumenta GH/IGF-1 — ajustar dose de insulina se diabético." },
    ],
    stacks: [
      { name: "Stack Tesamorelin + Ipamorelin", peptides: ["Tesamorelin", "Ipamorelin"], goal: "GH e composição corporal", description: "Combinação premium de GHRH + GHRP para liberação máxima de GH sem efeitos colaterais indesejados." },
    ],
  },
  65: {
    peptideId: 65,
    alternativeNames: ["Tα1", "Thymalfasin", "Zadaxin"],
    classification: "Peptídeo imunomodulador (28 aminoácidos)",
    evidenceLevel: "Aprovado (FDA/EMA)",
    halfLife: "~2 horas",
    reconstitutionDifficulty: "Fácil",
    whatIs: "A Timosina Alfa-1 é um peptídeo imunomodulador de 28 aminoácidos originalmente isolado do timo. Aprovada em vários países como Zadaxin® para hepatite B crônica e como adjuvante em imunodeficiências. Estimula células T, ativa células NK e dendríticas, e modula a resposta imune.",
    benefits: ["Fortalecimento da resposta imune", "Atividade antiviral", "Maturação de células T e ativação de NK", "Adjuvante em vacinas e imunoterapia", "Modulação da inflamação crônica"],
    mechanism: ["Estimulação da maturação de células T via TLR9", "Ativação de células dendríticas", "Aumento da atividade citotóxica de NK", "Modulação de citocinas (IL-2, IFN-γ, IL-12)", "Ação anti-inflamatória"],
    mechanismDetailed: "A Tα1 ativa receptores Toll-like (TLR2, TLR9) em células dendríticas, promovendo maturação e apresentação de antígenos. Estimula diferenciação de células T e produção de citocinas Th1. Aprovada em 30+ países como Zadaxin®.",
    timeline: [
      { period: "Semana 1-2", description: "Ativação de células dendríticas e células T." },
      { period: "Semana 3-6", description: "Melhora da resposta imune e atividade antiviral." },
      { period: "Mês 2-3", description: "Imunidade fortalecida e modulação da inflamação consolidadas." },
    ],

    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1.6mg", units: "3x/sem" },
        { phase: "Duração do Ciclo", dose: "4-12 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1.6mg", frequency: "3x/sem", duration: "4-12 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Livagen", type: "synergic", description: "Thymosin + Livagen = imunidade dual" },
      { name: "Selank", type: "synergic", description: "Reduz estresse que suprime imunidade" },
    ],
    stacks: [
      { name: "Stack Imune", peptides: ["Thymosin Alpha-1", "Livagen"], goal: "Imunidade reforçada", description: "Células T + imunidade inata + estresse reduzido" },
    ],
  },
  66: {
    peptideId: 66,
    alternativeNames: ["Mounjaro", "Zepbound", "LY3298176", "Agonista dual GIP/GLP-1"],
    classification: "Agonista dual de receptores GIP/GLP-1",
    evidenceLevel: "Aprovado (FDA/EMA)",
    halfLife: "~5 dias",
    reconstitutionDifficulty: "Fácil",
    whatIs: "",
    benefits: ["Redução significativa do peso corporal em pacientes com sobrepeso ou obesidade.", "Melhoria do controle glicêmico em pacientes com diabetes tipo 2.", "Diminuição da hemoglobina glicada (HbA1c).", "Potencial para redução do risco cardiovascular.", "Efeitos benéficos na pressão arterial e perfil lipídico."],
    mechanism: ["Ativação dos receptores do peptídeo insulinotrópico dependente de glicose (GIP).", "Ativação dos receptores do peptídeo semelhante ao glucagon 1 (GLP-1).", "Aumento da secreção de insulina dependente de glicose.", "Supressão da secreção de glucagon.", "Retardo do esvaziamento gástrico e aumento da saciedade."],
    mechanismDetailed: "",
    timeline: [
      { period: "Semana 1-4", description: "Redução do apetite e início da perda de peso." },
      { period: "Mês 2-3", description: "Perda de 10-15% do peso corporal." },
      { period: "Mês 4-12", description: "Perda de até 22% com protocolo completo." },
    ],

    protocol: {
      title: "Protocolo Tirzepatide",
      route: "Subcutâneo (SC) semanal",
      phases: [
        { phase: "Titulação (Sem 1-4)", dose: "2.5mg/semana", units: "Período de adaptação GI" },
        { phase: "Dose Terapêutica", dose: "5-10mg/semana", units: "Dose de manutenção" },
        { phase: "Dose Máxima", dose: "15mg/semana", units: "Para perda de peso máxima" },
      ],
    },
    dosageByIndication: [
      { indication: "Perda de peso", dose: "10-15mg", frequency: "1x/semana", duration: "52+ semanas" },
      { indication: "Diabetes tipo 2", dose: "5-10mg", frequency: "1x/semana", duration: "Uso contínuo" },
    ],
    reconstitution: [
      "Disponível em caneta injetora pré-carregada (Mounjaro/Zepbound).",
      "Aplicar SC no abdômen, coxa ou braço — rotacionar locais.",
      "Refrigerar a 2-8°C. Após abertura: up to 21 dias em temperatura ambiente.",
      "Titulação lenta é essencial — 4 semanas em cada dose.",
    ],
    interactions: [
      { name: "Metformina", type: "synergic", description: "Combinação segura e sinérgica para DM2 — redução superior da A1C." },
      { name: "Insulina", type: "monitor", description: "Alto risco de hipoglicemia — reduzir insulina ao iniciar tirzepatide." },
      { name: "AOD-9604", type: "synergic", description: "Tirzepatide (apetite/insulina) + AOD-9604 (lipólise) = composição corporal otimizada." },
    ],
    stacks: [
      { name: "Stack Metabólico Premium", peptides: ["Tirzepatide", "AOD-9604"], goal: "Composição corporal e metabolismo", description: "GIP/GLP-1 dual + lipólise direta = o stack de perda de gordura mais eficaz disponível." },
    ],
  },
  11: {
    peptideId: 11,
    alternativeNames: ["FPF-1070", "Cerebrolysina", "Cerebrolisin"],
    classification: "Mistura peptídica neurotrófica (derivada de suínos)",
    evidenceLevel: "Clínico Fase III",
    halfLife: "~6-8 horas (IM); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "A Cerebrolysin é uma mistura peptídica biotecnológica de neuropeptídeos de baixo peso molecular derivados de proteínas cerebrais purificadas de suínos. É um dos tratamentos mais validados em neurologia, com décadas de estudos clínicos para AVC isquêmico, demência vascular, Alzheimer e lesões cerebrais traumáticas. Mimetiza os efeitos de fatores neurotróficos endógenos como BDNF, GDNF e NGF.",
    benefits: ["Regeneração neuronal após AVC e trauma craniano", "Melhora de memória e função executiva", "Neuroproteção contra declínio cognitivo", "Melhora do humor e qualidade de vida", "Estimula crescimento de novos neurônios"],
    mechanism: ["Mimetiza BDNF, GDNF, CNTF e NGF endógenos", "Proteção contra excitotoxicidade do glutamato", "Inibição da formação de placas amiloides", "Estimulação de neuroplasticidade e sinaptogênese"],
    mechanismDetailed: "A Cerebrolysin exerce ação multimodal: protege neurônios contra excitotoxicidade e estresse oxidativo; estimula neuroplasticidade; melhora metabolismo energético cerebral; e inibe formação de agregados amiloides. Seus neuropeptídeos penetram a barreira hematoencefálica e mimetizam fatores neurotróficos essenciais para sobrevivência e crescimento neuronal.",
    timeline: [
      { period: "Dias 1-7", description: "Melhora progressiva na clareza mental e humor." },
      { period: "Semana 2-4", description: "Melhora perceptível na memória de trabalho e capacidade de concentração." },
      { period: "Mês 2-3", description: "Consolidação dos ganhos cognitivos e neuroproteção a longo prazo." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "2mg", units: "1x/sem" },
        { phase: "Duração do Ciclo", dose: "12 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "2mg", frequency: "1x/sem", duration: "12 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "BPC-157", type: "compatible", description: "Reparo tecidual complementar ao Chonluten" },
      { name: "Epithalon", type: "compatible", description: "Anti-aging sistêmico com Chonluten" },
    ],
    stacks: [
      { name: "Stack Longev", peptides: ["Chonluten", "Epithalon"], goal: "Pulmão e anti-aging", description: "Biorregulador pulmonar + longevidade sistêmica" },
    ],
  },
  13: {
    peptideId: 13,
    alternativeNames: ["Ala-Glu-Asp-Leu", "AEDL", "Peptídeo biorregulador brônquico"],
    classification: "Tetrapeptídeo biorregulador sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "Curta (minutos); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Chonluten é um tetrapeptídeo biorregulador sintético desenvolvido pelo Instituto de Gerontologia de São Petersburgo. Atua como citomédino específico para a mucosa brônquica e tecido pulmonar, modulando a expressão gênica das células epiteliais respiratórias e promovendo regeneração do epitélio brônquico.",
    benefits: ["Regeneração do epitélio brônquico", "Melhora da função pulmonar", "Propriedades anti-inflamatórias respiratórias", "Proteção contra danos oxidativos pulmonares", "Biorregulação das células epiteliais respiratórias"],
    mechanism: ["Modulação epigenética de genes pulmonares", "Estimulação da síntese de surfactante", "Redução da inflamação brônquica", "Promoção da regeneração celular epitelial"],
    mechanismDetailed: "O Chonluten atua como citomédino no epitélio brônquico, modulando a transcrição de genes responsáveis pela integridade e função das células respiratórias. Estimula a síntese de proteínas de surfactante e reduz a produção de citocinas inflamatórias, promovendo um ambiente regenerativo no tecido pulmonar.",
    timeline: [
      { period: "Semana 1-2", description: "Redução inicial da inflamação brônquica." },
      { period: "Semana 3-6", description: "Melhora da função respiratória e capacidade pulmonar." },
      { period: "Mês 2-3", description: "Regeneração epitelial consolidada e redução de episódios inflamatórios." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "0.5-1mg", units: "Diária 10 dias" },
        { phase: "Duração do Ciclo", dose: "1-2x/ano", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "0.5-1mg", frequency: "Diária 10 dias", duration: "1-2x/ano" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Epithalon", type: "synergic", description: "Coração + longevidade sistêmica Khavinson" },
      { name: "Cardiogen", type: "synergic", description: "Dupla proteção cardíaca biorreguladora" },
    ],
    stacks: [
      { name: "Stack Card Longev", peptides: ["Cortagen", "Epithalon"], goal: "Saúde cardíaca anti-aging", description: "Biorregulador cardíaco + longevidade" },
    ],
  },
  16: {
    peptideId: 16,
    alternativeNames: ["Ala-Glu-Asp-Pro", "AEDP", "Citomédino cortical"],
    classification: "Tetrapeptídeo biorregulador sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "Curta (minutos); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Cortagen é um tetrapeptídeo biorregulador sintético específico para o córtex cerebral. Desenvolvido pelo Prof. Vladimir Khavinson, atua como citomédino para neurônios corticais, modulando a expressão gênica de proteínas envolvidas na plasticidade sináptica, neuroproteção e função cognitiva.",
    benefits: ["Melhora da função cortical e cognição", "Neuroproteção do córtex cerebral", "Melhora da memória e aprendizado", "Suporte na recuperação de lesões cerebrais", "Redução do declínio cognitivo com o envelhecimento"],
    mechanism: ["Modulação epigenética em neurônios corticais", "Estimulação de proteínas de plasticidade sináptica", "Redução da neuroinflamação cortical", "Proteção contra apoptose neuronal"],
    mechanismDetailed: "O Cortagen, como biorregulador peptídico, interage com o DNA de neurônios corticais em regiões promotoras específicas, modulando a transcrição de genes relacionados à função neural. Estimula a produção de proteínas essenciais para a plasticidade sináptica e neuroproteção, contribuindo para a manutenção e melhora das funções cognitivas superiores.",
    timeline: [
      { period: "Semana 1-2", description: "Melhora sutil na clareza mental e foco." },
      { period: "Semana 3-6", description: "Ganhos perceptíveis de memória e velocidade de processamento." },
      { period: "Mês 2-3", description: "Neuroproteção consolidada e melhora cognitiva sustentada." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1mg", units: "Diária 10 dias" },
        { phase: "Duração do Ciclo", dose: "1-2x/ano", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1mg", frequency: "Diária 10 dias", duration: "1-2x/ano" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Epithalon", type: "synergic", description: "Pâncreas + longevidade sistêmica" },
      { name: "Livagen", type: "compatible", description: "Modulação imune complementar" },
    ],
    stacks: [
      { name: "Stack Metab", peptides: ["Crystagen", "Livagen", "Epithalon"], goal: "Pâncreas e imunidade", description: "Biorregulador pancreático + anti-aging" },
    ],
  },
  17: {
    peptideId: 17,
    alternativeNames: ["Ala-Glu-Asp-Lys", "AEDK", "Biorregulador tímico"],
    classification: "Tetrapeptídeo biorregulador sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "Curta (minutos); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Crystagen é um tetrapeptídeo biorregulador sintético específico para células do timo e o sistema imunológico. Desenvolvido pelo Prof. Khavinson, estimula a função e maturação das células T, modulando a resposta imune adaptativa. É usado como imunomodulador em estados de imunodeficiência e envelhecimento imunológico (imunosenescência).",
    benefits: ["Fortalecimento do sistema imunológico adaptativo", "Estimulação da maturação de células T", "Redução da imunosenescência", "Melhora da resposta a infecções", "Suporte em estados de imunodeficiência"],
    mechanism: ["Modulação epigenética em timócitos e células T", "Estimulação da diferenciação de células T", "Regulação de citocinas imunes (IL-2, IFN-γ)", "Restauração da função tímica"],
    mechanismDetailed: "O Crystagen atua como citomédino específico para o timo, modulando a transcrição de genes em timócitos e células T maduras. Estimula a produção de fatores de maturação tímica e a diferenciação de subpopulações de células T, revertendo parcialmente a involução tímica associada ao envelhecimento.",
    timeline: [
      { period: "Semana 1-2", description: "Ativação inicial da resposta imune." },
      { period: "Semana 3-6", description: "Melhora da resposta a infecções e bem-estar geral." },
      { period: "Mês 2-3", description: "Fortalecimento sustentado da imunidade adaptativa." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC/IN",
      phases: [
        { phase: "Dose Principal", dose: "100-200mcg", units: "1-2x/dia" },
        { phase: "Duração do Ciclo", dose: "4-8 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "100-200mcg", frequency: "1-2x/dia", duration: "4-8 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC/IN.",
    ],
    interactions: [
      { name: "Semax", type: "synergic", description: "DSIP sono + Semax nooroproteção" },
      { name: "Epithalon", type: "synergic", description: "Anti-aging + regulação sono completa" },
    ],
    stacks: [
      { name: "Stack Sono", peptides: ["DSIP", "Semax", "Epithalon"], goal: "Sono e neuroproteção", description: "Indução de sono + nootrópico + anti-aging" },
    ],
  },
  19: {
    peptideId: 19,
    alternativeNames: ["Delta Sleep-Inducing Peptide", "DSIP", "Nanopeptídeo do sono"],
    classification: "Nonapeptídeo endógeno modulador do sono",
    evidenceLevel: "Pré-clínico",
    halfLife: "~20-30 minutos",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O DSIP (Delta Sleep-Inducing Peptide) é um nonapeptídeo endógeno primeiramente isolado do tálamo de coelhos em sono delta. Modula o ciclo circadiano, induz o sono delta profundo e exerce efeitos neuroendócrinos regulando a liberação de GH, LH e ACTH. É um regulador natural do sono pesquisado para insônia, jet lag e distúrbios do ciclo circadiano.",
    benefits: ["Indução do sono delta profundo e restaurador", "Regulação do ciclo circadiano", "Redução do estresse e ansiedade", "Melhora da secreção de GH durante o sono", "Propriedades antioxidantes e neuroprotetoras"],
    mechanism: ["Ativação de receptores opioides e modulação GABAérgica", "Regulação do eixo hipotalâmico-hipofisário", "Indução de ondas delta no EEG", "Modulação da liberação de GH, LH e ACTH"],
    mechanismDetailed: "O DSIP atua em múltiplos receptores no sistema nervoso central, incluindo receptores opioides e GABAérgicos, induzindo padrões de ondas delta no EEG característicos do sono profundo. Modula o eixo hipotálamo-hipófise para regular a secreção noturna de GH e outros hormônios. Também possui propriedades antioxidantes que podem contribuir para seus efeitos neuroprotetores.",
    timeline: [
      { period: "Noite 1-3", description: "Melhora inicial da qualidade do sono e tempo para adormecer." },
      { period: "Semana 1-2", description: "Regulação progressiva do ciclo circadiano." },
      { period: "Semana 3-4", description: "Sono delta consolidado e melhora do GH noturno." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1mg", units: "Diária 10 dias" },
        { phase: "Duração do Ciclo", dose: "1-2x/ano", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1mg", frequency: "Diária 10 dias", duration: "1-2x/ano" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "GHK-Cu", type: "synergic", description: "Pele + colágeno Khavinson + cobre" },
      { name: "Epithalon", type: "synergic", description: "Anti-aging total pele e longevidade" },
    ],
    stacks: [
      { name: "Stack Pele", peptides: ["Endoluten", "GHK-Cu", "Epithalon"], goal: "Anti-aging cutâneo", description: "Pineal + colágeno + longevidade pele" },
    ],
  },
  24: {
    peptideId: 24,
    alternativeNames: ["Growth Hormone Releasing Peptide 6", "GHRP-6", "SKF-110679"],
    classification: "Hexapeptídeo secretagogo de GH (GHRP)",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~15-20 minutos",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O GHRP-6 é um hexapeptídeo sintético secretagogo de GH de primeira geração, que atua como agonista do receptor de grelina (GHS-R1a). É conhecido por produzir forte liberação de GH com estímulo significativo ao apetite — uma característica útil em estados catabólicos. É frequentemente usado em combinação com GHRH como o CJC-1295 para amplificar a liberação de GH.",
    benefits: ["Forte liberação de GH pela hipófise", "Estimulo potente ao apetite e ganho de massa", "Recuperação muscular e tecidual acelerada", "Melhora da densidade óssea", "Ação GI protetora (similar ao BPC-157)"],
    mechanism: ["Agonismo do receptor de grelina (GHS-R1a)", "Estímulo à liberação pulsátil de GH", "Elevação de cortisol e prolactina em doses altas", "Sinergismo com GHRH endógeno ou exógeno"],
    mechanismDetailed: "O GHRP-6 se liga ao receptor de secretagogos de GH (GHS-R1a) na hipófise anterior e hipotálamo, desencadeando liberação aguda de GH. Diferente do GHRP-2, tem maior estímulo ao apetite por ação adicional no hipotálamo. Em doses elevadas, pode elevar cortisol e prolactina. A combinação com CJC-1295 ou Ipamorelin produz efeito sinérgico de 3-5x na liberação de GH.",
    timeline: [
      { period: "Semana 1-2", description: "Aumento do apetite e melhora da qualidade do sono." },
      { period: "Semana 3-4", description: "Ganho de massa muscular inicial e melhora da recuperação." },
      { period: "Mês 2-3", description: "Melhora da composição corporal e densidade óssea." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "100mcg", units: "1-2x/dia" },
        { phase: "Duração do Ciclo", dose: "8-12 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "100mcg", frequency: "1-2x/dia", duration: "8-12 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "CJC-1295", type: "synergic", description: "GHRH + GHRP-6 = GH + apetite bulking" },
      { name: "Ipamorelin", type: "compatible", description: "Ipamorelin mais seletivo que GHRP-6" },
    ],
    stacks: [
      { name: "Stack GH Bulk", peptides: ["GHRP-6", "CJC-1295", "Ipamorelin"], goal: "Bulking com GH", description: "GH + apetite = ganho de massa" },
    ],
  },
  25: {
    peptideId: 25,
    alternativeNames: ["GSH", "γ-glutamilcisteínil-glicina", "Tripeptídeo antioxidante mestre"],
    classification: "Tripeptídeo antioxidante endógeno",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~2-3 horas (IV); oral: baixa biodisponibilidade",
    reconstitutionDifficulty: "Fácil",
    whatIs: "A Glutationa (GSH) é o antioxidante mestre do organismo humano, um tripeptídeo endógeno (glutamato-cisteína-glicina) presente em todas as células. Essencial para desintoxicação hepática, proteção celular contra estresse oxidativo e regulação do sistema imunológico. Seus níveis diminuem com o envelhecimento, doenças crônicas e exposição a toxinas.",
    benefits: ["Detoxificação hepática e celular", "Proteção contra estresse oxidativo", "Fortalecimento do sistema imunológico", "Clareamento da pele e ação antimelanogênica", "Redução da inflamação sistêmica"],
    mechanism: ["Neutralização direta de radicais livres e ROS", "Conjugação com toxinas no fígado (Fase II)", "Reciclagem de vitaminas C e E", "Regulação da apoptose e sinalização celular"],
    mechanismDetailed: "A glutationa neutraliza radicais livres ao ser oxidada a GSSG (glutationa dissulfeto), que é reciclada pela glutationa redutase. No fígado, conjuga-se com toxinas lipofílicas para torná-las hidrossolúveis e excretáveis. Também regula a atividade de proteínas por glutationilação e modula a ativação de fatores de transcrição como NF-κB.",
    timeline: [
      { period: "Dias 1-7", description: "Aumento da energia e redução da fadiga." },
      { period: "Semana 2-4", description: "Melhora perceptível na clareza mental e função hepática." },
      { period: "Mês 1-3", description: "Efeitos antienvelhecimento e clareamento progressivo da pele." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "100-300mcg", units: "1-2x/dia" },
        { phase: "Duração do Ciclo", dose: "12 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "100-300mcg", frequency: "1-2x/dia", duration: "12 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Ipamorelin", type: "synergic", description: "GH Frag lipólise + Ipam GH = composição" },
      { name: "BPC-157", type: "compatible", description: "Recuperação preserva ganhos de composição" },
    ],
    stacks: [
      { name: "Stack Composição", peptides: ["HGH Frag 176-191", "Ipamorelin", "BPC-157"], goal: "Composição corporal", description: "Lipólise sem GH full + recuperação" },
    ],
  },
  26: {
    peptideId: 26,
    alternativeNames: ["GnRH", "LHRH", "Gonadorelina"],
    classification: "Análogo sintético do GnRH (10 aminoácidos)",
    evidenceLevel: "Aprovado (FDA/EMA)",
    halfLife: "~2-10 minutos",
    reconstitutionDifficulty: "Fácil",
    whatIs: "A Gonadorelina é um análogo sintético do hormônio liberador de gonadotrofinas (GnRH), que estimula a hipófise a liberar LH (hormônio luteinizante) e FSH (hormônio folículo-estimulante). É aprovada clinicamente para diagnóstico de hipogonadismo, preservação da fertilidade e como adjuvante em terapia de reposição de testosterona (TRT) para manter a produção testicular.",
    benefits: ["Preservação da fertilidade durante TRT", "Manutenção do tamanho testicular", "Estimulação natural de LH e FSH", "Diagnóstico de hipogonadismo", "Suporte à função gonadal"],
    mechanism: ["Agonismo dos receptores GnRH na hipófise", "Estimulação pulsátil de LH e FSH", "Preservação da espermatogênese", "Manutenção da esteroidogênese testicular"],
    mechanismDetailed: "A Gonadorelina mimetiza os pulsos naturais de GnRH hipotalâmico, estimulando a liberação de LH e FSH pela hipófise anterior. LH estimula as células de Leydig a produzir testosterona, enquanto FSH suporta a espermatogênese. Em homens em TRT, previne a supressão gonadal, mantendo o volume testicular e a fertilidade. A dosagem pulsátil (2-3x/semana) é fundamental para preservar a resposta hipofisária.",
    timeline: [
      { period: "Semana 1-2", description: "Restauração da sinalização LH/FSH." },
      { period: "Semana 3-6", description: "Manutenção do volume testicular e espermatogênese." },
      { period: "Mês 2-3+", description: "Preservação sustentada da fertilidade durante TRT." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "200-300mcg", units: "2-3x/dia" },
        { phase: "Duração do Ciclo", dose: "8-12 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "200-300mcg", frequency: "2-3x/dia", duration: "8-12 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "CJC-1295", type: "synergic", description: "GHRH + GHRP-6 = GH + apetite" },
      { name: "Ipamorelin", type: "compatible", description: "Alternativa GHRP seletiva ao GHRP-6" },
    ],
    stacks: [
      { name: "Stack Bulk GH", peptides: ["GHRP-6", "CJC-1295 no DAC"], goal: "Ganho de massa com GH", description: "GHRP apetite + GHRH para bulking" },
    ],
  },
  27: {
    peptideId: 27,
    alternativeNames: ["Human Chorionic Gonadotropin", "hCG", "β-hCG"],
    classification: "Glicoproteína hormonal (placenta humana)",
    evidenceLevel: "Aprovado (FDA/EMA)",
    halfLife: "~24-36 horas",
    reconstitutionDifficulty: "Moderada",
    whatIs: "A HCG (Gonadotrofina Coriônica Humana) é um hormônio glicoproteico produzido pela placenta durante a gravidez. Em homens, mimetiza o LH (hormônio luteinizante), estimulando as células de Leydig a produzir testosterona endogenamente. É amplamente usada em TRT como adjuvante para preservar a função testicular, fertilidade e tamanho dos testículos.",
    benefits: ["Preservação da fertilidade durante TRT", "Manutenção do volume testicular", "Estimulação da produção endógena de testosterona", "Suporte à espermatogênese", "Tratamento do hipogonadismo hipogonadotrófico"],
    mechanism: ["Agonismo do receptor de LH nas células de Leydig", "Estimulação da produção de testosterona intratesticular", "Suporte à espermatogênese via FSH-like ação", "Preservação do eixo hipotalâmico-hipofisário-gonadal"],
    mechanismDetailed: "A HCG mimetiza o LH endógeno ao ligar-se ao receptor de LH/hCG nas células de Leydig dos testículos, estimulando a síntese e liberação de testosterona. Isso mantém níveis intratesticulares de testosterona essenciais para a espermatogênese. Em homens em TRT com testosterona exógena, o uso de HCG previne a atrofia testicular e a infertilidade causadas pela supressão do eixo HPG.",
    timeline: [
      { period: "Semana 1-2", description: "Aumento dos níveis intratesticulares de testosterona." },
      { period: "Semana 3-6", description: "Manutenção do volume testicular e espermatogênese." },
      { period: "Mês 2-3+", description: "Preservação sustentada da fertilidade e função gonadal." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC/IM",
      phases: [
        { phase: "Dose Principal", dose: "500-2000 UI", units: "2-3x/sem" },
        { phase: "Duração do Ciclo", dose: "12 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "500-2000 UI", frequency: "2-3x/sem", duration: "12 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC/IM.",
    ],
    interactions: [
      { name: "Enclomifeno", type: "compatible", description: "Estimulam eixo HPG por vias diferentes" },
      { name: "Clomid", type: "compatible", description: "Antiestrogênico + HCG = restauração HPG" },
    ],
    stacks: [
      { name: "Stack TRT", peptides: ["HCG", "Enclomifeno"], goal: "Fertilidade em TRT", description: "Preservação testicular durante TRT" },
    ],
  },
  28: {
    peptideId: 28,
    alternativeNames: ["Somatropina", "hGH 191aa", "Hormônio do Crescimento Recombinante"],
    classification: "Hormônio peptídico (191 aminoácidos)",
    evidenceLevel: "Aprovado (FDA/EMA)",
    halfLife: "~20-30 minutos",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O HGH 191AA é a forma recombinante idêntica ao hormônio do crescimento humano natural, composto por 191 aminoácidos. É aprovado pela FDA para deficiência de GH, síndrome de Turner e outras condições. Estimula crescimento, síntese proteica, lipolise e produção de IGF-1 no fígado. É o gold standard entre os peptídeos de GH.",
    benefits: ["Aumento da massa muscular magra", "Queima de gordura visceral e subcutânea", "Melhora da recuperação e regeneração tecidual", "Fortalecimento de ossos e articulações", "Melhora da qualidade do sono e bem-estar"],
    mechanism: ["Ligação ao receptor de GH (GHR) em tecidos periféricos", "Estimulação hepática da produção de IGF-1", "Promoção de lipólise em adipócitos", "Síntese proteica em tecido muscular"],
    mechanismDetailed: "O HGH exerce seus efeitos diretamente ao ligar-se ao receptor de GH (GHR) e indiretamente via estimulação da produção hepática de IGF-1. No músculo, promove captação de aminoácidos e síntese proteica. No tecido adiposo, estimula a lipólise via ativação da lipase sensível a hormônio. No fígado, induz síntese de IGF-1 que medeia grande parte dos efeitos anabólicos.",
    timeline: [
      { period: "Semana 1-4", description: "Melhora do sono e recuperação, redução de gordura corporal inicial." },
      { period: "Mês 2-3", description: "Ganho perceptível de massa muscular magra." },
      { period: "Mês 4-6", description: "Mudança significativa na composição corporal e densidade óssea." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "2-4 UI", units: "1-2x/dia" },
        { phase: "Duração do Ciclo", dose: "5 on/2 off", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "2-4 UI", frequency: "1-2x/dia", duration: "5 on/2 off" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Ipamorelin", type: "synergic", description: "HGH + GHRP = eixo GH completo" },
      { name: "IGF-1 LR3", type: "synergic", description: "IGF-1 exógeno + GH exógeno = anabolismo máximo" },
    ],
    stacks: [
      { name: "Stack GH Avançado", peptides: ["HGH 191AA", "Ipamorelin", "IGF-1 LR3"], goal: "GH + IGF-1 completo", description: "Stack avançado: GH + GHRP + IGF-1 exógeno" },
    ],
  },
  29: {
    peptideId: 29,
    alternativeNames: ["Human Menopausal Gonadotropin", "hMG", "Menogon"],
    classification: "Gonadotrofina glicoproteica (LH + FSH)",
    evidenceLevel: "Aprovado (FDA/EMA)",
    halfLife: "~24 horas",
    reconstitutionDifficulty: "Moderada",
    whatIs: "A HMG (Gonadotrofina Menopáusica Humana) é extraída da urina de mulheres pós-menopausa e contém tanto LH quanto FSH. É utilizada principalmente em protocolos de fertilidade para estimulação ovariana controlada em mulheres e para estimulação da espermatogênese em homens com hipogonadismo hipogonadotrófico.",
    benefits: ["Estimulação ovariana em tratamentos de fertilidade", "Suporte à espermatogênese masculina", "Restauração da função gonadal", "Alternativa ao FSH recombinante puro", "Tratamento de anovulação crônica"],
    mechanism: ["Ação simultânea via receptores de LH e FSH", "Estimulação do desenvolvimento folicular ovariano", "Suporte à célula de Sertoli e espermatogênese", "Modulação esteroidogênese gonadal"],
    mechanismDetailed: "A HMG atua estimulando receptores de LH e FSH nas gônadas. Em mulheres, promove o desenvolvimento e maturação de folículos ovarianos. Em homens, o componente FSH estimula as células de Sertoli e a espermatogênese, enquanto o LH estimula a produção de testosterona pelas células de Leydig. É especialmente eficaz em hipogonadismo hipogonadotrófico (deficiência de gonadotrofinas hipofisárias).",
    timeline: [
      { period: "Dias 1-5", description: "Início da estimulação folicular ou testicular." },
      { period: "Semana 2-3", description: "Desenvolvimento folicular ou espermatogênico progressivo." },
      { period: "Mês 1-3", description: "Resultados de fertilidade mensuráveis." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC/IM",
      phases: [
        { phase: "Dose Principal", dose: "75-150 UI", units: "Diária" },
        { phase: "Duração do Ciclo", dose: "10-14 dias", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "75-150 UI", frequency: "Diária", duration: "10-14 dias" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC/IM.",
    ],
    interactions: [
      { name: "HCG", type: "compatible", description: "FSH + LH para fertilidade completa" },
      { name: "Clomid", type: "monitor", description: "Antiestrogênico com HMG — monitorar" },
    ],
    stacks: [
      { name: "Stack Fertilidade", peptides: ["HMG", "HCG"], goal: "Fertilidade masculina/feminina", description: "LH + FSH = espermatogênese completa" },
    ],
  },
  30: {
    peptideId: 30,
    alternativeNames: ["Long Arg3 IGF-1", "IGF-1 LR3", "Long-R3 IGF-1"],
    classification: "Análogo de IGF-1 de ação prolongada (83 aminoácidos)",
    evidenceLevel: "Pré-clínico",
    halfLife: "~20-30 horas",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O IGF-1 LR3 é um análogo de longa ação do fator de crescimento semelhante à insulina-1 (IGF-1), com uma mutação (Arg3) e extensão N-terminal de 13 aminoácidos que reduzem sua ligação às proteínas de ligação do IGF (IGFBPs). Isso resulta em meia-vida de 20-30 horas versus ~15 minutos do IGF-1 natural. É potente estimulador da hipertrofia muscular e hiperplasia.",
    benefits: ["Hipertrofia muscular acelerada", "Potencial para hiperplasia de fibras musculares", "Queima de gordura e melhora da composição corporal", "Recuperação muscular pós-treino acelerada", "Melhora da síntese proteica total"],
    mechanism: ["Agonismo do receptor de IGF-1 (IGF-1R) em músculo", "Ativação da via PI3K/Akt/mTOR para síntese proteica", "Inibição da proteólise muscular", "Estimulação da captação de glicose em músculo"],
    mechanismDetailed: "O IGF-1 LR3 ativa o receptor de IGF-1R, desencadeando as vias de sinalização PI3K/Akt/mTOR e Ras/MAPK. Isso resulta em aumento da síntese proteica, inibição da proteólise e estimulação da proliferação de células satélites musculares (potencial de hiperplasia). Sua meia-vida estendida permite exposição tecidual prolongada sem as flutuações do IGF-1 nativo.",
    timeline: [
      { period: "Dias 1-7", description: "Aumento perceptível da bomba muscular e fullness." },
      { period: "Semana 2-4", description: "Ganho de massa muscular notável e redução de gordura." },
      { period: "Mês 1-2", description: "Mudança na composição corporal consolidada." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "50-80mcg/kg", units: "1x/dia pós-treino" },
        { phase: "Duração do Ciclo", dose: "4-6 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "50-80mcg/kg", frequency: "1x/dia pós-treino", duration: "4-6 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "MGF", type: "synergic", description: "IGF-1 LR3 sistêmico + MGF local = hipertrofia" },
      { name: "CJC-1295", type: "compatible", description: "GH aumenta IGF-1 que potencia LR3" },
    ],
    stacks: [
      { name: "Stack IGF", peptides: ["IGF-1 LR3", "MGF", "CJC-1295"], goal: "Hipertrofia avançada", description: "IGF-1 meia-longa + local + GH = anabolismo" },
    ],
  },
  32: {
    peptideId: 32,
    alternativeNames: ["Kisspeptin-10", "Metastin", "KP-10"],
    classification: "Decapeptídeo neuropeptídico (10 aminoácidos)",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~28 minutos",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O Kisspeptin-10 é o fragmento biologicamente ativo do neuropeptídeo kisspeptin, codificado pelo gene KISS1. É o principal regulador do eixo hipotalâmico-hipofisário-gonadal (HPG), modulando a liberação de GnRH e, consequentemente, de LH e FSH. Tem papel fundamental na puberdade, fertilidade e ciclo reprodutivo.",
    benefits: ["Regulação do eixo reprodutivo HPG", "Estimulação natural da liberação de LH e FSH", "Suporte à fertilidade masculina e feminina", "Potencial terapêutico em hipogonadismo central", "Modulação da libido via SNC"],
    mechanism: ["Agonismo do receptor GPR54/KISS1R no hipotálamo", "Estimulação da liberação pulsátil de GnRH", "Aumento da liberação de LH e FSH", "Modulação de neurônios GnRH"],
    mechanismDetailed: "O Kisspeptin-10 ativa o receptor KISS1R (GPR54) expresso em neurônios GnRH do hipotálamo, desencadeando a liberação pulsátil de GnRH. O GnRH liberado então estimula a hipófise a secretar LH e FSH. Este eixo é fundamental para a reprodução e pode ser explorado terapeuticamente em hipogonadismo hipogonadotrófico (deficiência central de GnRH).",
    timeline: [
      { period: "Horas 1-6", description: "Aumento agudo de LH circulante." },
      { period: "Semana 1-2", description: "Normalização do eixo HPG com uso regular." },
      { period: "Mês 1-2", description: "Melhora da função reprodutiva e hormonal." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC/IN",
      phases: [
        { phase: "Dose Principal", dose: "50-100mcg", units: "1-2x/sem" },
        { phase: "Duração do Ciclo", dose: "4-8 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "50-100mcg", frequency: "1-2x/sem", duration: "4-8 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC/IN.",
    ],
    interactions: [
      { name: "HCG", type: "compatible", description: "HCG mimetiza LH; Kisspeptin estimula GnRH" },
      { name: "Enclomifeno", type: "compatible", description: "HPG restaurado por múltiplas vias" },
    ],
    stacks: [
      { name: "Stack HPG", peptides: ["Kisspeptin", "HCG"], goal: "Restauração do eixo HPG", description: "Eixo HPG restaurado por via central e periférica" },
    ],
  },
  33: {
    peptideId: 33,
    alternativeNames: ["KLOW Peptide", "Novo peptídeo anti-inflamatório"],
    classification: "Peptídeo anti-inflamatório sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "~2-4 horas",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O KLOW é um peptídeo sintético anti-inflamatório de última geração, desenvolvido para modular vias de sinalização inflamatória de forma seletiva. Atua como inibidor de vias pró-inflamatórias sem os efeitos imunossupressores dos corticoides, sendo pesquisado para condições inflamatórias crônicas e autoimunes.",
    benefits: ["Redução da inflamação sistêmica sem imunossupressão", "Melhora em condições inflamatórias crônicas", "Potencial em doenças autoimunes", "Redução de marcadores inflamatórios (PCR, IL-6)", "Perfil de segurança superior aos corticoides"],
    mechanism: ["Inibição de vias de sinalização NF-κB", "Modulação de citocinas pró-inflamatórias", "Ação anti-inflamatória seletiva", "Regulação de macrófagos e células dendríticas"],
    mechanismDetailed: "O KLOW modula seletivamente vias inflamatórias intracelulares, incluindo NF-κB e MAPK, sem suprimir a imunidade adaptativa. Sua ação é centrada na regulação de macrófagos para o fenótipo anti-inflamatório M2 e na redução da produção de citocinas pró-inflamatórias como TNF-α, IL-1β e IL-6.",
    timeline: [
      { period: "Dias 1-7", description: "Redução inicial de marcadores inflamatórios." },
      { period: "Semana 2-4", description: "Melhora dos sintomas inflamatórios crônicos." },
      { period: "Mês 1-3", description: "Controle sustentado da inflamação sistêmica." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1-2mg", units: "2x/sem" },
        { phase: "Duração do Ciclo", dose: "8-12 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1-2mg", frequency: "2x/sem", duration: "8-12 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "BPC-157", type: "synergic", description: "Anti-inflamatório local + KLOW sistêmico" },
      { name: "NAD+", type: "synergic", description: "Energia celular + controle inflamação" },
    ],
    stacks: [
      { name: "Stack Anti-Inflam", peptides: ["KLOW", "BPC-157", "NAD+"], goal: "Controle inflamação sistêmica", description: "Anti-inflamatório local + sistêmico + energia" },
    ],
  },
  35: {
    peptideId: 35,
    alternativeNames: ["L-Carnitine Injection", "Levocarnitina", "LCAR"],
    classification: "Aminoácido quaternário (derivado de lisina e metionina)",
    evidenceLevel: "Aprovado (FDA/EMA)",
    halfLife: "~17 horas (oral); variável (IV)",
    reconstitutionDifficulty: "Fácil",
    whatIs: "A L-Carnitina é um composto endógeno essencial para o transporte de ácidos graxos de cadeia longa para o interior das mitocôndrias, onde são oxidados para produção de ATP. Aprovada para deficiência de carnitina e doenças metabólicas, é amplamente utilizada para melhora da composição corporal e desempenho atlético.",
    benefits: ["Transporte de ácidos graxos e oxidação mitocondrial", "Melhora da composição corporal e queima de gordura", "Aumento da performance atlética e redução da fadiga", "Neuroproteção ALCAR", "Melhora da sensibilidade à insulina"],
    mechanism: ["Transporte de acil-CoA pela membrana mitocondrial interna via CPT1", "Ativação da beta-oxidação de ácidos graxos", "Modulação da razão acil-CoA/CoA livre", "Proteção contra estresse oxidativo mitocondrial"],
    mechanismDetailed: "A L-Carnitina forma acilcarnitina com ácidos graxos ativados (acil-CoA), permitindo seu transporte pela carnitina aciltransferase 1 (CPT1) através da membrana mitocondrial interna para beta-oxidação. A forma acetilada (ALCAR) atravessa a barreira hematoencefálica, exercendo efeitos neuroprotetores adicionais.",
    timeline: [
      { period: "Semana 1-2", description: "Aumento de energia e menor fadiga durante exercícios." },
      { period: "Semana 3-6", description: "Melhora perceptível na composição corporal." },
      { period: "Mês 2-3", description: "Otimização metabólica e desempenho atlético consolidado." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "IV/IM/Oral",
      phases: [
        { phase: "Dose Principal", dose: "1-3g", units: "1-3x/dia" },
        { phase: "Duração do Ciclo", dose: "Uso contínuo", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1-3g", frequency: "1-3x/dia", duration: "Uso contínuo" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: IV/IM/Oral.",
    ],
    interactions: [
      { name: "CoQ10", type: "synergic", description: "Energia mitocondrial amplificada junto com L-Carnitine" },
      { name: "NAD+", type: "synergic", description: "NAD+ + L-Carnitine = otimização energética total" },
    ],
    stacks: [
      { name: "Stack Energia", peptides: ["L-Carnitine", "CoQ10", "NAD+"], goal: "Energia e metab", description: "Transporte de ácidos graxos + coenzimas vitais" },
    ],
  },
  36: {
    peptideId: 36,
    alternativeNames: ["Ala-Glu-Asp-Gly-Pro", "AEDGP", "Biorregulador imunológico"],
    classification: "Pentapeptídeo biorregulador sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "Curta (minutos); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Livagen é um pentapeptídeo biorregulador sintético do Prof. Khavinson para modular o sistema imune e longevidade. Atua como citomédino para leucócitos e células linfáticas, modulando a expressão gênica de proteínas imunes e inibindo o envelhecimento celular.",
    benefits: ["Imunomodulação e fortalecimento imune", "Propriedades anti-aging e longevidade", "Redução da inflamação crônica", "Suporte à função leucocitária", "Melhora do bem-estar em idosos"],
    mechanism: ["Modulação epigenética de genes imunes", "Estimulação de leucócitos e células NK", "Redução do SASP em células senescentes", "Regulação de citocinas imunes"],
    mechanismDetailed: "O Livagen interage com regiões promotoras do DNA em leucócitos, modulando transcrição de genes de proteínas imunes. Reduz marcadores de senescência (SASP) e estimula células NK. Opera via regulação epigenética sem alterar permanentemente o genoma.",
    timeline: [
      { period: "Semana 1-2", description: "Ativação inicial do sistema imune inato." },
      { period: "Semana 3-6", description: "Fortalecimento da resposta adaptativa." },
      { period: "Mês 2-3", description: "Redução da inflamação crônica e melhora na qualidade de vida." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "0.5-1mg", units: "Diária 10 dias" },
        { phase: "Duração do Ciclo", dose: "1-2x/ano", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "0.5-1mg", frequency: "Diária 10 dias", duration: "1-2x/ano" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Vilon", type: "synergic", description: "Livagen + Vilon = dupla imunidade Khavinson" },
      { name: "Epithalon", type: "synergic", description: "Longevidade sistêmica com imunidade reforçada" },
    ],
    stacks: [
      { name: "Stack Imune", peptides: ["Livagen", "Vilon", "Epithalon"], goal: "Imunidade e longevidade", description: "Imunidade + timo + longevidade sistêmica" },
    ],
  },
  38: {
    peptideId: 38,
    alternativeNames: ["IBI362", "LY3305677", "Agonista dual GLP-1/Glucagon"],
    classification: "Agonista dual de receptores GLP-1/GCGR",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~5-7 dias",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O Mazdutide é um agonista dual dos receptores GLP-1 e Glucagon (Innovent Biologics). Demonstrou excelente eficácia para redução de peso e melhora metabólica em estudos clínicos. Apresenta resultados comparáveis ao Semaglutide com benefício adicional de saúde hepática.",
    benefits: ["Perda de peso significativa e sustentada", "Melhora do controle glicêmico", "Saúde hepática (redução de esteatose)", "Melhora do perfil lipídico", "Dosagem semanal conveniente"],
    mechanism: ["Agonismo GLP-1R para secreção de insulina e saciedade", "Agonismo GCGR para gasto energético e lipólise hepática", "Retardo do esvaziamento gástrico", "Supressão central do apetite"],
    mechanismDetailed: "O Mazdutide combina GLP-1R (saciedade, insulina, retardo gástrico) e GCGR (gasto energético, lipólise hepática) em uma molécula. A ação dual resulta em perda de peso superior aos agonistas GLP-1 simples, com benefício adicional na MASLD/NAFLD.",
    timeline: [
      { period: "Semana 1-4", description: "Redução do apetite e início da perda de peso." },
      { period: "Mês 2-3", description: "Perda de peso de 5-10% do peso corporal." },
      { period: "Mês 4-6", description: "Perda de peso consolidada e melhora metabólica significativa." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1-6mg", units: "1x/sem" },
        { phase: "Duração do Ciclo", dose: "24 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1-6mg", frequency: "1x/sem", duration: "24 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "AOD-9604", type: "synergic", description: "GLP-1+Glucagon apetite + lipólise AOD" },
      { name: "Metformina", type: "compatible", description: "Controle glicêmico aditivo" },
    ],
    stacks: [
      { name: "Stack Metabol", peptides: ["Mazdutide", "AOD-9604"], goal: "Perda de gordura dual", description: "GLP-1/Glucagon + lipólise direta" },
    ],
  },
  39: {
    peptideId: 39,
    alternativeNames: ["Melanotan-2", "MT-2", "MT-II"],
    classification: "Análogo cíclico de α-MSH (7 aminoácidos)",
    evidenceLevel: "Pré-clínico",
    halfLife: "~30-60 minutos",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Melanotan II é um análogo sintético cíclico do α-MSH que produz bronzeamento sem exposição solar, aumenta a libido e pode reduzir o apetite. Atua em receptores de melanocortina MC1R, MC3R e MC4R.",
    benefits: ["Bronzeamento profundo sem exposição UV", "Aumento significativo da libido", "Redução do apetite e peso corporal", "Proteção contra danos UV", "Melhora da disfunção erétil"],
    mechanism: ["Agonismo MC1R (bronzeamento/melanina)", "Agonismo MC4R (libido/apetite)", "Agonismo MC3R (metabolismo energético)", "Estimulação de eumelanina"],
    mechanismDetailed: "O MT-II ativa MC1R nos melanócitos estimulando eumelanina (bronzeamento); MC4R no hipotálamo aumenta libido e reduz apetite; MC3R modula metabolismo energético. Difere do PT-141 por não ser seletivo, produzindo bronzeamento como efeito adicional.",
    timeline: [
      { period: "Dias 1-5", description: "Primeiros sinais de bronzeamento e aumento da libido." },
      { period: "Semana 1-2", description: "Bronzeamento progressivo e redução do apetite." },
      { period: "Semana 3-4", description: "Bronzeamento pleno e efeitos na libido consolidados." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "500mcg-1mg", units: "Conforme necessidade" },
        { phase: "Duração do Ciclo", dose: "4-6 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "500mcg-1mg", frequency: "Conforme necessidade", duration: "4-6 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "PT-141", type: "synergic", description: "MT-II bronzeamento + PT-141 libido pure" },
      { name: "Oxitocina", type: "compatible", description: "Vínculo emocional + desejo = experiência completa" },
    ],
    stacks: [
      { name: "Stack BronzLibido", peptides: ["Melanotan II", "PT-141"], goal: "Bronzeamento e libido", description: "Bronzeamento sem UV + libido amplificada" },
    ],
  },
  40: {
    peptideId: 40,
    alternativeNames: ["Mechano Growth Factor", "IGF-1Ec", "PEG-MGF"],
    classification: "Variante de splicing de IGF-1 (22 aa E-peptide)",
    evidenceLevel: "Pré-clínico",
    halfLife: "~2 minutos (nativo); ~7 dias (PEG-MGF)",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O MGF é uma variante de splicing do IGF-1 produzida em resposta a dano mecânico muscular. Ativa células satélites musculares promovendo reparo e crescimento local. A versão PEGilada tem ação prolongada.",
    benefits: ["Ativação de células satélites musculares", "Recuperação pós-treino acelerada", "Hipertrofia muscular e reparo de fibras", "Neuroproteção em tecido neural", "Efeito anabólico local"],
    mechanism: ["Ativação de células satélites musculares (Pax7+)", "Proliferação e diferenciação miogênica", "Via parcialmente independente do IGF-1R sistêmico", "Ação local no músculo danificado"],
    mechanismDetailed: "O MGF é gerado por splicing alternativo do IGF-1 em resposta a dano mecânico. O E-peptide ativa células satélites musculares via mecanismo parcialmente independente do IGF-1R. PEG-MGF tem meia-vida estendida para administração sistêmica.",
    timeline: [
      { period: "Dias 1-3", description: "Ativação de células satélites e início do reparo muscular." },
      { period: "Semana 1-2", description: "Recuperação acelerada pós-treino perceptível." },
      { period: "Semana 3-6", description: "Hipertrofia muscular progressiva e consolidada." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "200-500mcg PEG-MGF", units: "2x/sem" },
        { phase: "Duração do Ciclo", dose: "6-8 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "200-500mcg PEG-MGF", frequency: "2x/sem", duration: "6-8 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "IGF-1 LR3", type: "synergic", description: "MGF local + IGF-1 LR3 sistêmico = hipertrofia" },
      { name: "TB-500", type: "synergic", description: "Recuperação sistêmica amplifica ganhos" },
    ],
    stacks: [
      { name: "Stack Hipertrofia", peptides: ["MGF", "IGF-1 LR3", "TB-500"], goal: "Hipertrofia e reparo", description: "Reparação muscular local + anabolismo sistêmico" },
    ],
  },
  42: {
    peptideId: 42,
    alternativeNames: ["Nicotinamide Adenine Dinucleotide", "NAD", "β-NAD+"],
    classification: "Coenzima dinucleotídica endógena",
    evidenceLevel: "Clínico Fase II",
    halfLife: "~15 minutos (IV); oral: variável",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O NAD+ é a coenzima central no metabolismo celular. Essencial para produção de energia mitocondrial, regulação epigenética pelas sirtuínas e reparo de DNA. Seus níveis declinam ~50% com o envelhecimento, tornando-o alvo central para longevidade e anti-aging.",
    benefits: ["Aumento da energia celular e mitocondrial", "Ativação de sirtuínas (SIRT1-7) para longevidade", "Reparação do DNA e estabilidade genômica", "Melhora cognitiva e clareza mental", "Anti-aging metabólico global"],
    mechanism: ["Coenzima na fosforilação oxidativa (NAD+/NADH)", "Substrato para sirtuínas (longevidade epigenética)", "Substrato para PARPs (reparo de DNA)", "Modulação do metabolismo de Ca2+ celular"],
    mechanismDetailed: "O NAD+ é coenzima em centenas de reações de oxirredução. Na mitocôndria, é reduzido a NADH para produção de ATP. Como substrato das sirtuínas (SIRT1-7), regula genes de longevidade. Para as PARPs, é essencial no reparo de quebras de DNA, prevenindo instabilidade genômica.",
    timeline: [
      { period: "Horas 1-24", description: "Aumento imediato dos níveis de NAD+ (especialmente via IV)." },
      { period: "Dias 1-7", description: "Melhora notável de energia, clareza mental e desempenho físico." },
      { period: "Semana 2-4+", description: "Efeitos anti-aging e metabólicos consolidados." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "IV/SC",
      phases: [
        { phase: "Dose Principal", dose: "500mg-1g IV", units: "1x/mês IV" },
        { phase: "Duração do Ciclo", dose: "Uso contínuo", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "500mg-1g IV", frequency: "1x/mês IV", duration: "Uso contínuo" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: IV/SC.",
    ],
    interactions: [
      { name: "Epithalon", type: "synergic", description: "NAD+ energético + telômeros = longevidade" },
      { name: "SS-31", type: "synergic", description: "Saúde mitocondrial + NAD+ = longevidade máxima" },
    ],
    stacks: [
      { name: "Stack Longev", peptides: ["NAD+", "Epithalon", "SS-31"], goal: "Longevidade e energia", description: "A combinação anti-aging mais estudada" },
    ],
  },
  43: {
    peptideId: 43,
    alternativeNames: ["AEDR Ovariano", "Biorregulador ovariano", "Peptídeo ovariano de Khavinson"],
    classification: "Tetrapeptídeo biorregulador sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "Curta (minutos); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Ovagen é um tetrapeptídeo biorregulador sintético do Prof. Khavinson para tecido ovariano. Modula expressão gênica em células ovarianas, promovendo função folicular, produção hormonal e saúde reprodutiva feminina. Indicado para preservação da função ovariana com o envelhecimento.",
    benefits: ["Suporte à função ovariana e fertilidade", "Modulação de estrogênio e progesterona", "Redução dos sintomas da menopausa", "Preservação da reserva ovariana", "Saúde reprodutiva feminina"],
    mechanism: ["Modulação epigenética em células ovarianas", "Estimulação da foliculogênese", "Regulação da esteroidogênese ovariana", "Suporte à função do corpo lúteo"],
    mechanismDetailed: "O Ovagen atua como citomédino ovariano, modulando genes de esteroidogênese e foliculogênese. Estimula produção de estrogênio e progesterona, suporta desenvolvimento folicular e pode retardar insuficiência ovariana relacionada ao envelhecimento.",
    timeline: [
      { period: "Semana 1-2", description: "Modulação inicial dos níveis hormonais femininos." },
      { period: "Semana 3-6", description: "Melhora dos ciclos hormonais e síntese." },
      { period: "Mês 2-3", description: "Preservação da função ovariana consolidada." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "0.5-1mg", units: "Diária 10 dias" },
        { phase: "Duração do Ciclo", dose: "1-2x/ano", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "0.5-1mg", frequency: "Diária 10 dias", duration: "1-2x/ano" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Epithalon", type: "synergic", description: "Ovário + longevidade sistêmica Khavinson" },
      { name: "Livagen", type: "compatible", description: "Imunidade + saúde feminina" },
    ],
    stacks: [
      { name: "Stack Feminino", peptides: ["Ovagen", "Epithalon", "Livagen"], goal: "Saúde feminina anti-aging", description: "Biorregulador ovariano + longevidade + imunidade" },
    ],
  },
  44: {
    peptideId: 44,
    alternativeNames: ["OT", "Ocitocina", "Hormônio do amor"],
    classification: "Nonapeptídeo neuropeptídico (9 aminoácidos)",
    evidenceLevel: "Aprovado (FDA/EMA)",
    halfLife: "~1-6 minutos (IV); intranasal: 2-4 horas",
    reconstitutionDifficulty: "Fácil",
    whatIs: "A Oxitocina é um neuropeptídeo produzido pelo hipotálamo. Conhecida como 'hormônio do amor', regula comportamentos sociais, apego, ansiedade e resposta ao estresse. Aprovada para indução do parto, é pesquisada para autismo, ansiedade social e depressão.",
    benefits: ["Fortalecimento de vínculos sociais e afetivos", "Redução da ansiedade e estresse", "Melhora da confiança e comportamento pró-social", "Suporte na intimidade", "Potencial em TEA e fobia social"],
    mechanism: ["Agonismo de receptores de oxitocina (OXTR) no SNC", "Modulação dopaminérgica no sistema de recompensa", "Redução da reatividade da amígdala", "Regulação de serotonina e GABA hipocampal"],
    mechanismDetailed: "A oxitocina ativa receptores OXTR em regiões límbicas (amígdala, hipocampo) e no sistema de recompensa. Reduz a reatividade da amígdala ao medo e aumenta circuitos pró-sociais via dopamina. A via intranasal permite acesso direto ao SNC.",
    timeline: [
      { period: "Minutos 30-60", description: "Efeitos agudos de redução de ansiedade e confiança." },
      { period: "Semana 1-2", description: "Melhora nos padrões de comportamento social e emocional." },
      { period: "Mês 1-2+", description: "Mudanças comportamentais consistentes com uso regular." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "IN/SC",
      phases: [
        { phase: "Dose Principal", dose: "100 UI IN", units: "1-3x/dia" },
        { phase: "Duração do Ciclo", dose: "Conforme uso", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "100 UI IN", frequency: "1-3x/dia", duration: "Conforme uso" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: IN/SC.",
    ],
    interactions: [
      { name: "PT-141", type: "synergic", description: "PT-141 desejo + OT vínculo e intensidade" },
      { name: "Selank", type: "compatible", description: "Ansiedade reduzida + confiança aumentada" },
    ],
    stacks: [
      { name: "Stack Social", peptides: ["Oxitocina", "PT-141", "Selank"], goal: "Bem-estar social e sexual", description: "Oxitocina + libido + redução de ansiedade" },
    ],
  },
  45: {
    peptideId: 45,
    alternativeNames: ["P21 Peptide", "NAPVSIPQ variant", "Cerebrolysin mimetic"],
    classification: "Peptídeo nootrópico sintético (21 aminoácidos)",
    evidenceLevel: "Pré-clínico",
    halfLife: "~4-12 horas",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O P21 é um peptídeo sintético nootrópico desenvolvido como mimético da Cerebrolysin, com maior pureza e ação definida. Estimula neurogênese no hipocampo, fortalece conexões sinápticas e promove neuroproteção. É pesquisado para melhora cognitiva em condições neurodegenerativas e em indivíduos saudáveis.",
    benefits: ["Estimulação da neurogênese hipocampal", "Melhora da memória de longo prazo", "Aumento da plasticidade sináptica", "Neuroproteção contra declínio cognitivo", "Melhora da função executiva e foco"],
    mechanism: ["Inibição do PACAP (ação contrária aos peptídeos pró-neurogênicos)", "Modulação do eixo BDNF/CREN-PE", "Estimulação de progenitores neuronais", "Melhora de sinaptogênese"],
    mechanismDetailed: "O P21 atua inibindo o PACAP (Pituitary Adenylate Cyclase-Activating Polypeptide) de forma a potencializar a neurogênese endógena. Aumenta a expressão de BDNF, promove a diferenciação de células progenitoras neurais e fortalece as conexões sinápticas existentes, com foco na região do hipocampo responsável pela memória.",
    timeline: [
      { period: "Semana 1-2", description: "Melhora inicial do foco e clareza mental." },
      { period: "Semana 3-6", description: "Ganhos mensuráveis de memória e aprendizado." },
      { period: "Mês 2-3", description: "Efeitos nootrópicos consolidados e neuroproteção." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1-2mg", units: "1x/dia" },
        { phase: "Duração do Ciclo", dose: "8-12 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1-2mg", frequency: "1x/dia", duration: "8-12 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Semax", type: "synergic", description: "P21 neurogênese + Semax nootrópico" },
      { name: "Dihexa", type: "synergic", description: "Neurogênese máxima com triple stack" },
    ],
    stacks: [
      { name: "Stack Neuro", peptides: ["P21", "Semax", "Dihexa"], goal: "Neurogênese máxima", description: "Triple nootrópico para neurogênese e memória" },
    ],
  },
  46: {
    peptideId: 46,
    alternativeNames: ["Antidepressant Peptide", "FGLL", "Synaptogenic peptide"],
    classification: "Tetrapeptídeo antidepressivo sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "~2-4 horas",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O PE-22-28 é um peptídeo sintético derivado da Spinorphin humana, pesquisado como antidepressivo de ação rápida. Estimula a sinaptogênese e modula circuitos envolvidos no humor e motivação sem os efeitos colaterais dos antidepressivos convencionais. Tem potencial para depressão resistente ao tratamento.",
    benefits: ["Ação antidepressiva rápida (horas a dias)", "Estimulação da sinaptogênese prefrontal", "Melhora do humor e motivação", "Potencial em depressão resistente", "Ausência dos efeitos colaterais típicos dos ISRSs"],
    mechanism: ["Modulação dos receptores de serotonina (5-HT2A)", "Estimulação de sinaptogênese no córtex pré-frontal", "Ativação da via BDNF/TrkB", "Modulação de receptores de glutamato (AMPA)"],
    mechanismDetailed: "O PE-22-28 modula a sinalização de serotonina e glutamato no córtex pré-frontal, estimulando rapidamente a formação de novas sinapses. Ativa a via BDNF/TrkB, fundamental para a plasticidade sináptica e resiliência neuronal. Seus efeitos antidepressivos têm início mais rápido que os ISRSs tradicionais.",
    timeline: [
      { period: "Horas 2-24", description: "Efeitos antidepressivos agudos iniciais." },
      { period: "Dias 2-7", description: "Estabilização do humor e aumento da motivação." },
      { period: "Semana 2-4+", description: "Melhora consistente do estado emocional." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "200-500mcg", units: "1x/dia" },
        { phase: "Duração do Ciclo", dose: "4-8 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "200-500mcg", frequency: "1x/dia", duration: "4-8 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Selank", type: "synergic", description: "Ansiolítico + antidepressivo rápido" },
      { name: "Semax", type: "synergic", description: "Nootrópico + antidepressivo cognitivo" },
    ],
    stacks: [
      { name: "Stack Mental", peptides: ["PE-22-28", "Selank", "Semax"], goal: "Saúde mental completa", description: "Antidepressivo + ansiolítico + nootrópico" },
    ],
  },
  47: {
    peptideId: 47,
    alternativeNames: ["Ala-Glu-Asp-Gly", "AEDG Pineal", "Epitalamina sintética"],
    classification: "Tetrapeptídeo biorregulador sintético (análogo do Epithalon)",
    evidenceLevel: "Pré-clínico",
    halfLife: "Curta (minutos); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Pinealon é um tetrapeptídeo biorregulador sintético específico para neurônios cerebrais e a glândula pineal. Desenvolvido pelo Prof. Khavinson como análogo do Epithalon, modula a função pineal e a produção de melatonina, além de exercer efeitos neuroprotetores e regulação do ciclo circadiano.",
    benefits: ["Regulação da produção de melatonina pela glândula pineal", "Modulação do ciclo circadiano", "Neuroproteção de neurônios cerebrais", "Melhora da qualidade do sono", "Propriedades anti-aging cerebrais"],
    mechanism: ["Modulação epigenética em células pineais e neurônios", "Estimulação da síntese de melatonina", "Regulação do ritmo circadiano", "Neuroproteção via expressão gênica modulada"],
    mechanismDetailed: "O Pinealon atua como citomédino específico para a glândula pineal e neurônios cerebrais, modulando genes da síntese de melatonina e da função circadiana. Complementa a ação do Epithalon focando na regulação neuroendócrina pineal.",
    timeline: [
      { period: "Dias 1-7", description: "Melhora da qualidade do sono pela regulação da melatonina." },
      { period: "Semana 2-4", description: "Regulação do ciclo circadiano e ritmos biológicos." },
      { period: "Mês 1-3", description: "Neuroproteção e anti-aging cerebral consolidados." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1mg", units: "Diária 10 dias" },
        { phase: "Duração do Ciclo", dose: "1-2x/ano", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1mg", frequency: "Diária 10 dias", duration: "1-2x/ano" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Epithalon", type: "synergic", description: "Pineal + geral anti-aging Khavinson" },
      { name: "DSIP", type: "synergic", description: "DSIP sono + Pinealon melatonina = sono premium" },
    ],
    stacks: [
      { name: "Stack Sono", peptides: ["Pinealon", "Epithalon", "DSIP"], goal: "Sono e anti-aging", description: "Regulação pineal + longevidade + sono profundo" },
    ],
  },
  48: {
    peptideId: 48,
    alternativeNames: ["PNC-27 Peptide", "p21 C-terminal analog", "Antitumor peptide"],
    classification: "Peptídeo antitumoral sintético (23 aminoácidos)",
    evidenceLevel: "Pré-clínico",
    halfLife: "~4-8 horas",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O PNC-27 é um peptídeo antitumoral sintético derivado do inibidor de CDK p21, que induz seletivamente necrose (não apoptose) em células cancerígenas. Atua se inserindo na membrana de células que superexpressam MDM-2, causando lise celular seletiva sem afetar células normais saudáveis.",
    benefits: ["Indução de necrose seletiva em células cancerígenas", "Seletividade: células normais não afetadas", "Potencial amplo espectro antitumoral", "Mecanismo distinto dos quimioterápicos convencionais", "Pesquisa oncológica promissora"],
    mechanism: ["Ligação ao MDM-2 superexpresso na membrana de células tumorais", "Inserção na membrana lipídica de células cancerígenas", "Indução de necrose celular por perturbação da membrana", "Seletividade baseada na expressão diferencial de MDM-2"],
    mechanismDetailed: "O PNC-27 contém um domínio p53 (aa 12-26) ligado a um líder de penetração de membrana. Em células tumorais, MDM-2 é expresso na membrana celular (e não apenas nuclear), servindo de receptor para o PNC-27. Após ligação, o peptídeo perfura a membrana causando lise celular necrótica. Células normais, sem MDM-2 de membrana, não são afetadas.",
    timeline: [
      { period: "Horas 1-24", description: "Ação direta nas células tumorais (em modelos in vitro)." },
      { period: "Dias 2-14", description: "Redução de massa tumoral progressiva (modelos animais)." },
      { period: "Semanas 2-4+", description: "Efeitos antitumorais sustentados em protocolos contínuos." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1-2mg", units: "3x/sem pesquisa" },
        { phase: "Duração do Ciclo", dose: "4-6 sem pesq", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1-2mg", frequency: "3x/sem pesquisa", duration: "4-6 sem pesq" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "SS-31", type: "compatible", description: "Saúde celular + PNC-27 função oncológica" },
      { name: "NAD+", type: "compatible", description: "Energia celular em contexto de pesquisa" },
    ],
    stacks: [
      { name: "Stack Oncol", peptides: ["PNC-27", "SS-31"], goal: "Pesquisa antitumoral", description: "PNC-27 antitumoral + SS-31 saúde celular" },
    ],
  },
  49: {
    peptideId: 49,
    alternativeNames: ["Ala-Glu-Asp-Tyr", "AEDY", "Biorregulador prostático"],
    classification: "Tetrapeptídeo biorregulador sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "Curta (minutos); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Prostamax é um tetrapeptídeo biorregulador sintético do Prof. Khavinson desenvolvido especificamente para a próstata. Modula a expressão gênica em células prostáticas, promovendo saúde e função da próstata e reduzindo a inflamação crônica. É indicado para suporte na hiperplasia prostática benigna e manutenção da saúde prostática.",
    benefits: ["Saúde e função prostática", "Redução da inflamação crônica da próstata", "Suporte na hiperplasia prostática benigna (HPB)", "Biorregulação celular prostática", "Melhora dos sintomas urinários"],
    mechanism: ["Modulação epigenética em células prostáticas", "Redução da inflamação local", "Regulação da proliferação celular prostática", "Suporte à função secretora da próstata"],
    mechanismDetailed: "O Prostamax atua como citomédino específico para tecido prostático, modulando a transcrição de genes relacionados à inflamação, proliferação celular e função secretora. Reduz a produção de citocinas inflamatórias locais e pode regular o crescimento de células prostáticas.",
    timeline: [
      { period: "Semana 1-2", description: "Redução inicial da inflamação prostática." },
      { period: "Semana 3-6", description: "Melhora dos sintomas urinários e função prostática." },
      { period: "Mês 2-3", description: "Saúde prostática consolidada." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "0.5-1mg", units: "Diária 10 dias" },
        { phase: "Duração do Ciclo", dose: "1-2x/ano", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "0.5-1mg", frequency: "Diária 10 dias", duration: "1-2x/ano" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Epithalon", type: "synergic", description: "Próstata + longevidade sistêmica" },
      { name: "HCG", type: "compatible", description: "Testosterona + saúde prostática" },
    ],
    stacks: [
      { name: "Stack Masculino", peptides: ["Prostamax", "Epithalon", "Testagen"], goal: "Saúde masculina", description: "Próstata + testo + longevidade" },
    ],
  },
  52: {
    peptideId: 52,
    alternativeNames: ["TP-7 Ansiolítico", "Selank Guia", "Análogo Tuftsin Ansiolítico"],
    classification: "Heptapeptídeo sintético ansiolítico (análogo de Tuftsin)",
    evidenceLevel: "Clínico Fase III",
    halfLife: "~5-10 minutos (intranasal; efeitos 4-6h)",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Selank (guia ansiolítico) é um peptídeo sintético derivado do Tuftsin, aprovado na Rússia para transtornos de ansiedade. Exerce efeitos ansiolíticos potentes sem sedação, dependência ou síndrome de abstinência, através da modulação GABAérgica e influência nos níveis de BDNF, serotonina e dopamina.",
    benefits: ["Redução potente da ansiedade sem sedação", "Melhora do humor e estabilidade emocional", "Efeitos nootrópicos (memória/aprendizado)", "Propriedades imunomoduladoras", "Sem potencial de dependência ou abstinência"],
    mechanism: ["Modulação alostérica de receptores GABA-A", "Aumento dos níveis de BDNF cerebral", "Regulação de serotonina, dopamina e norepinefrina", "Imunomodulação via porção tuftsin"],
    mechanismDetailed: "O Selank modula alostericamente receptores GABA-A, produzindo ansiolise sem sedação. Aumenta BDNF para neuroplasticidade. A porção tuftsin confere imunomodulação. Aprovado na Rússia (Pharmaсynthesis) para transtornos de ansiedade generalizada.",
    timeline: [
      { period: "Minutos 15-30", description: "Efeito ansiolítico agudo após administração intranasal." },
      { period: "Dias 1-7", description: "Redução progressiva da ansiedade basal." },
      { period: "Semana 2-4+", description: "Estabilidade emocional e melhora cognitiva consolidadas." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "IN",
      phases: [
        { phase: "Dose Principal", dose: "300-900mcg", units: "1-3x/dia" },
        { phase: "Duração do Ciclo", dose: "Ciclos 4-8 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "300-900mcg", frequency: "1-3x/dia", duration: "Ciclos 4-8 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: IN.",
    ],
    interactions: [
      { name: "Semax", type: "synergic", description: "Selank ansio + Semax cognitivo = saúde mental" },
      { name: "Oxitocina", type: "compatible", description: "Confiança social + ansiolítico" },
    ],
    stacks: [
      { name: "Stack Bem-estar", peptides: ["Selank", "Semax", "Oxitocina"], goal: "Ansiedade e cognição", description: "Ansiolítico + nootrópico + bem-estar social" },
    ],
  },
  55: {
    peptideId: 55,
    alternativeNames: ["MEHFPGP Guia", "Semax Nootrópico", "ACTH(4-10) Nootrópico"],
    classification: "Heptapeptídeo sintético nootrópico (análogo de ACTH 4-10)",
    evidenceLevel: "Clínico Fase III",
    halfLife: "~3-5 minutos (intranasal; efeitos 20-24h)",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Semax (guia nootrópico) é um neuropeptídeo sintético derivado do fragmento ACTH(4-10) aprovado na Rússia para uso clínico. Potente nootrópico e neuroprotetor sem efeitos hormonais. Melhora memória, cognição e foco, aumenta BDNF e modula múltiplos sistemas de neurotransmissão.",
    benefits: ["Melhora significativa da memória e aprendizado", "Neuroproteção contra isquemia e danos oxidativos", "Aumento do BDNF cerebral", "Melhora do foco e velocidade de processamento", "Sem efeitos hormonais (não eleva cortisol ou ACTH)"],
    mechanism: ["Aumento da expressão de BDNF no hipocampo e córtex", "Modulação dopaminérgica e serotoninérgica", "Proteção contra excitotoxicidade do glutamato", "Melhora da microcirculação cerebral"],
    mechanismDetailed: "O Semax retém os efeitos neurotróficos do ACTH sem atividade endócrina. Após administração intranasal, penetra rapidamente a barreira hematoencefálica via sistema olfatório. Aumenta BDNF, modula neurotransmissão e exerce neuroproteção. Efeitos duram 20-24h após dose única.",
    timeline: [
      { period: "Minutos 15-30", description: "Aumento imediato do foco e alerta após dose intranasal." },
      { period: "Dias 1-7", description: "Melhora progressiva da memória e velocidade de processamento." },
      { period: "Semana 2-4+", description: "Neuroproteção e ganhos cognitivos consolidados." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "IN",
      phases: [
        { phase: "Dose Principal", dose: "200-900mcg", units: "1-2x/dia" },
        { phase: "Duração do Ciclo", dose: "Ciclos 4-8 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "200-900mcg", frequency: "1-2x/dia", duration: "Ciclos 4-8 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: IN.",
    ],
    interactions: [
      { name: "Dihexa", type: "synergic", description: "Semax + Dihexa = neuroplasticidade máxima" },
      { name: "Selank", type: "synergic", description: "Cognição + ansiolítico = performance cog" },
    ],
    stacks: [
      { name: "Stack Cognitivo", peptides: ["Semax", "Dihexa", "NAD+"], goal: "Cognição premium", description: "Nootrópico potente + neuroplasticidade + energia" },
    ],
  },
  57: {
    peptideId: 57,
    alternativeNames: ["Sermorelina", "GHRH(1-29)", "Geref"],
    classification: "Análogo sintético de GHRH (29 aminoácidos)",
    evidenceLevel: "Aprovado (FDA/EMA)",
    halfLife: "~12 minutos",
    reconstitutionDifficulty: "Fácil",
    whatIs: "A Sermorelin é um análogo sintético do hormônio liberador de GH (GHRH) aprovado pela FDA para deficiência de GH em crianças e usado off-label para anti-aging e melhora da composição corporal. Estimula liberação pulsátil e fisiológica de GH sem suprimir o eixo HPG.",
    benefits: ["Estimulação fisiológica e pulsátil de GH", "Anti-aging e melhora da composição corporal", "Melhora da qualidade do sono", "Perfil de segurança superior ao GH exógeno", "Não suprime a produção endógena de GH"],
    mechanism: ["Ligação aos receptores de GHRH na hipófise anterior", "Estímulo à síntese e liberação pulsátil de GH", "GH estimula produção hepática de IGF-1", "Preservação do eixo GH-IGF-1"],
    mechanismDetailed: "A Sermorelin estimula receptores de GHRH na hipófise anterior, promovendo síntese e liberação pulsátil de GH de forma fisiológica. Diferente do GH exógeno, preserva o feedback negativo do eixo, com menor risco de efeitos colaterais. Meia-vida curta necessita de administração noturna para sincronizar com pico natural de GH.",
    timeline: [
      { period: "Semana 1-4", description: "Melhora do sono e energia. Aumento gradual de GH e IGF-1." },
      { period: "Mês 2-3", description: "Melhora da composição corporal e recuperação muscular." },
      { period: "Mês 4-6", description: "Efeitos anti-aging consolidados e mudança corporal perceptível." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "200-500mcg", units: "1x/dia noite" },
        { phase: "Duração do Ciclo", dose: "12-24 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "200-500mcg", frequency: "1x/dia noite", duration: "12-24 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Ipamorelin", type: "synergic", description: "Sermorelin GHRH + Ipamorelin GHRP fisiológico" },
      { name: "CJC-1295", type: "synergic", description: "CJC alternativa a Sermorelin — mais potente" },
    ],
    stacks: [
      { name: "Stack GH Fisiológico", peptides: ["Sermorelin", "Ipamorelin"], goal: "GH restaurado naturalmente", description: "GHRH + GHRP = GH fisiológico sem supressão" },
    ],
  },
  58: {
    peptideId: 58,
    alternativeNames: ["SLU-PP-332", "ERRγ agonist", "Exercise mimic"],
    classification: "Agonista sintético de ERRγ (receptor nuclear)",
    evidenceLevel: "Pré-clínico",
    halfLife: "Dados preliminares: ~4-8 horas",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O SLU-PP-332 é um agonista sintético do receptor nuclear ERRγ (estrogen-related receptor gamma) que mimetiza os efeitos metabólicos do exercício físico a nível molecular. Em estudos em animais, aumentou a resistência física, ativou o metabolismo de gordura e produziu adaptações musculares similares ao treinamento aeróbico sem necessidade de exercício.",
    benefits: ["Mimetiza efeitos metabólicos do exercício aeróbico", "Aumento da oxidação de ácidos graxos", "Aumento da resistência física e capacidade cardiovascular", "Biogênese mitocondrial muscular", "Potencial em doenças metabólicas e sarcopenia"],
    mechanism: ["Agonismo do receptor nuclear ERRγ em músculo e coração", "Ativação de genes de oxidação mitocondrial de gordura", "Biogênese mitocondrial via PGC-1α", "Aumento de fibras musculares tipo I (resistência)"],
    mechanismDetailed: "O SLU-PP-332 ativa ERRγ em músculo esquelético e cardíaco, reprogramando o metabolismo energético para aumentar a oxidação de ácidos graxos e a biogênese mitocondrial. Estimula a expressão de genes característicos de músculo treinado, incluindo genes de oxidação lipídica e biogênese mitocondrial mediada por PGC-1α.",
    timeline: [
      { period: "Semana 1-2", description: "Aumento da oxidação de gordura e energia." },
      { period: "Semana 3-6", description: "Melhora da resistência física e capacidade aeróbica." },
      { period: "Mês 2-3", description: "Adaptações musculares similares ao treinamento consolidadas." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC/Oral",
      phases: [
        { phase: "Dose Principal", dose: "pesquisa", units: "Conforme estudo" },
        { phase: "Duração do Ciclo", dose: "Pesquisa", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "pesquisa", frequency: "Conforme estudo", duration: "Pesquisa" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC/Oral.",
    ],
    interactions: [
      { name: "AICAR", type: "synergic", description: "Ativação de AMPK + ERRγ = mimic exercise duplo" },
      { name: "L-Carnitine", type: "synergic", description: "Transporte de ácidos graxos + biogênese" },
    ],
    stacks: [
      { name: "Stack Exercise Mimic", peptides: ["SLU-PP-332", "AICAR", "L-Carnitine"], goal: "Mimético de exercício", description: "Todos ativam metabolismo sem treino" },
    ],
  },
  59: {
    peptideId: 59,
    alternativeNames: ["Acetyl Glutamyl Heptapeptide-3", "SNAP-8 Peptide", "Octapeptide-3"],
    classification: "Octapeptídeo cosmético anti-rugas",
    evidenceLevel: "Clínico (uso cosmético)",
    halfLife: "Tópico: variável",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O SNAP-8 é um octapeptídeo sintético desenvolvido como alternativa ao Argireline (hexapeptídeo), com estrutura de 8 aminoácidos que interfere no complexo SNARE responsável pela liberação de neurotransmissores nas junções neuromusculares. Reduz as contrações musculares faciais causadoras de rugas de expressão, funcionando como um botox-like tópico.",
    benefits: ["Redução de rugas de expressão (fronte, ao redor dos olhos)", "Ação botox-like sem injeção", "Suavização de linhas de expressão dinâmicas", "Anti-aging facial tópico", "Seguro para uso cosmético regular"],
    mechanism: ["Interferência no complexo SNARE (SNAP-25) na junção neuromuscular", "Redução da liberação de acetilcolina", "Diminuição das contrações musculares faciais", "Relaxamento muscular localizado"],
    mechanismDetailed: "O SNAP-8 compete com a SNAP-25 nativa no complexo SNARE, destabilizando a ligação entre vesículas sinápticas e membrana pré-sináptica. Isso reduz a liberação de acetilcolina, diminuindo as contrações musculares faciais repetitivas causadoras de rugas dinâmicas. Estudos clínicos mostram redução de até 63% na profundidade de rugas de expressão.",
    timeline: [
      { period: "Dias 3-7", description: "Início do relaxamento muscular facial perceptível." },
      { period: "Semana 2-4", description: "Redução visível das rugas de expressão." },
      { period: "Mês 1-3", description: "Suavização consolidada das linhas de expressão dinâmicas." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "Tópico",
      phases: [
        { phase: "Dose Principal", dose: "2x/dia tópico", units: "Manhã e noite" },
        { phase: "Duração do Ciclo", dose: "Uso contínuo", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "2x/dia tópico", frequency: "Manhã e noite", duration: "Uso contínuo" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: Tópico.",
    ],
    interactions: [
      { name: "GHK-Cu", type: "synergic", description: "SNAP-8 relaxamento + GHK-Cu colágeno" },
      { name: "Argireline", type: "synergic", description: "Hexapeptídeo sinérgico ao SNAP-8" },
    ],
    stacks: [
      { name: "Stack Anti-Rugas", peptides: ["SNAP-8", "GHK-Cu", "Epithalon"], goal: "Anti-wrinkle completo", description: "Botox-like + colágeno + telômeros" },
    ],
  },
  64: {
    peptideId: 64,
    alternativeNames: ["Ala-Glu-Asp-Gly testicular", "AEDG Testicular", "Citomédino testicular"],
    classification: "Tetrapeptídeo biorregulador sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "Curta (minutos); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Testagen é um tetrapeptídeo biorregulador sintético do Prof. Khavinson desenvolvido especificamente para tecido testicular. Modula a expressão gênica em células de Leydig e Sertoli, promovendo a função testicular, produção de testosterona e espermatogênese. Indicado para suporte da saúde testicular masculina.",
    benefits: ["Suporte à função testicular", "Manutenção da produção de testosterona", "Suporte à espermatogênese", "Saúde reprodutiva masculina", "Anti-aging do tecido testicular"],
    mechanism: ["Modulação epigenética em células de Leydig e Sertoli", "Estimulação da esteroidogênese testicular", "Suporte à espermatogênese", "Regulação da função testicular"],
    mechanismDetailed: "O Testagen atua como citomédino específico para tecido testicular, modulando genes de esteroidogênese nas células de Leydig e genes de suporte espermatogênico nas células de Sertoli. Pode ajudar a preservar a função testicular com o envelhecimento (hipogonadismo relacionado à idade).",
    timeline: [
      { period: "Semana 1-2", description: "Modulação inicial da função testicular." },
      { period: "Semana 3-6", description: "Melhora da produção hormonal testicular." },
      { period: "Mês 2-3", description: "Saúde testicular consolidada e função reprodutiva." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "0.5-1mg", units: "Diária 10 dias" },
        { phase: "Duração do Ciclo", dose: "1-2x/ano", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "0.5-1mg", frequency: "Diária 10 dias", duration: "1-2x/ano" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "HCG", type: "compatible", description: "Testosterona local + saúde testicular bioreg" },
      { name: "Epithalon", type: "synergic", description: "Longevidade testicular anti-aging" },
    ],
    stacks: [
      { name: "Stack Masculino", peptides: ["Testagen", "HCG", "Kisspeptin"], goal: "Saúde testicular", description: "Biorregulador + estímulo LH + HPG central" },
    ],
  },
  67: {
    peptideId: 67,
    alternativeNames: ["Ala-Glu-Asp-Lys Vascular", "AEDK Vascular", "Biorregulador vascular"],
    classification: "Tetrapeptídeo biorregulador sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "Curta (minutos); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Vesugen é um tetrapeptídeo biorregulador sintético do Prof. Khavinson desenvolvido para o sistema vascular. Modula a expressão gênica em células endoteliais e musculares lisas vasculares, promovendo a saúde e integridade dos vasos sanguíneos. Indicado para suporte cardiovascular e prevenção de doenças vasculares.",
    benefits: ["Proteção endotelial e saúde vascular", "Melhora da circulação sanguínea", "Redução da inflamação vascular", "Suporte em doenças cardiovasculares", "Anti-aging vascular"],
    mechanism: ["Modulação epigenética em células endoteliais", "Estimulação da produção de óxido nítrico", "Redução da inflamação vascular", "Regulação da proliferação de células musculares lisas"],
    mechanismDetailed: "O Vesugen atua como citomédino para células endoteliais e musculares lisas vasculares, modulando genes de produção de óxido nítrico, inflamação e integridade da parede vascular. Pode contribuir para a melhora da função endotelial e prevenção da aterosclerose.",
    timeline: [
      { period: "Semana 1-2", description: "Melhora inicial da microcirculação." },
      { period: "Semana 3-6", description: "Redução da inflamação vascular e melhora da circulação." },
      { period: "Mês 2-3", description: "Saúde vascular consolidada e proteção endotelial." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "0.5-1mg", units: "Diária 10 dias" },
        { phase: "Duração do Ciclo", dose: "1-2x/ano", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "0.5-1mg", frequency: "Diária 10 dias", duration: "1-2x/ano" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "SS-31", type: "synergic", description: "Coração + mitocôndrias + vasos = cardio total" },
      { name: "NAD+", type: "synergic", description: "Energia celular + proteção vascular" },
    ],
    stacks: [
      { name: "Stack Vascular", peptides: ["Vesugen", "SS-31", "NAD+"], goal: "Saúde cardiovascular", description: "Vascular + mitocôndria + energia cardíaca" },
    ],
  },
  68: {
    peptideId: 68,
    alternativeNames: ["Lys-Glu", "KE Dipeptide", "Vilon dipeptídeo"],
    classification: "Dipeptídeo biorregulador sintético",
    evidenceLevel: "Pré-clínico",
    halfLife: "Curta (minutos); efeitos prolongados",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Vilon é um dipeptídeo biorregulador sintético (Lys-Glu) do Prof. Khavinson, um dos menores peptídeos bioativos conhecidos. Atuando principalmente no sistema imunológico, modula a expressão gênica em células tímicas e linfócitos, promovendo a regeneração imunológica e retardando o envelhecimento do sistema imune.",
    benefits: ["Imunomodulação e regeneração tímica", "Retardo do envelhecimento imunológico (imunosenescência)", "Melhora da função de células T e NK", "Redução da suscetibilidade a infecções", "Anti-aging do sistema imune"],
    mechanism: ["Modulação epigenética em timócitos e linfócitos", "Estimulação da regeneração tímica", "Regulação da expressão de citocinas imunes", "Suporte às células T imaturas"],
    mechanismDetailed: "O Vilon (Lys-Glu) é o dipeptídeo biorregulador mais estudado do Prof. Khavinson. Modula a expressão gênica em células tímicas e linfócitos, estimulando a regeneração do timo e a maturação de células T. Demonstrou redução da imunosenescência em estudos longitudinais.",
    timeline: [
      { period: "Semana 1-2", description: "Ativação inicial da regeneração tímica." },
      { period: "Semana 3-6", description: "Melhora da função de células T e resposta imune." },
      { period: "Mês 2-3", description: "Redução da imunosenescência consolidada." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "0.5-1mg", units: "Diária 10 dias" },
        { phase: "Duração do Ciclo", dose: "1-2x/ano", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "0.5-1mg", frequency: "Diária 10 dias", duration: "1-2x/ano" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "Livagen", type: "synergic", description: "Vilon + Livagen = timo + imunidade Khavinson" },
      { name: "Epithalon", type: "synergic", description: "Timo + imunidade + longevidade sistêmica" },
    ],
    stacks: [
      { name: "Stack Imune", peptides: ["Vilon", "Livagen", "Epithalon"], goal: "Longevidade imune", description: "Timo + leucócitos + longevidade = anti-aging imune" },
    ],
  },
  69: {
    peptideId: 69,
    alternativeNames: ["Tesamorelin + Ipamorelin Blend", "GHRH + GHRP Combo", "GH Stack Blend"],
    classification: "Blend sinérgico de GHRH + GHRP (análogos peptídicos)",
    evidenceLevel: "Clínico Fase II (componentes individuais)",
    halfLife: "Tesamorelin: ~26-38 min; Ipamorelin: ~2h",
    reconstitutionDifficulty: "Fácil",
    whatIs: "O Blend Tesamorelin + Ipamorelin combina dois peptídeos com mecanismos complementares: Tesamorelin (análogo de GHRH que estimula a hipófise) e Ipamorelin (GHRP seletivo que amplifica a resposta). Juntos produzem liberação sinérgica de GH 3-5x superior a cada um isoladamente, sem elevar cortisol ou prolactina.",
    benefits: ["Liberação sinérgica de GH 3-5x superior aos peptídeos isolados", "Redução de gordura visceral (ação Tesamorelin)", "Sem elevação de cortisol ou prolactina (seletividade Ipamorelin)", "Melhora da composição corporal e recuperação muscular", "Sono mais profundo e reparador"],
    mechanism: ["Tesamorelin ativa receptores GHRH na hipófise (amplifica pool de GH)", "Ipamorelin ativa receptores GHS-R1a (libera GH seletivamente)", "Ação sinérgica: GHRH + GHRP = liberação máxima de GH", "IGF-1 aumentado mediando efeitos anabólicos"],
    mechanismDetailed: "A combinação explora a fisiologia dual do eixo GH: GHRH (Tesamorelin) aumenta a síntese e o pool disponível de GH na hipófise, enquanto o GHRP (Ipamorelin) desencadeia a liberação. Juntos, agem sinergicamente produzindo liberação de GH significativamente maior que qualquer um isolado. O Ipamorelin é o GHRP mais seletivo, sem elevar cortisol/prolactina.",
    timeline: [
      { period: "Semana 1-2", description: "Melhora imediata da qualidade do sono e recuperação." },
      { period: "Semana 3-6", description: "Aumento de IGF-1 e início da mudança na composição corporal." },
      { period: "Mês 2-3", description: "Redução de gordura visceral e ganho de massa magra consolidados." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "100-200mcg cada", units: "2x/dia noite" },
        { phase: "Duração do Ciclo", dose: "12-16 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "100-200mcg cada", frequency: "2x/dia noite", duration: "12-16 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "GHK-Cu", type: "compatible", description: "Blend GH + pele regenerada via IGF-1" },
      { name: "NAD+", type: "synergic", description: "Longevidade + GH = anti-aging completo" },
    ],
    stacks: [
      { name: "Stack GH Anti-Aging", peptides: ["Tesamorelin+Ipamorelin", "NAD+", "GHK-Cu"], goal: "GH + longevidade", description: "O blend GH mais completo para anti-aging" },
    ],
  },
  70: {
    peptideId: 70,
    alternativeNames: ["Elamipretide", "Bendavia", "MTP-131", "SS-31"],
    classification: "Tetrapeptídeo mitocondrial dirigido à cardiolipina",
    evidenceLevel: "Clínico Fase III",
    halfLife: "~4-6 horas",
    reconstitutionDifficulty: "Moderada",
    whatIs: "O SS-31 (Elamipretide) é um peptídeo inovador que tem como alvo direto as mitocôndrias, ligando-se à cardiolipina na membrana mitocondrial interna. Diferente de antioxidantes comuns, atua na fonte, otimizando a eficiência mitocondrial e prevenindo produção excessiva de radicais livres. É um dos bioenergéticos mais potentes em desenvolvimento clínico para longevidade.",
    benefits: ["Melhora significativa da função e energia mitocondrial", "Proteção do coração e rins contra danos oxidativos", "Aumento da resistência física e recuperação muscular", "Efeitos neuroprotetores e clareza mental", "Redução da inflamação de origem mitocondrial"],
    mechanism: ["Ligação seletiva à cardiolipina da membrana mitocondrial interna", "Otimização da cadeia de transporte de elétrons", "Redução do vazamento de elétrons (radicais livres)", "Aumento da produção de ATP", "Manutenção da estrutura das cristas mitocondriais"],
    mechanismDetailed: "O SS-31 liga-se seletivamente à cardiolipina, um fosfolipídio único da membrana mitocondrial interna. Ao estabilizar a cardiolipina, otimiza a cadeia de transporte de elétrons, reduz vazamento de elétrons e aumenta eficiência na produção de ATP. Também ajuda a manter a estrutura física das cristas mitocondriais, essencial para a função ótima da mitocôndria.",
    timeline: [
      { period: "Dias 1-7", description: "Aumento de energia e redução da fadiga mitocondrial." },
      { period: "Semana 2-4", description: "Melhora da performance física e recuperação muscular." },
      { period: "Mês 1-3", description: "Proteção cardíaca/renal e efeitos anti-aging consolidados." },
    ],
    protocol: {
      title: "Protocolo de Uso",
      route: "SC",
      phases: [
        { phase: "Dose Principal", dose: "1-5mg", units: "3-5x/sem" },
        { phase: "Duração do Ciclo", dose: "8-12 sem", units: "Conforme objetivo" },
      ],
    },
    dosageByIndication: [
      { indication: "Uso geral", dose: "1-5mg", frequency: "3-5x/sem", duration: "8-12 sem" },
    ],
    reconstitution: [
      "Reconstituir com 1-2mL de água bacteriostática.",
      "Agitar suavemente até dissolver. Não agitar vigorosamente.",
      "Armazenar a 2-8°C. Usar em até 30 dias após reconstituição.",
      "Via de administração: SC.",
    ],
    interactions: [
      { name: "NAD+", type: "synergic", description: "SS-31 mitoc + NAD+ coenzima = longevidade" },
      { name: "Epithalon", type: "synergic", description: "Telômeros + mitocôndria = anti-aging celular" },
    ],
    stacks: [
      { name: "Stack Mitocond", peptides: ["SS-31", "NAD+", "MOTS-C"], goal: "Saúde mitocondrial", description: "Cardiolipina + NAD+ + metaboloma = longevidade" },
    ],
  },
};

export function getPeptideDetail(id: number): PeptideDetail | undefined {
  return PEPTIDE_DETAILS[id];
}
