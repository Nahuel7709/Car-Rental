# Car Rental

A car rental web app built with React, TypeScript, Express. This first version displays a catalogue of cars available for rental using mock data from a backend with Express.

## Tech stack:

- React
- Vite
- Typescript
- Tailwind
- Node - Express
- PostgreSQL
- Prisma

## Requirements:

- Node.js 20.19
- npm

## How to start the project

- clone the project. Both parts have to be running at the same time, so use two terminals.

Backend (runs on http://localhost:3000):

- cd backend
- npm install
- create a .env file with the same content as .env.example
- npx prisma generate
- npx prisma migrate deploy
- npx prisma db seed
- npm run dev (runs the backend)

Frontend (runs on http://localhost:5173):
-cd web
-npm install
-npm run dev (runs the frontend)

## Environment variables

- web/.env - VITE_API_URL is the base URL of the backend. There is a .env.example with the value for local development. Vite only exposes variables that start with VITE\*, and it reads the file when the dev server starts, so restart it if you change it.
- backend - PORT is optional and defaults to 3000. It is read from the environment, not from a file, because hosting platforms set it themselves.
  -DATABASE_URL
  -CORS_ORIGIN
