
# Chess App – Production Dockerfile for Koyeb

# Use official Node.js LTS image for security and stability
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (only package.json and package-lock.json first for better caching)
COPY package*.json ./
RUN npm ci --production

# Copy application source
COPY src/ ./src/
COPY public/ ./public/

# Expose port (Koyeb will route traffic to this port)
EXPOSE 5500

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=5500

# Healthcheck for Koyeb (optional, but recommended)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5500/health || exit 1

# Start the server
CMD ["node", "src/index.js"]
