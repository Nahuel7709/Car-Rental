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

Users can browse the car catalogue, see the details of each car, register, log in, and book a car between two dates. They can see their bookings and cancel them. Authentication uses a JWT stored in an httpOnly cookie, passwords are hashed with argon2, and every request body is validated with Zod. There are two roles: CUSTOMER (the default) and ADMIN, which can add new cars and see every booking. Roles and ownership are enforced on the backend: the role, the user and the price are never taken from the client. A customer can have at most 3 active bookings.

A car can never be booked twice for overlapping dates, not even when two requests arrive at the same time: bookings are created inside a transaction that locks the car row.

All records use UUID v7 as their ID. The backend has integration tests with Vitest and Supertest that run against a separate PostgreSQL database, a GitHub Actions pipeline runs the typecheck and the tests on every push and pull request, and the backend and its database can run with Docker Compose.

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
- Docker and Docker Compose
- GitHub Actions (CI)

## Requirements

- Node.js 20.19 or higher (CI and the Docker image use Node 24)
- npm
- Docker Desktop

## How to start the project

There are two ways to run the backend: with Docker Compose (the quickest) or directly with Node. The frontend always runs with Vite.

## Run with Docker

The backend and its database run with Docker Compose, without installing Postgres or setting up a `.env` for the backend.

1. From the repo root, build and start the database and the API:
```bash
   docker compose up --build
```
   The API waits until Postgres is ready, applies the migrations and starts on http://localhost:3000.
2. In another terminal, load the initial data (only needed the first time):
```bash
   docker compose exec api npm run seed:cars
   docker compose exec api npm run seed:admin
   docker compose exec api npm run seed:customer
```
   The seeds can be run again safely: the cars seed skips if there are cars already, and the user seeds only update the password.
3. Start the frontend (see Frontend below). It talks to the API on http://localhost:3000.

The local credentials (admin and customer) are defined in `docker-compose.yml`. They are only for local use.

Useful commands:

| Command | What it does |
|---|---|
| `docker compose up -d` | Starts everything in the background |
| `docker compose logs -f api` | Shows the API logs live |
| `docker compose down` | Stops and removes the containers. The data is kept in the `db-data` volume |
| `docker compose down -v` | Also removes the volume: the database starts empty next time |

The database is also exposed on port `5435`, so it can be opened with Prisma Studio or any Postgres client.

## Run the backend with Node

Runs on http://localhost:3000. Stop the Docker API first if it is running, because both use port 3000.

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
   npm run seed:customer
```
   `seed:cars` inserts the cars, `seed:admin` creates the admin user with the `ADMIN_*` credentials, and `seed:customer` (optional) creates a regular user with the `CUSTOMER_*` credentials, useful to try bookings.
6. Run the backend:
```bash
   npm run dev
