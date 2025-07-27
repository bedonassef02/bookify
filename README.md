# Bookify - Event Booking Microservices Backend

Bookify is a comprehensive event booking platform built with a microservices architecture using Node.js and the NestJS framework. This repository contains the backend services that power the platform, handling everything from user management and event creation to booking, payments, and notifications.

## Architecture

The Bookify backend is composed of several independent microservices, each responsible for a specific domain. Communication between services is primarily handled via RabbitMQ, ensuring a decoupled and scalable system. An API Gateway acts as the single entry point for all client requests.

### Core Services:

*   **API Gateway (`api-gateway`):** The primary entry point for all external requests. It routes requests to the appropriate microservices, handles authentication, and aggregates responses.
*   **User Service (`user-service`):** Manages user accounts, authentication (JWT, local, Google OAuth2.0), and user profiles.
*   **Event Service (`event-service`):** Handles the creation, management, and retrieval of events, including event categories and ticket tiers.
*   **Booking Service (`booking-service`):** Manages event bookings, ticket reservations, and integrates with the payment service.
*   **Payment Service (`payment-service`):** Integrates with Stripe to process payments for bookings and manages payment-related workflows.
*   **Notification Service (`notification-service`):** Responsible for sending various notifications, such as booking confirmations and payment receipts, primarily via email. Utilizes BullMQ for robust background job processing.
*   **Review Service (`review-service`):** Manages user reviews and ratings for events.

### Shared Libraries:

*   **`libs/shared`:** Contains common code, DTOs (Data Transfer Objects), interfaces, enums, and utilities shared across multiple microservices to maintain consistency and reduce code duplication.
*   **`libs/file-storage`:** Provides functionalities related to file uploads and storage, likely integrating with cloud storage solutions (e.g., Cloudinary).

## Technologies Used

*   **Backend Framework:** Node.js with [NestJS](https://nestjs.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/) (for persistent data storage)
*   **Message Broker:** [RabbitMQ](https://www.rabbitmq.com/) (for inter-service communication)
*   **Caching/Job Queue:** [Redis](https://redis.io/) (used by Notification Service for BullMQ)
*   **Containerization:** [Docker](https://www.docker.com/)
*   **Orchestration:** [Docker Compose](https://docs.docker.com/compose/)
*   **Payment Gateway:** [Stripe](https://stripe.com/)
*   **Authentication:** JWT, Passport.js (Local, Google OAuth2.0)
*   **Email Templating:** Handlebars
*   **Code Quality:** ESLint, Prettier
*   **Testing:** Jest

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)
*   [Node.js](https://nodejs.org/en/download/) (LTS version recommended, for running scripts outside Docker if needed)
*   [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

## Getting Started

Follow these steps to get the Bookify backend up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/bedonassef02/bookify
cd bookify
```

### 2. Environment Configuration

Copy the example environment file and update it with your specific configurations, especially for Stripe keys and any other external service credentials.

```bash
cp .env.example .env
```

Edit the newly created `.env` file. You will need to replace placeholder values like `your_stripe_secret_key` and `your_stripe_webhook_secret` with your actual Stripe API keys.

### 3. Build and Run with Docker Compose

Navigate to the root directory of the project where `docker-compose.yml` is located and run:

```bash
docker-compose up --build
```

This command will:
*   Build Docker images for each microservice.
*   Start all services (MongoDB, RabbitMQ, Redis, and all NestJS microservices).
*   Mount local source code volumes into the containers for development, enabling hot-reloading on code changes.

The services will be accessible on the ports defined in `docker-compose.yml` (e.g., API Gateway on `http://localhost:3000`).

### 4. Seeding Initial Data (Optional)

You can populate the databases with some initial data using the provided seed scripts. Run these commands from the project root after the Docker containers are up and running:

```bash
npm run seed:user-service
npm run seed:event-service
npm run seed:review-service
```

### 5. Accessing the API Gateway

Once all services are running, the API Gateway will be accessible at `http://localhost:3000`. You can interact with the backend using tools like Postman or Insomnia, or integrate it with your frontend application.

The API documentation (Swagger UI) will be available at `http://localhost:3000/api-docs` (or similar path, depending on the API Gateway's configuration).

## Development

### Running Services Individually (Outside Docker Compose)

While Docker Compose is recommended for local development, you can also run individual services using `npm` scripts if you have the necessary dependencies installed locally and external services (MongoDB, RabbitMQ, Redis) are accessible.

```bash
# Example: Start the API Gateway in development mode
npm run start:dev api-gateway
```

### Linting and Formatting

```bash
npm run lint
npm run format
```

### Testing

```bash
# Run all tests
npm run test

# Run end-to-end tests for API Gateway
npm run test:e2e
```

## Observability

The project includes configurations for Prometheus and Promtail, suggesting that metrics collection and log aggregation are set up for monitoring the microservices. Refer to `prometheus.yml` and `promtail-config.yml` for details on how to integrate with your monitoring stack.
