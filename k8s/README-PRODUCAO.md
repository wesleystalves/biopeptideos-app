# 🚀 Deploy de Produção — BioPeptideos

## Pré-requisitos na máquina de produção (170.244.65.46)

- K3s instalado
- ArgoCD instalado no namespace `argocd`
- cert-manager com ClusterIssuer `letsencrypt-prod` (HTTP-01)
- Traefik como Ingress controller

---

## 1. DNS — Hostinger

Certifique-se que os registros estão configurados:

| Tipo | Host | Valor |
|------|------|-------|
| A | `*` | `170.244.65.46` |
| A | `@` | `170.244.65.46` |

Domínios mapeados:
- `peptideosbio.com` → Plataforma cliente
- `www.peptideosbio.com` → Plataforma cliente
- `api.peptideosbio.com` → API Backend
- `ebook-pep.peptideosbio.com` → Landing page ebook

---

## 2. Secrets — Configurar antes do deploy

```bash
# Editar o arquivo com os valores REAIS antes de aplicar
vim k8s/production.yaml

# Ou criar via kubectl diretamente:
kubectl create namespace biopeptidios

kubectl create secret generic biopeptidios-secrets \
  --namespace biopeptidios \
  --from-literal=DATABASE_URL="postgresql://biopeptidios:SENHA@biopeptidios-postgres:5432/biopeptidios" \
  --from-literal=JWT_SECRET="SEU_JWT_SECRET_FORTE_32CHARS" \
  --from-literal=RESEND_API_KEY="re_SUA_CHAVE_RESEND" \
  --from-literal=RESEND_FROM="BioPeptideos <noreply@peptideosbio.com>" \
  --from-literal=ASAAS_API_KEY="SUA_CHAVE_ASAAS_PRODUCAO" \
  --from-literal=ASAAS_WEBHOOK_SECRET="SEU_WEBHOOK_SECRET" \
  --from-literal=APP_URL="https://peptideosbio.com" \
  --from-literal=PRICE_BASIC="9.90" \
  --from-literal=PRICE_PREMIUM="29.90"
```

---

## 3. Build e push das imagens

> **Importante:** A máquina de produção usa `imagePullPolicy: Never`. 
> Você precisa buildar as imagens **na máquina de produção** ou usar um registry privado.

### Opção A — Build direto na máquina de produção

```bash
# Na máquina de produção (170.244.65.46):
git clone https://github.com/wesleystalves/biopeptideos-app.git
cd biopeptideos-app

# Backend (API)
docker build -t biopeptidios-api:v11 -f backend/Dockerfile backend/
docker save biopeptidios-api:v11 | sudo k3s ctr images import -

# Frontend
docker build -t biopeptidios-web:v5 -f frontend/Dockerfile frontend/
docker save biopeptidios-web:v5 | sudo k3s ctr images import -
```

### Opção B — Registry privado (recomendado para CI/CD real)

1. Configurar registry (ex: Docker Hub, GitHub Container Registry)
2. Alterar `imagePullPolicy: Never` → `IfNotPresent` no `k8s/production.yaml`
3. Adicionar Secret de pull do registry

---

## 4. Deploy via ArgoCD

```bash
# Na máquina de produção:
# Criar a Application no ArgoCD
kubectl apply -f k8s/argocd-app.yaml

# Verificar sincronização
kubectl get application biopeptidios -n argocd

# Forçar sync se necessário
argocd app sync biopeptidios
```

---

## 5. Deploy manual (sem ArgoCD)

```bash
# Aplicar todos os manifestos de produção
kubectl apply -f k8s/production.yaml

# Verificar status
kubectl get pod -n biopeptidios
kubectl get ingress -n biopeptidios
```

---

## 6. Migração do banco de dados

```bash
# Após o pod da API estar running, rodar as migrations:
API_POD=$(kubectl get pod -n biopeptidios -l app=biopeptidios-api -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n biopeptidios "$API_POD" -- npx prisma migrate deploy
```

---

## 7. Criar usuário admin inicial

```bash
API_POD=$(kubectl get pod -n biopeptidios -l app=biopeptidios-api -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n biopeptidios "$API_POD" -- node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash('SUA_SENHA_ADMIN', 10);
  const user = await prisma.profile.upsert({
    where: { email: 'admin@peptideosbio.com' },
    update: { isAdmin: true, password: hash, plan: 'premium' },
    create: { email: 'admin@peptideosbio.com', name: 'Admin', password: hash, isAdmin: true, plan: 'premium' }
  });
  console.log('Admin:', user.email);
  await prisma.\$disconnect();
}
main();
"
```

---

## 8. Configurar Asaas para produção

No painel do Asaas Produção:
1. Minha Conta → Informações → Site: `https://peptideosbio.com`
2. Configurações → Notificações → Webhook URL: `https://api.peptideosbio.com/api/payments/ebook-webhook`

---

## Verificação final

```bash
# Checar todos os pods
kubectl get pod -n biopeptidios

# Checar certificados TLS
kubectl get certificate -n biopeptidios

# Testar API
curl https://api.peptideosbio.com/api/health

# Testar plataforma
curl -o /dev/null -w "%{http_code}" https://peptideosbio.com
```
