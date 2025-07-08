# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package manifests and install all dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the TypeScript code
FROM deps AS builder
WORKDIR /app

# Copy source files and compile
COPY . .
RUN npm run build          # Assumes this outputs JS into `dist/`

# Stage 3: Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy package manifests and install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the compiled output from the builder stage
COPY --from=builder /app/dist ./dist

# Ensure production environment
ENV NODE_ENV=production

# Expose the port your Fastify server listens on (default: 3000)
EXPOSE 3000

# Start the server from the compiled output
CMD ["node", "--loader", "tsconfig-paths/dist/esm-loader.js", "dist/index.js"]

