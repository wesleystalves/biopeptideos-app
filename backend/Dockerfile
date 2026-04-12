FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar node_modules completo do host (pré-instalado com as deps corretas)
COPY node_modules ./node_modules
COPY dist ./dist
COPY prisma ./prisma
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/main.js"]
