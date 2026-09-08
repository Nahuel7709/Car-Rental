import { useEffect, useState } from "react";
import { fetchCars } from "../api/cars";
import { Car } from "../interfaces/Car";

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getCars() {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchCars();
      setCars(data);
    } catch (err) {
      console.log(err);
      setError("Error trying to load the cars");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCars();
  }, []);

  return { cars, loading, error, getCars };
}
