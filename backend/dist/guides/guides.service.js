"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuidesService = void 0;
const common_1 = require("@nestjs/common");
const GUIDES = [
    {
        id: '1',
        slug: 'injecao-subcutanea',
        title: 'Guia Completo de Injeção Subcutânea (SubQ)',
        description: 'Passo a passo para reconstituição e aplicação subcutânea segura.',
        category: 'Técnica',
        isFree: true,
        content: `
# Injeção Subcutânea (SubQ)

## O que é?
A injeção subcutânea é a forma mais comum de administrar peptídeos. O líquido é injetado
no tecido adiposo logo abaixo da pele, geralmente na região abdominal.

## Materiais Necessários
- Seringa de insulina 1ml (agulha 4-8mm x 0.23-0.3mm)
- Álcool 70% + algodão
- Água bacteriostática (para reconstituição)
- Peptídeo liofilizado

## Passos
1. Lave as mãos rigorosamente por 20 segundos
2. Limpe o frasco com algodão embebido em álcool 70%
3. Reconstituir conforme protocolo do peptídeo
4. Aspire a dose calculada
5. Pinça a pele do abdômen com dois dedos
6. Introduza a agulha a 45° numa prega de pele
7. Injete lentamente (2-3 segundos)
8. Retire a agulha e aplique leve pressão com algodão
9. Alterne os pontos de aplicação
    `,
    },
    {
        id: '2',
        slug: 'reconstituicao-peptideos',
        title: 'Reconstituição de Peptídeos',
        description: 'Como reconstituir peptídeos com água bacteriostática ou salina.',
        category: 'Técnica',
        isFree: true,
        content: `
# Reconstituição de Peptídeos

## Por que reconstituir?
Peptídeos são fornecidos em forma liofilizada (pó) para estabilidade no transporte e armazenamento.
A reconstituição transforma o pó em solução injetável.

## Solventes mais utilizados
- **Água bacteriostática**: melhor opção — contém álcool benzílico que inibe crescimento bacteriano
- **Salina bacteriostática** (0.9% NaCl + bacteriostático)
- **Água estéril**: usar apenas se bacteriostática não estiver disponível

## Calculando o volume de diluição
Exemplo: 5mg de BPC-157 em frasco:
- Adicione 2ml de água bacteriostática → concentração = 2500mcg/ml (2.5mg/ml)
- Dose de 250mcg = 0.1ml = 10 unidades na seringa de insulina U-100

## Passos
1. Assepsia: limpe o frasco com álcool 70%
2. Insira a agulha na parede lateral do frasco (não direto no pó)
3. Adicione o solvente aos poucos pela parede
4. Role suavemente — NUNCA agite!
5. Armazene em geladeira (2-8°C)
6. Use em até 30 dias após reconstituição
    `,
    },
    {
        id: '3',
        slug: '7-erros-fatais',
        title: '7 Erros Fatais com Peptídeos',
        description: 'Os erros mais comuns que comprometem a eficácia e segurança do protocolo.',
        category: 'Segurança',
        isFree: false,
        content: `
# 7 Erros Fatais com Peptídeos

## 1. Agitar o frasco após reconstituição
Peptídeos são moléculas delicadas. Agitar quebra as ligações e desnatura a proteína.
**Correto**: Role suavemente.

## 2. Usar água destilada ou mineral
Água não bacteriostática favorece contaminação bacteriana.
**Correto**: Use sempre água bacteriostática ou salina bacteriostática.

## 3. Congelar após reconstituição
Ciclos de congelamento/descongelamento degradam o peptídeo.
**Correto**: Mantenha refrigerado entre 2-8°C.

## 4. Ignorar a meia-vida
Secretagogos como GHRP-6 têm meia-vida de 15-60 min. Aplicar longe do pico natural é desperdiçar a dose.
**Correto**: Estude o timing de cada peptídeo.

## 5. Não fazer ciclagem
Uso contínuo por meses gera down-regulation de receptores.
**Correto**: 6-8 semanas de uso, 2-4 de pausa.

## 6. Misturar peptídeos incompatíveis
Ex: GHRH + GHRP é sinérgico. Mas GLP-1 agonistas + insulina requerem monitoramento glicêmico rigoroso.
**Correto**: Pesquise interações antes de combinar.

## 7. Ignorar a qualidade do fornecedor
Peptídeos de baixa pureza têm impurezas que causam reações inflamatórias.
**Correto**: Sempre peça CoA (Certificate of Analysis) do lote.
    `,
    },
];
let GuidesService = class GuidesService {
    findAll(isPremium = false) {
        if (!isPremium) {
            return GUIDES.filter((g) => g.isFree).map(({ content, ...g }) => g);
        }
        return GUIDES.map(({ content, ...g }) => g);
    }
    findBySlug(slug, isPremium = false) {
        const guide = GUIDES.find((g) => g.slug === slug);
        if (!guide)
            return null;
        if (!isPremium && !guide.isFree) {
            const { content, ...rest } = guide;
            return { ...rest, locked: true };
        }
        return guide;
    }
};
exports.GuidesService = GuidesService;
exports.GuidesService = GuidesService = __decorate([
    (0, common_1.Injectable)()
], GuidesService);
//# sourceMappingURL=guides.service.js.map