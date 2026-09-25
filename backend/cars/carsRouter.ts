import { Router } from "express";
import { getCarById, getCars } from "./carsController.ts";

export const carsRouter = Router();

//All Cars
carsRouter.get("/", getCars);

//Car detail
carsRouter.get("/:id", getCarById);
