# Multi-stage build for React Vite application (ULTRA PERFORMANCE)
FROM node:20-alpine AS builder

# Install performance optimization tools
RUN apk add --no-cache python3 make g++ && \
    npm install -g @swc/cli @swc/core

# Set working directory
WORKDIR /app

# Copy package files for aggressive caching
COPY package.json package-lock.json* ./

# Install all dependencies (build requires dev dependencies)
RUN npm ci --silent --no-audit --no-fund && \
    npm cache clean --force

# Copy source code
COPY . .

# PERFORMANCE BUILD: Tree-shaking, minification, compression
RUN NODE_ENV=production npm run build && \
    # Remove source maps for production
    find dist -name "*.map" -delete && \
    # Compress assets
    find dist -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) \
    -exec gzip -k9 {} \;

# Production stage with nginx
FROM nginx:alpine AS runtime

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]