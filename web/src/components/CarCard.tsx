import { Link } from "react-router";
import { Car } from "../interfaces/Car";
import { Badge } from "../ui/Badge";
import { buttonClass } from "../ui/buttonStyles";
import { money } from "../utils/format";

type CarCardProps = {
  car: Car;
};

export const CarCard = ({ car }: CarCardProps) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-4/3 overflow-hidden bg-ink-100 p-4">
        <img
          src={car.imageUrl ?? "/no-image.svg"}
          alt={car.imageUrl ? `${car.brand} ${car.model}` : ""}
          loading="lazy"
          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone="solid">{car.vehicleType}</Badge>
          {car.gearbox === "Automatic" && <Badge tone="solid">Automatic</Badge>}
        </div>
        {car.category === "Luxury" && (
          <div className="absolute right-3 top-3">
            <Badge tone="solid">Luxury</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-ink-200 p-5">
        <div>
          <h3 className="line-clamp-1 text-base font-semibold text-ink-900">
            {car.brand} {car.model}
          </h3>
          <p className="mt-0.5 text-sm text-ink-500">
            {car.year} · {car.category}
          </p>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          <li>
            <Badge>{car.seats} seats</Badge>
          </li>
          <li>
            <Badge>
              {car.bagCapacity} bags · {car.suitcaseCapacity} suitcases
            </Badge>
          </li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p>
            <span className="text-lg font-bold text-ink-900">
              {money(car.pricePerDay)}
            </span>
            <span className="text-sm text-ink-500"> / day</span>
            <span className="block text-xs text-ink-500">
              min. age {car.ageRequired}
            </span>
          </p>
          <Link
            to={`/cars/${car.id}`}
            className={buttonClass("primary", "shrink-0")}
          >
            More
          </Link>
        </div>
      </div>
    </article>
  );
};
