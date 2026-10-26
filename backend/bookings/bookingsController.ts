import type { Request, Response } from "express";
import { daysBetween, todayInBuenosAires } from "./dates.ts";
import { prisma } from "../db/prisma.ts";
import { toApiBooking } from "./mappers/booking.ts";
import type { Role } from "../generated/prisma/enums.ts";
import z from "zod";

const MAX_ACTIVE_BOOKINGS = 3;

const bookingWithCarInclude = {
  car: { select: { id: true, brand: true, model: true, imageUrl: true } },
} as const;

function ownershipFilter(user: { id: string; role: Role }) {
  if (user.role === "ADMIN") {
    return {};
  } else {
    return { userId: user.id };
  }
}

const bookingSchema = z.object({
  carId: z.uuid(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

const bookingIdSchema = z.uuid();

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
    if (user.role !== "ADMIN") {
      await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${user.id}::uuid FOR UPDATE`;

      const activeBookings = await tx.booking.count({
        where: {
          userId: user.id,
          status: "CONFIRMED",
          endDate: { gte: new Date(todayInBuenosAires()) },
        },
      });

      if (activeBookings >= MAX_ACTIVE_BOOKINGS) {
        return { error: "LIMIT" as const };
      }
    }

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
      return { error: "OVERLAP" as const };
    }

    const booking = await tx.booking.create({
      data: {
        userId: user.id,
        carId: data.carId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        totalPrice: price,
      },
      include: bookingWithCarInclude,
    });

    return booking;
  });

  if ("error" in transactionResult) {
    if (transactionResult.error === "LIMIT") {
      res.status(409).json({
        message: `You can have at most ${MAX_ACTIVE_BOOKINGS} active bookings`,
      });
      return;
    }

    res.status(409).json({ message: "Car already booked" });
    return;
  }

  res.status(201).json(toApiBooking(transactionResult));
}

export async function getBookings(_req: Request, res: Response) {
  const user = res.locals.user;

  if (!user) {
    res.status(401).json({ message: "Session required" });
    return;
  }

  const where = ownershipFilter(user);

  const bookings = await prisma.booking.findMany({
    where: where,
    include: bookingWithCarInclude,
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json(bookings.map((booking) => toApiBooking(booking)));
}

export async function getBookingById(req: Request, res: Response) {
  const user = res.locals.user;

  if (!user) {
    res.status(401).json({ message: "Session required" });
    return;
  }

  const idResult = bookingIdSchema.safeParse(req.params.id);
  if (!idResult.success) {
    res.status(400).json({ message: "Invalid booking id" });
    return;
  }

  const booking = await prisma.booking.findFirst({
    where: { id: idResult.data, ...ownershipFilter(user) },
    include: bookingWithCarInclude,
  });
  if (booking === null) {
    res
      .status(404)
      .json({ message: `No booking found with id ${req.params.id}` });
    return;
  }

  res.status(200).json(toApiBooking(booking));
}

//For now it only cancels the booking, but in a future maybe we can use this same endpoint to edit other things such dates etc
export async function cancelBookingById(req: Request, res: Response) {
  const user = res.locals.user;

  if (!user) {
    res.status(401).json({ message: "Session required" });
    return;
  }

  const idResult = bookingIdSchema.safeParse(req.params.id);
  if (!idResult.success) {
    res.status(400).json({ message: "Invalid booking id" });
    return;
  }

  const booking = await prisma.booking.findFirst({
    where: { id: idResult.data, ...ownershipFilter(user) },
    include: bookingWithCarInclude,
  });
  if (booking === null) {
    res
      .status(404)
      .json({ message: `No booking found with id ${req.params.id}` });
    return;
  }

  if (booking.status === "CANCELLED") {
    res.status(409).json({ message: "Cannot cancel a cancelled booking" });
    return;
  }

  const startDateToIso = booking.startDate.toISOString().slice(0, 10);
  if (startDateToIso < todayInBuenosAires()) {
    res.status(409).json({ message: "Cannot cancel a started booking" });
    return;
  }

  const editedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED" },
    include: bookingWithCarInclude,
  });
  res.status(200).json(toApiBooking(editedBooking));
}
