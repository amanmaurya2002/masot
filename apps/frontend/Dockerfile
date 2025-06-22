# ---- Frontend (Next.js) ----
# 1. Build stage
FROM node:20 AS builder
WORKDIR /app

# Install deps (package.json + lock)
COPY package*.json .
RUN npm ci --omit=dev

# Copy source
COPY . .

# Provide backend URL at build-time (can be overridden at runtime)
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Build the Next.js app
RUN npm run build

# 2. Production stage
FROM node:20 AS runner
WORKDIR /app

# Only copy the built output and minimal files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

EXPOSE 3000

CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"] 