# Base stage for installing dependencies
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development stage for installing all dependencies
FROM base AS development
RUN npm ci
COPY . .

# Build stage for creating production builds
FROM development AS build
ARG SERVICE_NAME
RUN npm run build ${SERVICE_NAME}

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
ARG SERVICE_NAME
COPY --from=build /app/dist/apps/${SERVICE_NAME} /app/dist
COPY --from=build /app/node_modules /app/node_modules
CMD ["node", "/app/dist/main"]