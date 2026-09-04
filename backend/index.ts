import express, { type Express, type Request, type Response } from "express";
import { cars } from "./db/cars.ts";
import cors from "cors";

const app: Express = express();
app.use(cors());

app.get("/cars", (req, res) => {
  res.json(cars);
});

app.listen(3000, () => {
  console.log("App running in port 3000");
});
