import { cars } from "../data/cars";
import { CarCard } from "./CarCard";

export const CarList = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard car={car} key={car.id} />
      ))}
    </div>
  );
};
