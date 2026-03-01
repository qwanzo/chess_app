# Chess App – Production Dockerfile for Koyeb & Hugging Face Spaces

# Use official Node.js LTS image for security and stability
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies (only package.json and package-lock.json first for better caching)
COPY package*.json ./
RUN npm ci --production

# Copy application source
COPY src/ ./src/
COPY public/ ./public/

# Expose port (Hugging Face Spaces and Koyeb will route traffic to this port)
EXPOSE 7860
EXPOSE 5500

# Set environment variables for production
ENV NODE_ENV=production

# Healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-7860}/health || exit 1

# Start the server (listen on 0.0.0.0 for Hugging Face Spaces compatibility)
ENV HOST=0.0.0.0
CMD [ "node", "src/index.js" ]
