import { Router } from "express";
import { createCar, getCarById, getCars } from "./carsController.ts";
import { requireAdmin } from "../middlewares/requireAdmin.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

export const carsRouter = Router();

//All Cars
carsRouter.get("/", getCars);

//create Car
carsRouter.post("/", authMiddleware, requireAdmin, createCar);

//Car detail
carsRouter.get("/:id", getCarById);