```

To reset the dev database, run `npx prisma migrate reset` and the seeds again.

## Frontend

Runs on http://localhost:5173.

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
- `CUSTOMER_NAME`, `CUSTOMER_EMAIL`, `CUSTOMER_PASSWORD`: optional, only needed to run `npm run seed:customer`. They create a regular user (CUSTOMER role) with the same rules as the admin seed.
- `PORT`: optional, defaults to 3000. Hosting platforms usually set it themselves.
- `CORS_ORIGIN`: optional, defaults to http://localhost:5173. It is the origin allowed to call the API and send cookies.
- `NODE_ENV`: optional. When it is `production`, the cookie is only sent over HTTPS (secure). In local development leave it empty.

`web/.env` (there is a `.env.example`):

- `VITE_API_URL`: the URL of the backend, http://localhost:3000 in local development.

The `.env` files are not committed, that is why there are `.env.example` files. With Docker Compose, the backend variables are set in `docker-compose.yml` instead.

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
3. From `backend/`, apply the migrations to the test database:
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

The API has basic protections for a public app: rate limiting per route, security headers, a request size limit, and a business limit on active bookings.


## Deployment

```
Browser ──> Vercel (React build + /api proxy) ──> Render (Express API in Docker) ──> Neon (PostgreSQL 17)
```

- **Frontend on Vercel:** builds `web/` with `npm run build` and serves the static files. Every push to `main` deploys again.
- **Backend on Render:** builds the image from `backend/Dockerfile`. When the container starts, it applies the pending migrations and then starts the server. Every push to `main` that changes `backend/` deploys again, and Render checks `/health` to know the service is up.
- **Database on Neon:** managed PostgreSQL 17, in the same region as the backend (US East, Ohio). The connection uses SSL (`sslmode=require`).

**The `/api` proxy.** The frontend never calls Render directly. `web/vercel.json` has a rewrite that forwards every request to `/api/*` to the Render URL, so for the browser the frontend and the API are the same site. That way the session cookie is first-party and `sameSite: "lax"` works, instead of being a third-party cookie that browsers block. A second rewrite sends any other route to `index.html`, so reloading a page like `/bookings` works and React Router handles it.

**Environment variables in production:**
- Render: `DATABASE_URL` (Neon), `JWT_SECRET` (different from the local one), `NODE_ENV=production` and `CORS_ORIGIN` (the Vercel URL). - `TRUST_PROXY`: optional. The number of proxies in front of the API, used to get the real client IP for rate limiting. Leave it empty locally. In production it is `4` (see Security). The server does not start if it is not a non-negative integer.
- Vercel: `VITE_API_URL=/api`. Vite writes this value into the JavaScript during the build, so changing it requires a new deploy.

**Seeds.** The production database was seeded once from a local terminal, pointing `DATABASE_URL` to Neon.

## Security

### Rate limiting

Implemented with `express-rate-limit`. Over the limit, the API returns `429` with a JSON message and the standard `RateLimit` and `Retry-After` headers.

| Route | Key | Limit |
|---|---|---|
| `POST /auth/login` | IP | 10 failed attempts per 15 minutes (successful logins do not count) |
| `POST /auth/register` | IP | 5 per hour |
| `POST /bookings` | User | 20 attempts per 15 minutes |
| Rest of the API | IP | 300 per 15 minutes (`/health` is excluded, Render calls it constantly) |

Routes that require a session are limited per user, not per IP: many mobile carriers share one public IP among thousands of customers (CGNAT), so limiting them per IP would block innocent users.

The counters are kept in memory. That works with a single instance, but they are lost when the container restarts, and several instances would count separately. A shared store like Redis is the next step.

### Client IP behind proxies

In production, a request goes through Vercel, Cloudflare, Render's load balancer and a local proxy before reaching Express. The real client IP arrives in `X-Forwarded-For`, and `TRUST_PROXY` tells Express how many proxies to skip. The value (`4`) was measured in production with a temporary endpoint, not guessed.

**Known limitation:** the measurement also showed that a client can spoof `X-Forwarded-For`, both through the Vercel proxy and by calling the Render URL directly. So the IP-based limits stop regular users and simple bots, but not an attacker who knows this. The real fixes are rate limiting at the edge (a WAF) and making Render only accept traffic from Vercel, which the free plans do not fully support. A per-account login limit was considered and discarded, because it lets anyone lock a user out of their account on purpose.

### Other protections

- **Request size:** JSON bodies are limited to 10 KB. A bigger body returns `413`.
- **Security headers:** `helmet` on the API. The frontend headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) are set in `web/vercel.json`, because Vercel is the one serving the files.
- **Active bookings limit:** a customer can have at most 3 active bookings (`CONFIRMED` and not finished). More return `409`. The user row is locked inside the booking transaction, so simultaneous requests can not go over the limit. The admin is not limited.

## Users and roles

- Anyone can register from `/register`. New users always get the CUSTOMER role.
- To log in as admin, use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set before running `npm run seed:admin`. The admin sees an "Add car" link in the header that leads to `/admin`.
- To try bookings without registering, run `npm run seed:customer` and log in with `CUSTOMER_EMAIL` and `CUSTOMER_PASSWORD`. Both seeds can be run again safely: if the user exists, only its password is updated.

## API overview

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/health` | Public. Returns `{ "status": "ok" }` |
| `POST` | `/auth/register` | Public |
| `POST` | `/auth/login` | Public |
| `POST` | `/auth/logout` | Public |
| `GET` | `/auth/me` | Session |
| `GET` | `/cars` | Public |
| `GET` | `/cars/:id` | Public |
| `POST` | `/cars` | ADMIN |
| `POST` | `/bookings` | Session |
| `GET` | `/bookings` | Session |
| `GET` | `/bookings/:id` | Session |
| `PATCH` | `/bookings/:id/cancel` | Session |

## Bookings

Logged-in users can book a car between two dates, see their bookings and cancel them. A car can never be booked twice for overlapping dates.

### Endpoints

All of them require a session.

| Method | Endpoint | CUSTOMER | ADMIN |
|---|---|---|---|
| `POST` | `/bookings` | Creates a booking for themselves | Same |
| `GET` | `/bookings` | Only their bookings | All bookings |
| `GET` | `/bookings/:id` | Only their bookings (someone else's returns `404`) | Any booking |
| `PATCH` | `/bookings/:id/cancel` | Only their bookings | Any booking |

### Creating a booking

```json
POST /bookings
{
  "carId": "0199f2c4-...",
  "startDate": "2026-11-10",
  "endDate": "2026-11-15"
}
```

The response:

```json
{
  "id": "0199f2d1-...",
  "status": "CONFIRMED",
  "totalPrice": 25000,
  "startDate": "2026-11-10",
  "endDate": "2026-11-15",
  "car": { "id": "0199f2c4-...", "brand": "Toyota", "model": "Corolla" }
}
```

### Rules

- Dates are sent and returned as `YYYY-MM-DD` strings, and stored as dates without time, so they never shift one day because of the time zone.
- The end date is the return day and is not charged: a booking from the 10th to the 15th is 5 days. A booking can start on the day another one ends.
- `startDate` can not be in the past (today, in Buenos Aires time, is allowed). A booking can last 30 days at most.
- `totalPrice` is calculated by the backend (days × the car's price per day at that moment) and stored, so later price changes do not affect existing bookings. The user and the price are never taken from the request body.
- Overlapping a `CONFIRMED` booking of the same car returns `409`. Cancelled bookings do not block dates.
- Cancelling changes the status to `CANCELLED`. Bookings are never deleted. A booking that is already cancelled or already started can not be cancelled (`409`).
- Bookings are created inside a transaction that locks the car row (`SELECT ... FOR UPDATE`), so two simultaneous requests for the same car and dates can not both succeed.

### Status codes

| Code | When |
|---|---|
| `400` | Invalid body or ID, end date not after start date, start date in the past, more than 30 days |
| `401` | No session |
| `404` | The car or the booking does not exist, or the booking belongs to another customer |
| `409` | Overlapping dates, or cancelling a booking that is cancelled or already started |
| `409` | Overlapping dates, the customer already has 3 active bookings, or cancelling a booking that is cancelled or already started |
| `429` | Too many booking attempts |


**Live demo:** https://car-rental-xi-teal-49.vercel.app

Demo account (CUSTOMER role), to try bookings without registering:
- Email: `demo@car-rental.com`
- Password: `customerCar12343`

> The backend runs on a free instance that sleeps after inactivity, so the first request can take up to a minute. After that it responds normally.