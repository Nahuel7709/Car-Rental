# Car Rental

A car rental web app built with React, TypeScript and Express. It displays a catalogue of cars available for rental, stored in a PostgreSQL database and served by the backend through a REST API. Users can register, log in and log out. Authentication uses a JWT stored in an httpOnly cookie, and there are two roles: CUSTOMER (the default) and ADMIN, which is the only one allowed to add new cars.

## Tech stack:

- React
- Vite
- Typescript
- Tailwind
- Node - Express
- PostgreSQL
- Prisma
- Zod (request validation)
- argon2 (password hashing)
- jsonwebtoken + cookie-parser (authentication)

## Requirements:

- Node.js 20.19 or higher
- npm
- A PostgreSQL database. You can create a free one on Supabase or Neon.

## How to start the project

- clone the project. Both parts have to be running at the same time, so use two terminals.

Backend (runs on http://localhost:3000):

- cd backend
- npm install
- create a PostgreSQL database (for example a free project on Supabase or Neon) and copy its connection string
- copy .env.example to .env and fill it in (see Environment variables below): at least DATABASE_URL, JWT_SECRET and the ADMIN_* variables
- npx prisma generate
- npx prisma migrate deploy
- npx prisma db seed (inserts the cars)
- npm run seed:admin (creates the admin user with the ADMIN_* credentials)
- npm run dev (runs the backend)

Frontend (runs on http://localhost:5173):

- cd web
- npm install
- copy .env.example to .env (it already points to http://localhost:3000)
- npm run dev (runs the frontend)

## Environment variables

backend/.env (there is a .env.example with all the keys and empty values):

- DATABASE_URL - required. There is no default, the server does not start without it. It is the connection string of your PostgreSQL database, in the format postgresql://USER:PASSWORD@HOST:5432/DATABASE
- JWT_SECRET - required. The server does not start without it. It is the secret used to sign the tokens, so use a long random string. You can generate one with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
- ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD - only needed to run npm run seed:admin. The admin user is created with these credentials, and the seed fails if any of them is missing.
- PORT - optional, defaults to 3000. Hosting platforms usually set it themselves.
- CORS_ORIGIN - optional, defaults to http://localhost:5173. It is the origin allowed to call the API and send cookies.
- NODE_ENV - optional. When it is "production", the cookie is only sent over HTTPS (secure). In local development leave it empty.

web/.env (there is a .env.example):

- VITE_API_URL - the URL of the backend, http://localhost:3000 in local development.

The .env files are not committed, that is why there are .env.example files.



## Users and roles

- Anyone can register from /register. New users always get the CUSTOMER role.
- To log in as admin, use the ADMIN_EMAIL and ADMIN_PASSWORD you set before running npm run seed:admin. The admin sees an "Add car" link in the header that leads to /admin.