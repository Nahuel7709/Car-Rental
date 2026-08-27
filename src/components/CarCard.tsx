import { Car } from "../interfaces/Car";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

type CarCardProps = {
  car: Car;
};

export const CarCard = ({ car }: CarCardProps) => {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-gray-900">
        {car.brand} {car.model}
        <span className="text-sm font-normal text-gray-500"> {car.year}</span>
      </h3>
      <p className="text-sm text-gray-500">
        {car.vehicleType} {car.category} {car.gearbox}
      </p>
      <ul className="flex flex-wrap gap-2">
        <li>
          <Badge>{car.seats} seats</Badge>
        </li>
        <li>
          <Badge>{car.bagCapacity} bags</Badge>
        </li>
        <li>
          <Badge>{car.suitcaseCapacity} suitcases</Badge>
        </li>
        <li>
          <Badge>+{car.ageRequired} years</Badge>
        </li>
      </ul>
      {car.imageUrl ? (
        <img
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full aspect-video object-contain rounded-lg"
        />
      ) : (
        <img
          src="/no-image.svg"
          alt=""
          className="w-full aspect-video object-contain rounded-lg"
        />
      )}
      <div className="mt-auto flex flex-col gap-3">
        <p className="text-xl">
          <span className=" font-bold text-gray-900">${car.pricePerDay}</span>
          <span className="text-sm font-normal text-gray-500">/day</span>
        </p>
        <Button>More</Button>
      </div>
    </article>
  );
};
