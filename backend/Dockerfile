# Build stage — usar Debian Bookworm com OpenSSL 3
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Instalar openssl e certificados
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copiar manifiestos primeiro
COPY package*.json ./
COPY prisma ./prisma/

# Instalar deps
RUN npm ci

# Schema já define binaryTargets, gerar client
RUN npx prisma generate

# Copiar resto do código-fonte e compilar
COPY . .
RUN npm run build

# Production stage
FROM node:20-bookworm-slim AS runner

WORKDIR /app

# Instalar libssl no runner também
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main"]
