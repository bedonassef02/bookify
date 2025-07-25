FROM node:18-alpine

WORKDIR /app

ARG SERVICE_NAME

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build ${SERVICE_NAME}

CMD ["node", "/app/dist/apps/${SERVICE_NAME}/main"]