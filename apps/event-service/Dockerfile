FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copy source code
COPY libs ./libs
COPY apps/event-service ./apps/event-service

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build event-service

# Start the application
CMD ["node", "dist/apps/event-service/main"]