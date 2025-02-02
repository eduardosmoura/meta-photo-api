# meta-photo-api

MetaPhoto API

## Table of Contents

- [meta-photo-api](#meta-photo-api)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Project Description](#project-description)
  - [Code Structure](#code-structure)
  - [Required Libraries](#required-libraries)
  - [Setup and Installation](#setup-and-installation)
  - [Compilation and Running](#compilation-and-running)
    - [Development Mode](#development-mode)
    - [Production Mode](#production-mode)
  - [Running the Tests](#running-the-tests)
  - [Live Deployment](#live-deployment)
  - [Additional Notes](#additional-notes)

## Overview

MetaPhoto API is a lightweight NestJS-based API designed to help photographers organize their photo libraries. The API enriches photo data by combining information from multiple endpoints and offers robust filtering and pagination options. It follows Clean Architecture principles and is built with **TypeScript**, **SOLID**, **Clean Code**, and **Clean Architecture** practices.

## Project Description

MetaPhoto API aggregates data from internal endpoints provided by [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com) and exposes a single external endpoint that returns enriched photo information. For each photo, it retrieves additional details about the album and the user who owns the album. Filtering is available on photo titles, album titles, and user emails, with pagination support to limit the amount of data returned.

## Code Structure

The project is organized into multiple layers following Clean Architecture principles:

```text
src/
├── common/
│ ├── errors/
│ ├── interfaces/
│ └── utils/
├── core/
│ ├── domain/
│ ├── repositories/
│ ├── services/
│ └── use-cases/
├── infrastructure/
│ ├── controllers/
│ ├── dtos/
│ ├── repositories/
│ └── services/
├── application/
```

## Required Libraries

- **NestJS and related packages:**
  - `@nestjs/common`
  - `@nestjs/core`
  - `@nestjs/config`
  - `@nestjs/axios`
- **TypeScript:**
  - `typescript`
  - `ts-node`
- **Validation and Transformation:**
  - `class-validator`
  - `class-transformer`
- **Testing:**

  - `jest`
  - `@nestjs/testing`

- **Logging:**
  - `winston`
- **Others:**
  - `dotenv`
  - `rxjs`

## Setup and Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/meta-photo-api.git
   cd meta-photo-api
   ```

2. **Install Dependencies:**

   If you are using **npm**:

   ```bash
   npm install
   ```

   If you prefer **Yarn**:

   ```bash
   yarn install --frozen-lockfile
   ```

3. **Environment Configuration:**

   Create environment files for different environments (e.g., development, staging, production). For example, create a `.env.development` file in the root with the following:

   ```dotenv
   NODE_ENV=development
   EXTERNAL_API_BASE_URL=https://jsonplaceholder.typicode.com
   ```

   You can similarly create `.env.staging` and `.env.production` files with environment-specific variables.

## Compilation and Running

### Development Mode

To compile and run the project in development mode with live reload:

```bash
npm run start:dev
```

or with **Yarn**:

```bash
yarn start:dev
```

### Production Mode

To compile and run the project in production mode:

1. **Build the project:**

   ```bash
   npm run build
   ```

   or

   ```bash
   yarn build
   ```

2. **Run the built application:**

   ```bash
   npm run start:prod
   ```

   or

   ```bash
   yarn start:prod
   ```

## Running the Tests

The project uses Jest for testing. To run the tests:

```bash
npm run test
```

or

```bash
yarn test
```

For end-to-end tests:

```bash
npm run test:e2e
```

or

```bash
yarn test:e2e
```

## Live Deployment

A live deployment of the MetaPhoto API, hosted on `Vercel`, is available at:
**[https://meta-photo-api-murex.vercel.app/](https://meta-photo-api-murex.vercel.app/)**

## Additional Notes

- **Cache Map Strategy:**
  The service layer implements a `cache map` strategy to store `albums` and `users` after the first API call. This strategy prevents repeated calls to the external API for the same album or user, significantly improving performance and reducing latency.

- **Logging:**
  Logs are generated using Winston and are stored in the `/logs` folder. The logger configuration is located in `src/common/utils/logger.ts`.

- **Postman Collection:**
  A Postman collection is provided in the repository for testing all endpoints, including filtering and pagination scenarios.

- **Swagger Documentation:**
  The API includes Swagger documentation available at the root URL (e.g., `http://localhost:3000` in development):

  - **[https://meta-photo-api-murex.vercel.app/](https://meta-photo-api-murex.vercel.app/)**

- **GitHub Actions:**
  The repository includes a GitHub Actions workflow to deploy the API to Vercel on each commit to the `main` branch.

- **Vercel Deployment:**
  Due to a known Vercel **deployment issue** (`this serverless function has crashed`), the vercel.json file was modified to include a reference to the `dist` build. Additionally, the `.gitignore` file was updated to uncomment the /dist folder for the same reason.

Feel free to contribute or open issues if you encounter any problems. Enjoy using MetaPhoto API!
