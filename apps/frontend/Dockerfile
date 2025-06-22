# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json ./
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV APP_ENV=development

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltekit

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/. .

# Fix permissions for dev server
RUN chown -R sveltekit:nodejs /app

USER sveltekit

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Entrypoint: run dev server by default, prod if APP_ENV=production
CMD ["sh", "-c", "if [ \"$APP_ENV\" = 'production' ]; then npm start; else npm run dev -- --host 0.0.0.0 --port 3000; fi"]