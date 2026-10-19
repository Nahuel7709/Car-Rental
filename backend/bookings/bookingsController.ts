import type { Request, Response } from "express";
import z from "zod";
import { daysBetween, todayInBuenosAires } from "./dates.ts";

const bookingSchema = z.object({
  carId: z.uuid(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

export async function createBooking(req: Request, res: Response) {
  const result = bookingSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }
  const data = result.data;
  if (data.endDate <= data.startDate) {
    res.status(400).json({ message: "End date must be after the start date" });
    return;
  }
  if (data.startDate < todayInBuenosAires()) {
    res.status(400).json({ message: "Start date cannot be before today" });
    return;
  }
  const totalDays = daysBetween(data.startDate, data.endDate);
  if (totalDays > 30) {
    res.status(400).json({ message: "The total days cannot be more than 30" });
    return;
  }
  res.status(201).json(data);
}
