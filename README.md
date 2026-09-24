# Car Rental

A car rental web app built with React, TypeScript and Express. It displays a catalogue of cars available for rental, stored in a PostgreSQL database and served by the backend through a REST API.

## Tech stack:

- React
- Vite
- Typescript
- Tailwind
- Node - Express
- PostgreSQL
- Prisma

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
- copy .env.example to .env and paste that connection string into DATABASE_URL
- npx prisma generate
- npx prisma migrate deploy
- npx prisma db seed
- npm run dev (runs the backend)

Frontend (runs on http://localhost:5173):
- cd web
- npm install
- npm run dev (runs the frontend)

## Environment variables

backend/.env (there is a .env.example with all the keys and empty values):

- DATABASE_URL - required. There is no default, the server does not start without it. It is the connection string of your PostgreSQL database, in the format postgresql://USER:PASSWORD@HOST:5432/DATABASE
- PORT - optional, defaults to 3000. Hosting platforms usually set it themselves.
- CORS_ORIGIN - optional, defaults to http://localhost:5173. It is the origin allowed to call the API.

The .env file is not committed, that is why there is a .env.example.
