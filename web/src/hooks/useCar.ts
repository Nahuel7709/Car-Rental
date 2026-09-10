import { useCallback, useEffect, useState } from "react";
import { fetchCar } from "../api/cars";
import { Car } from "../interfaces/Car";

export function useCar(id: string | undefined) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCar = useCallback(async () => {
    if (!id) {
      setCar(null);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const data = await fetchCar(id);
      setCar(data);
    } catch (err) {
      console.log(err);
      setError("Error trying to load the car");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getCar();
  }, [getCar]);

  return { car, loading, error, getCar };
}
