export type GearboxValue = "MANUAL" | "AUTOMATIC";
export type VehicleTypeValue = "SEDAN" | "SUV" | "FAMILY_CAR" | "STATION_WAGON";
export type CategoryValue = "ECONOMY" | "PREMIUM" | "LUXURY";

export interface CreateCarInput {
  imageUrl?: string;
  brand: string;
  model: string;
  year: number;
  vehicleType: VehicleTypeValue;
  category: CategoryValue;
  pricePerDay: number;
  seats: number;
  bagCapacity: number;
  suitcaseCapacity: number;
  gearbox: GearboxValue;
  ageRequired: number;
}
