# ─── Starry Vitrine ─ Dockerfile pour Coolify ───────────────────────────────────

# Étape 1 : Builder
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl curl
WORKDIR /app

# Copie des définitions de dépendances et des fichiers Prisma
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

ENV NODE_ENV=development

# Installation de toutes les dépendances avec --ignore-scripts pour éviter les erreurs de spawnSync sur overlayfs (esbuild ETXTBSY)
RUN npm install --include=dev --ignore-scripts

# Copie du reste du code source
COPY . .

# Génération du client Prisma (output: src/generated/prisma)
RUN npx prisma generate

# Build Next.js en mode production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_WHATSAPP_NUMBER="+243969131138"
ARG NEXT_PUBLIC_CONTACT_PHONE="+243 969 131 138"
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER
ENV NEXT_PUBLIC_CONTACT_PHONE=$NEXT_PUBLIC_CONTACT_PHONE
RUN npm run build


# Étape 2 : Runner
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl curl
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# 1. Copier standalone EN PREMIER (inclut server.js + node_modules minimal)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 2. Copier les fichiers supplémentaires
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# 3. Copier node_modules COMPLET (contient .prisma, @prisma, pg, etc.)
COPY --from=builder /app/node_modules ./node_modules

# 4. Copier le client Prisma généré (output custom: src/generated/prisma)
COPY --from=builder /app/src/generated ./src/generated

# Exposer le port
EXPOSE 3000

# Health Check pour Coolify — toujours 200
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Migrations (non-bloquantes) puis démarrage
# Le "|| true" permet au serveur de démarrer même si la migration échoue
CMD ["sh", "-c", "npx prisma migrate deploy || true && node server.js"]
