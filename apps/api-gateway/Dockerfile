FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

RUN npm ci

# Copy configuration files
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copy source code
COPY libs ./libs
COPY apps/api-gateway ./apps/api-gateway

# Build the application
RUN npm run build api-gateway

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/apps/api-gateway/main"]