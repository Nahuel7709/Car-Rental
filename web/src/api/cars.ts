import { Car } from "../interfaces/Car";

export async function fetchCars(): Promise<Car[]> {
  const res = await fetch("http://localhost:3000/cars");

  if (!res.ok) {
    throw new Error("Error" + res.status);
  }

  const data = await res.json();

  return data;
}
