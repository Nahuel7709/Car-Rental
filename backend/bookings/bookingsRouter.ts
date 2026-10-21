import { Router } from "express";
import {
    cancelBookingById,
  createBooking,
  getBookingById,
  getBookings,
} from "./bookingsController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

export const bookingRouter = Router();

bookingRouter.use(authMiddleware);

bookingRouter.post("/", createBooking);

bookingRouter.get("/", getBookings);

bookingRouter.get("/:id", getBookingById);

bookingRouter.patch("/:id/cancel", cancelBookingById);
