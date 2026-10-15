# Car Rental

![CI](https://github.com/Nahuel7709/Car-Rental/actions/workflows/ci.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

A full-stack car rental app built with TypeScript: a React frontend and an Express REST API backed by PostgreSQL and Prisma.

Users can browse the car catalogue, see the details of each car, register, log in and log out. Authentication uses a JWT stored in an httpOnly cookie, passwords are hashed with argon2, and every request body is validated with Zod. There are two roles: CUSTOMER (the default) and ADMIN, which is the only one allowed to add new cars. Roles are enforced on the backend, and the role sent by the client is always ignored.

All records use UUID v7 as their ID. The backend has integration tests with Vitest and Supertest that run against a separate PostgreSQL database, and a GitHub Actions pipeline runs the typecheck and the tests on every push and pull request.

## Tech stack

**Frontend**
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router

**Backend**
- Node.js and Express
- TypeScript
- PostgreSQL
- Prisma
- Zod (request validation)
- argon2 (password hashing)
- jsonwebtoken and cookie-parser (authentication)

**Testing and tooling**
- Vitest and Supertest (integration tests)
- Docker (local databases)
- GitHub Actions (CI)

## Requirements

- Node.js 20.19 or higher (CI uses Node 24)
- npm
- Docker Desktop, for the local databases

## How to start the project

Clone the project. Both parts have to be running at the same time, so use two terminals.

### Backend (runs on http://localhost:3000)

1. Start the dev database. The first time, create the container:
```bash
   docker run --name car-rental-dev-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=car_rental -p 5434:5432 -d postgres:17
```
   Next times, just start it:
```bash
   docker start car-rental-dev-db
```
2. Install the dependencies:
```bash
   cd backend
   npm install
```
3. Copy `.env.example` to `.env` and fill it in (see Environment variables below). With the container above, `DATABASE_URL` is `postgresql://postgres:postgres@localhost:5434/car_rental`.
4. Generate the Prisma client and apply the migrations:
```bash
   npx prisma generate
   npx prisma migrate deploy
```
5. Load the initial data:
```bash
   npm run seed:cars
   npm run seed:admin
```
   `seed:cars` inserts the cars and `seed:admin` creates the admin user with the `ADMIN_*` credentials.
6. Run the backend:
```bash
   npm run dev
```

### Frontend (runs on http://localhost:5173)

```bash
cd web
npm install
```

Copy `.env.example` to `.env` (it already points to http://localhost:3000) and run:

```bash
npm run dev
```

## Environment variables

`backend/.env` (there is a `.env.example` with all the keys and empty values):

- `DATABASE_URL`: required. There is no default, the server does not start without it. It is the connection string of your PostgreSQL database, in the format `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`.
- `JWT_SECRET`: required. The server does not start without it. It is the secret used to sign the tokens, so use a long random string. You can generate one with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: only needed to run `npm run seed:admin`. The admin user is created with these credentials, and the seed fails if any of them is missing.
- `PORT`: optional, defaults to 3000. Hosting platforms usually set it themselves.
- `CORS_ORIGIN`: optional, defaults to http://localhost:5173. It is the origin allowed to call the API and send cookies.
- `NODE_ENV`: optional. When it is `production`, the cookie is only sent over HTTPS (secure). In local development leave it empty.

`web/.env` (there is a `.env.example`):

- `VITE_API_URL`: the URL of the backend, http://localhost:3000 in local development.

The `.env` files are not committed, that is why there are `.env.example` files.

## Running the tests

Tests run against a separate PostgreSQL database in Docker, never against the dev database.

1. Start the test database. The first time, create the container:
```bash
   docker run --name car-rental-test-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=car_rental_test -p 5433:5432 -d postgres:17
```
   Next times, just start it:
```bash
   docker start car-rental-test-db
```
2. Create `backend/.env.test` from `backend/.env.test.example` and fill in `DATABASE_URL` and `JWT_SECRET`.
3. Apply the migrations to the test database:
```bash
   npx dotenv -e .env.test -- npx prisma migrate deploy
```
4. Run the tests:
```bash
   npm test
```

The setup file loads `.env.test` and stops the run if `DATABASE_URL` does not point to `car_rental_test`.

## Continuous integration

Every push and pull request runs the GitHub Actions workflow in `.github/workflows/ci.yml`. It installs the backend with `npm ci`, starts PostgreSQL 17 as a service container, generates the Prisma client, runs the typecheck, applies the migrations and runs the tests. The `main` branch is protected: changes go through a pull request, and the CI check has to pass before merging.

## Users and roles

- Anyone can register from `/register`. New users always get the CUSTOMER role.
- To log in as admin, use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set before running `npm run seed:admin`. The admin sees an "Add car" link in the header that leads to `/admin`.