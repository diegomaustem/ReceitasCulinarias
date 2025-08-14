FROM node:22 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.json ./

RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY src ./src
COPY swaggerConfig* ./


RUN npm run build || (echo "ERRO: npm run build falhou!" && exit 1)

# Estágio de produção (production stage)
# Utiliza uma imagem Node.js mais leve (alpine) para o ambiente de execução.
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json .
COPY --from=builder /app/swaggerConfig* ./

RUN npm prune --production && \
    rm -rf /usr/local/share/.cache /root/.npm

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && node --enable-source-maps dist/index.js"]
