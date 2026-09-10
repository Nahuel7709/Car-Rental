import express from "express";
import { cars } from "./db/cars.ts";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));

app.get("/cars", (req, res) => {
  res.json(cars);
});

app.get("/cars/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  const car = cars.find((car) => car.id === id);
  if (car === undefined) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  res.json(car);
  return;
});

app.listen(PORT, () => {
  console.log(`App running in port ${PORT}`);
});
