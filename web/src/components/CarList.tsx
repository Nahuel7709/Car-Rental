import { Car } from "../interfaces/Car";
import { CarCard } from "./CarCard";

type CarListProps = {
  cars: Car[];
};

export const CarList = ({ cars }: CarListProps) => {
  if (cars.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-300 bg-white px-6 py-16 text-center">
        <p className="text-4xl">🔍</p>
        <p className="mt-3 text-base font-semibold text-ink-900">
          No cars were found
        </p>
        <p className="mt-1 text-sm text-ink-500">
          Try removing a filter or searching for another model.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cars.map((car) => (
        <CarCard car={car} key={car.id} />
      ))}
    </div>
  );
};
