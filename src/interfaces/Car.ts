export type Gearbox = "Manual" | "Automatic";
export type VehicleType = "Sedan" | "SUV" | "Family car" | "Station wagon";
export type Category = "Economy" | "Premium" | "Luxury";

export interface Car {
  id: number;
  imageUrl?: string;
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
