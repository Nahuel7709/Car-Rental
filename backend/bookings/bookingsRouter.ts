import { Router } from "express";
import { createBooking, getBookings } from "./bookingsController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

export const bookingRouter = Router();

bookingRouter.use(authMiddleware);

bookingRouter.post("/", createBooking);

bookingRouter.get("/", getBookings)
