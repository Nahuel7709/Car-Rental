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
  const user = res.locals.user;
  if (!user) {
    res.status(401).json({ message: "Session required" });
    return;
  }
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

  //transaction
  const transactionResult = await prisma.$transaction(async (tx) => {
    //block rows with sql
    await tx.$queryRaw`SELECT id FROM "Car" WHERE id = ${data.carId}::uuid FOR UPDATE`;

    //first search if there is already a booking for these days with that car
    const isBooked = await tx.booking.findFirst({
      where: {
        carId: data.carId,
        status: "CONFIRMED",
        startDate: { lt: new Date(data.endDate) },
        endDate: { gt: new Date(data.startDate) },
      },
    });

    if (isBooked !== null) {
      return { error: 409 as const };
    }

    const booking = await tx.booking.create({
      data: {
        userId: user.id,
        carId: data.carId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        totalPrice: price,
      },
    });

    return booking;
  });

  if ("error" in transactionResult) {
    res.status(409).json({ message: "Car already booked" });
    return;
  }
  res.status(201).json(transactionResult);
}
