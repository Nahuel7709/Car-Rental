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

app.listen(PORT, () => {
  console.log(`App running in port ${PORT}`);
});
