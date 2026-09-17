import { useState, useCallback } from "react";
import { fetchCars } from "../api/cars";
import { Car } from "../interfaces/Car";

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCars = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchCars();
      setCars(data);
    } catch (err) {
      setError("Error trying to load the cars");
    } finally {
      setLoading(false);
    }
  }, []);

  return { cars, loading, error, getCars };
}
