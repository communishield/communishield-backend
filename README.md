# Communishield

## Overview

Communishield is a robust API designed to provide secure, general data layer functionalities, including user authentication, group management, and file/directory operations. It's built to offer a secure and efficient way to manage data across various applications.

## Running the Application

### Bare Metal

For running Communishield directly on your system:

1. Ensure Node.js and npm/yarn are installed.
2. Clone the repository:

   ```bash
   git clone git@github.com:communishield/communishield-backend.git
   ```

3. Change directory and install dependencies:

   ```bash
   cd communishield-backend/app
   npm install # or yarn install
   ```

4. Start the application:

   ```bash
   npm start # or yarn start
   ```

### Using Docker Compose

To run Communishield with Docker Compose alongside a Postgres database:

1. Ensure Docker and Docker Compose are installed.
2. In the application directory, execute:

   ```bash
   docker-compose up
   ```

This will initialize both the application and the Postgres database.

## API Documentation

Access detailed API documentation at the `/docs` route while the application is running. This provides an interactive Swagger UI to explore API endpoints, descriptions, parameters, schemas, and testing capabilities.

## Environment Configuration

Communishield is configured via environment variables. For a starting point, refer to the `.env.example` file at the root of the project. This file can be renamed to `.env` and adjusted as needed.

Here's the `.env` configuration structure:

| Variable                  | Description                              | Example Value               |
| ------------------------- | ---------------------------------------- | --------------------------- |
| `COMPOSE_FILE`            | Docker compose file path                 | `docker/docker-compose.yml` |
| `COMPOSE_PROJECT_NAME`    | Docker compose project name              | `communishield`             |
| `POSTGRES_USER`           | PostgreSQL username                      | `user`                      |
| `POSTGRES_PASSWORD`       | PostgreSQL password                      | `password`                  |
| `POSTGRES_DB`             | PostgreSQL database name                 | `communishield`             |
| `POSTGRES_HOST`           | PostgreSQL host                          | `localhost`                 |
| `POSTGRES_PORT`           | PostgreSQL port                          | `5432`                      |
| `COMMUNISHIELD_HOST`      | Communishield host                       | `0.0.0.0`                   |
| `COMMUNISHIELD_PORT`      | Communishield port                       | `3000`                      |
| `COMMUNISHIELD_LOG_LEVEL` | Logging level                            | `debug`                     |
| `JWT_SECRET_KEY`          | JWT secret key                           | `supersecretpass4`          |
| `JWT_ISSUER`              | JWT issuer                               | `communishield`             |
| `JWT_TTL`                 | JWT time to live (seconds)               | `3600`                      |
| `JWT_AUDIENCE`            | JWT audience                             | `localhost`                 |
| `JWT_ALGORITHM`           | JWT algorithm                            | `HS256`                     |
| `BCRYPT_SALT_ROUNDS`      | Number of salt rounds for bcrypt hashing | `10`                        |
| `SWAGGER_SPECS_PATH`      | Path to the Swagger specifications file  | `assets/swagger.yaml`       |

Adjust these values based on your environment and security requirements.

## License

Communishield is an open-source software licensed under the AGPL-3.0. For more information, see the [LICENSE](https://github.com/communishield/communishield-backend/blob/main/LICENSE).
