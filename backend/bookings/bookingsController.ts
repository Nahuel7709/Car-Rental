import type { Request, Response } from "express";
import z from "zod";
import { daysBetween, todayInBuenosAires } from "./dates.ts";
import { prisma } from "../db/prisma.ts";

const bookingSchema = z.object({
  carId: z.uuid(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

export async function createBooking(req: Request, res: Response) {
  //body validations
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

  //find the car
  const car = await prisma.car.findUnique({ where: { id: data.carId } });
  if (car === null) {
    res.status(404).json({ message: "Car not found" });
    return;
  }

  //calculate the price
  const price = car?.pricePerDay * totalDays;

  //first search if there is already a booking for these days with that car
  const isBooked = await prisma.booking.findFirst({
    where: {
      carId: data.carId,
      status: "CONFIRMED",
      startDate: { lt: new Date(data.endDate) },
      endDate: { gt: new Date(data.startDate) },
    },
  });

  if (isBooked !== null) {
    res.status(409).json({ message: "The car is already booked" });
    return;
  }

  if (!res.locals.user) {
    res.status(401).json({ message: "Session required" });
    return;
  }

  const booking = await prisma.booking.create({
    data: {
      userId: res.locals.user.id,
      carId: data.carId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      totalPrice: price,
    },
  });

  res.status(201).json(booking);
}
