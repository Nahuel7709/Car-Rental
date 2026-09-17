import express from "express";
import { cars } from "./db/cars.ts";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

const validIdRegex = /^\d+$/;

app.use(cors({ origin: CORS_ORIGIN }));

app.get("/cars", (req, res) => {
  res.json(cars);
});

app.get("/cars/:id", (req, res) => {
  if (!validIdRegex.test(req.params.id)) {
    res.status(400).json({ message: "The car id must be a whole number" });
    return;
  }

  const id = Number(req.params.id);
  const car = cars.find((car) => car.id === id);
  if (car === undefined) {
    res.status(404).json({ message: `No car found with id ${id}` });
    return;
  }

  res.json(car);
});

app.listen(PORT, () => {
  console.log(`App running in port ${PORT}`);
});
