import express from "express";
import cors from "cors";

import type { Request, Response, NextFunction } from "express";
import { carsRouter } from "./cars/carsRouter.ts";
import { authRouter } from "./auth/authRouter.ts";
import cookieParser from "cookie-parser";
import { bookingRouter } from "./bookings/bookingsRouter.ts";

export const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

app.use(express.json());

app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (
    err instanceof SyntaxError &&
    "status" in err &&
    err.status === 400 &&
    "body" in err
  ) {
    res.status(400).json({ message: "Invalid JSON" });
    return;
  }
  next(err);
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use(cookieParser());

app.use("/cars", carsRouter);

app.use("/auth", authRouter);

app.use("/bookings", bookingRouter);

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[${req.method} ${req.originalUrl}]`, err);
  res.status(500).json({ message: "Internal server error" });
});
