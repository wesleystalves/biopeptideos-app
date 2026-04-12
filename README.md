# BioPeptidios — SaaS E-commerce + CRM + AI Platform

Plataforma global de vendas de peptídeos com:

- **E-commerce** com compliance por país (ComplianceEngine)
- **CRM** com funil de vendas e lead scoring
- **IA vendedora** (multi-canal: WhatsApp, Telegram, Email, Chat)
- **Backend NestJS** + Prisma + PostgreSQL
- **Multi-tenant** preparado para escala global
- **K8s / ArgoCD** para deploy automatizado

## Status: 🔒 PRE-LAUNCH (modo dev)

> Sistema em desenvolvimento. Vendas bloqueadas até aprovação legal por país.

## Domínio Temporário

`https://biopeptidios.dev.aiwhatsapp.com.br`

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend API | NestJS + TypeScript |
| ORM | Prisma |
| DB | PostgreSQL 15 |
| Cache | Redis |
| Frontend | Next.js (em desenvolvimento) |
| IA | OpenAI GPT |
| WhatsApp | Evolution API |
| Infra | Kubernetes + ArgoCD |
| Pagamento | Stripe + Asaas |

## Estrutura

```
biopeptidios/
├── backend/          # API NestJS (6 módulos)
├── frontend/         # Next.js SaaS (em breve)
├── infra/            # K8s manifests
└── docs/             # Arquitetura e decisões
```

## Desenvolvimento local

```bash
cd backend
npm install
npx prisma generate
npm run dev
```
