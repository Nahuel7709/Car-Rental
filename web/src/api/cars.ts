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

export async function fetchCar(id: string | undefined): Promise<Car | null> {
  const res = await fetch(`${API_URL}/cars/${id}`);

  if (res.status === 400 || res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }

  const data = await res.json();

  return data;
}
