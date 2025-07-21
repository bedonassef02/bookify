<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
    <a href="httpshttps://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
    <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
    <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
    <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
    <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
    <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
    <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

This is a monorepo for a "Bookify" application, an event booking system. It's built with [Nest](https://github.com/nestjs/nest), a progressive Node.js framework, and uses TypeScript. The project follows a microservice architecture, with an API gateway and several individual services for handling different business domains.

## Project Structure

The project is organized as a monorepo with the following structure:

-   **`apps`**: Contains the different microservices of the application.
    -   `api-gateway`: The entry point for all client requests, routing them to the appropriate microservice.
    -   `booking-service`: Handles booking-related logic.
    -   `event-service`: Manages events.
    -   `notification-service`: Responsible for sending notifications.
    -   `user-service`: Manages user accounts and authentication.
-   **`libs`**: Contains shared libraries used across the microservices.
    -   `file-storage`: A library for handling file uploads.
    -   `shared`: A library containing common modules, DTOs, interfaces, and utilities.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or higher)
-   [npm](https://www.npmjs.com/)
-   [Docker](https://www.docker.com/)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/bedonassef02/bookify.git
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

### Running the Application

The application can be run using Docker Compose, which will start all the microservices and the required infrastructure (MongoDB and RabbitMQ).

```bash
docker-compose up -d
```

To run a specific service in development mode, you can use the following command:

```bash
npm run start:dev <service-name>
```

Replace `<service-name>` with the name of the service you want to run (e.g., `api-gateway`, `user-service`).

## Running Tests

To run the entire test suite, use the following command:

```bash
npm run test
```

To run tests for a specific service, you can use the following command:

```bash
npm run test:e2e <service-name>
```

Replace `<service-name>` with the name of the service you want to test (e.g., `api-gateway`, `user-service`).

## API Documentation

The API documentation is generated using Swagger and can be accessed at `http://localhost:3000/api`.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

-   Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
-   Website - [https://nestjs.com](https://nestjs.com/)
-   Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).