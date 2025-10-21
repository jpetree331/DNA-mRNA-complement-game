# Use Node 20 Alpine for smaller image size
FROM node:20-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install only backend dependencies
RUN npm ci --omit=dev

# Copy backend source code
COPY backend/ .

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start the application
CMD ["npm", "start"]
