# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create .svelte-kit directory with proper permissions
RUN mkdir -p .svelte-kit

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Run development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]