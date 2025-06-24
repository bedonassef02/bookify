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
COPY apps/user-service ./apps/user-service

# Build the application
RUN npm run build user-service

# Start the application
CMD ["node", "dist/apps/user-service/main"]