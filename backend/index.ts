import "dotenv/config";
import express from "express";
import cors from "cors";

import type { Request, Response, NextFunction } from "express";
import { carsRouter } from "./cars/carsRouter.ts";
import { authRouter } from "./auth/authRouter.ts";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));

app.use(express.json());

app.use("/cars", carsRouter);

app.use("/auth", authRouter);

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[${req.method} ${req.originalUrl}]`, err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`App running in port ${PORT}`);
});
