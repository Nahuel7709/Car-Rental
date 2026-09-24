import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db/prisma.ts";
import { toApiCar } from "./mappers/car.ts";
import type { Request, Response, NextFunction } from "express";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const validIdRegex = /^\d+$/;

app.use(cors({ origin: CORS_ORIGIN }));

app.get("/cars", async (req, res) => {
  const cars = await prisma.car.findMany({
    orderBy: { id: "asc" },
  });
  res.json(cars.map((car) => toApiCar(car)));
});

app.get("/cars/:id", async (req, res) => {
  if (!validIdRegex.test(req.params.id)) {
    res.status(400).json({ message: "The car id must be a whole number" });
    return;
  }

  const car = await prisma.car.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (car === null) {
    res.status(404).json({ message: `No car found with id ${req.params.id}` });
    return;
  }

  res.json(toApiCar(car));
});

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[${req.method} ${req.originalUrl}]`, err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`App running in port ${PORT}`);
});
