import { prisma } from "../db/prisma.ts";
import { toApiCar } from "../cars/mappers/car.ts";
import type { Request, Response } from "express";
import z from "zod";
import { Category, Gearbox, VehicleType } from "../generated/prisma/enums.ts";

const carSchema = z.object({
  brand: z.string().trim().min(2, "Minimum of 2 characters"),
  model: z.string().trim().min(2, "Minimum of 2 characters"),
  year: z.int().min(1900).max(2040),
  imageUrl: z.url().optional(),
  vehicleType: z.enum(VehicleType),
  category: z.enum(Category),
  pricePerDay: z.int().positive(),
  seats: z.int().positive(),
  bagCapacity: z.int().nonnegative(),
  suitcaseCapacity: z.int().nonnegative(),
  gearbox: z.enum(Gearbox),
  ageRequired: z.int().positive().min(18),
});

export async function getCars(req: Request, res: Response) {
  const cars = await prisma.car.findMany({
    orderBy: { id: "asc" },
  });
  res.json(cars.map((car) => toApiCar(car)));
}

export async function createCar(req: Request, res: Response) {
  const result = carSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }

  const data = result.data;

  const car = await prisma.car.create({ data: data });
  res.status(201).json(toApiCar(car));
}

export async function getCarById(req: Request<{ id: string }>, res: Response) {
  const validIdRegex = /^\d+$/;
  if (!validIdRegex.test(req.params.id)) {
    res.status(400).json({ message: "The car id must be a whole number" });
    return;
  }

  const car = await prisma.car.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (car === null) {
    res.status(404).json({ message: `No car found with id ${req.params.id}` });
    return;
  }

  res.json(toApiCar(car));
}
