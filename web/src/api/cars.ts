import { Car } from "../interfaces/Car";
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCars(): Promise<Car[]> {
  const res = await fetch(`${API_URL}/cars`);

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }

  const data = await res.json();

  return data;
}
