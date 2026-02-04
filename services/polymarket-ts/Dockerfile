FROM oven/bun:1-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy source and build
COPY . .
RUN bun run build

# Production stage
FROM oven/bun:1-alpine
WORKDIR /app

# Copy built files and dependencies
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Expose port
EXPOSE 3001

# Run with Bun
CMD ["bun", "dist/index.js"]
