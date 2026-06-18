# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* yarn.lock* bun.lockb* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build
RUN rm -rf .next/cache

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json* yarn.lock* bun.lockb* ./
RUN npm ci --omit=dev

# Copy built app from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
