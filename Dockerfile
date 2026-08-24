# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY prisma ./prisma
# Install all deps needed for Next build (Tailwind, TypeScript, etc.)
RUN npm ci

FROM node:20-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Dummy URL is enough for `prisma generate` + Next compile (pages are force-dynamic)
ENV DATABASE_URL="file:./prisma/build.db"
ENV AUTH_SECRET="build-time-only"
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate && npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Do NOT mkdir /data here — an empty /data folder is still ephemeral and used
# to falsely look like a Railway volume. Attach a real Volume at /data instead.
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
# Seed + start-prod import these at runtime (tsx) — must ship with the image
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/config ./config
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000
# Direct tsx — avoid nested `npm run` SIGTERM noise on redeploy.
CMD ["./node_modules/.bin/tsx", "scripts/start-prod.ts"]
