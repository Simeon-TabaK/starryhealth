# Étape 1 : Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copie des définitions de dépendances et des fichiers Prisma
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

ENV NODE_ENV=development

# Installation de toutes les dépendances (y compris devDependencies nécessaires pour le build)
RUN npm install --include=dev

# Copie du reste du code source
COPY . .

# Génération explicite pour garantir la présence du client compilé
RUN npx prisma generate

# Build de l'application Next.js en mode production
ENV NODE_ENV=production
RUN npm run build


# Étape 2 : Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 1. Copier standalone EN PREMIER (inclut server.js + node_modules minimal)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 2. Copier les fichiers supplémentaires
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# 3. Copier node_modules COMPLET PAR-DESSUS le minimal de standalone
#    (nécessaire pour prisma migrate deploy, dotenv, pg, etc.)
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port
EXPOSE 3000

# Exécuter les migrations Prisma puis lancer le serveur Next.js compilé
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]