import { Car } from "../interfaces/Car";
import { CarCard } from "./CarCard";
type CarListProps = {
  cars: Car[];
};

export const CarList = ({ cars }: CarListProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard car={car} key={car.id} />
      ))}
    </div>
  );
};
