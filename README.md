# Event Booking API

This project is a microservices-based event booking platform built with NestJS. It allows users to browse events, book tickets, manage user profiles, and receive notifications.

## Architecture

The application follows a microservices architecture, with each service responsible for a specific domain. Docker Compose is used to orchestrate and manage these services.

### Services:

*   **API Gateway (`api-gateway`):** The entry point for all client requests. It routes requests to the appropriate microservices and handles cross-cutting concerns like authentication and global error handling.
*   **Booking Service (`booking-service`):** Manages all booking-related operations, including creating, retrieving, and canceling bookings.
*   **Event Service (`event-service`):** Handles event management, including creating events, managing categories, and ticket tiers.
*   **Notification Service (`notification-service`):** Responsible for sending various notifications, such as booking confirmations and event updates, primarily via email.
*   **User Service (`user-service`):** Manages user authentication, authorization, and user profile information.

## Technologies Used

*   **Backend:** NestJS (TypeScript)
*   **Database:** MongoDB
*   **Message Broker:** RabbitMQ
*   **Containerization:** Docker, Docker Compose
*   **Authentication:** JWT, Passport.js, bcrypt
*   **Validation:** Class Validator, Class Transformer
*   **API Documentation:** Swagger (OpenAPI)
*   **Emailing:** `@nestjs-modules/mailer`, Handlebars
*   **File Storage:** Cloudinary integration
*   **Testing:** Jest

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed:

*   Docker Desktop
*   Node.js (LTS version recommended)
*   npm (comes with Node.js)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/bedonassef02/bookify.git
    cd bookify
    ```

2.  **Start Docker Compose services:**

    This will build the Docker images for each service and start all the necessary containers (MongoDB, RabbitMQ, and all NestJS microservices).

    ```bash
    docker-compose up --build
    ```

    The services will be accessible at the following ports:
    *   API Gateway: `http://localhost:3000`
    *   RabbitMQ Management: `http://localhost:15672` (guest/guest)

### Running the Application

Once the Docker containers are up and running, the API Gateway will be accessible at `http://localhost:3000`.

You can interact with the API using tools like Postman, Insomnia, or through the Swagger UI, which will be available at `http://localhost:3000/api` (or similar, depending on the API Gateway's configuration).

### Seeding the Database

To populate the database with initial data (e.g., test users, events), you can run the seeding scripts. These scripts should be executed after the MongoDB and respective service containers are running.

*   **Seed User Service:**

    ```bash
    npm run seed:user-service
    ```

*   **Seed Event Service:**

    ```bash
    npm run seed:event-service
    ```

### Running Tests

*   **Run all tests:**

    ```bash
    npm test
    ```

*   **Run end-to-end tests for API Gateway:**

    ```bash
    npm run test:e2e
    ```

### Linting and Formatting

*   **Run linting:**

    ```bash
    npm run lint
    ```

*   **Format code:**

    ```bash
    npm run format
    ```
