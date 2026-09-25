import type { CarModel } from "../../generated/prisma/models.ts";
import type { Car } from "../interfaces/Car.ts";

const vehicleTypes = {
  SEDAN: "Sedan",
  SUV: "SUV",
  FAMILY_CAR: "Family car",
  STATION_WAGON: "Station wagon",
} as const;

const categories = {
  ECONOMY: "Economy",
  PREMIUM: "Premium",
  LUXURY: "Luxury",
} as const;

const gearboxes = {
  MANUAL: "Manual",
  AUTOMATIC: "Automatic",
} as const;

export function toApiCar(car: CarModel): Car {
  return {
    id: car.id,
    imageUrl: car.imageUrl ?? undefined,
    brand: car.brand,
    model: car.model,
    year: car.year,
    vehicleType: vehicleTypes[car.vehicleType],
    category: categories[car.category],
    pricePerDay: car.pricePerDay,
    seats: car.seats,
    bagCapacity: car.bagCapacity,
    suitcaseCapacity: car.suitcaseCapacity,
    gearbox: gearboxes[car.gearbox],
    ageRequired: car.ageRequired,
  };
}
