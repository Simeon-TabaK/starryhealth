# Étape 1 : Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code source
COPY . .

# Générer Prisma client
RUN npx prisma generate

# Builder l'application Next.js
RUN npm run build


# Étape 2 : Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# Exposer le port
EXPOSE 3000

# Déployer les migrations Prisma avant de lancer Next.js
CMD npx prisma migrate deploy && npm run start
