import { VehicleType, Category, Gearbox } from "../types/CarTypes";

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  vehicleType: VehicleType;
  category: Category;
  pricePerDay: number;
  seats: number;
  bagCapacity: number;
  suitcaseCapacity: number;
  gearbox: Gearbox;
  ageRequired: number;
}
