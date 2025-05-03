# Multi-stage Dockerfile for Vite/React app: supports dev (hot reload) and prod
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Development image (default)
FROM base AS dev
ENV NODE_ENV=development
EXPOSE 8080
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]

# Production build
FROM base AS builder
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=builder /app .
RUN npm install -g serve
ENV NODE_ENV=production
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
