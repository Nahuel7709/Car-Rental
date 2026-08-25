import { Car } from "../interfaces/Car";

type CarCardProps = {
  car: Car;
};

export const CarCard = ({ car }: CarCardProps) => {
  return (
    <>
      <h3>
        {car.brand} {car.model} {car.year}
      </h3>
      <p>
        Tags: {car.vehicleType} + {car.category}, {car.gearbox}
      </p>
      <p>Image</p>
      <p>
        Other tags: {car.seats}, {car.bagCapacity}, {car.suitcaseCapacity}, Age:{" "}
        {car.ageRequired}
      </p>
      <button>More</button>
    </>
  );
};
