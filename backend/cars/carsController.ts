import { prisma } from "../db/prisma.ts";
import { toApiCar } from "../cars/mappers/car.ts";
import type { Request, Response } from "express";

export async function getCars(req: Request, res: Response) {
  const cars = await prisma.car.findMany({
    orderBy: { id: "asc" },
  });
  res.json(cars.map((car) => toApiCar(car)));
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
