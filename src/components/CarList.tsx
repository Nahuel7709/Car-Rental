import { cars } from "../data/cars";
import { CarCard } from "./CarCard";

export const CarList = () => {
  return (
    <>
      <div>
        {cars.map((car) => (
          <CarCard car={car} key={car.id} />
        ))}
      </div>
    </>
  );
};
