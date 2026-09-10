import { Link, useParams } from "react-router";
import { useCar } from "../hooks/useCar";
import { ErrorMessage } from "../ui/ErrorMessage";
import { Badge } from "../ui/Badge";
import { buttonClass } from "../ui/buttonStyles";
import { CarNotFound } from "../components/CarNotFound";
import { CarDetailsSkeleton } from "../components/CarDetailsSkeleton";
import { money } from "../utils/format";

export const CarDetailsPage = () => {
  const { id } = useParams();
  const { car, loading, error, getCar } = useCar(id);

  if (loading) {
    return <CarDetailsSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={getCar} />;
  }

  if (car === null) {
    return <CarNotFound />;
  }

  return (
    <div>
      <Link
        to="/cars"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to all cars
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="aspect-2/1 overflow-hidden rounded-2xl border border-ink-200 bg-white p-6">
            <img
              src={car.imageUrl ?? "/no-image.svg"}
              alt={car.imageUrl ? `${car.brand} ${car.model}` : ""}
              className="h-full w-full object-contain"
            />
          </div>

          <h2 className="mt-6 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            {car.brand} {car.model}
          </h2>

          <p className="mt-1.5 text-ink-500">
            {car.year} · {car.vehicleType}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            <li>
              <Badge tone="brand">{car.category}</Badge>
            </li>
            <li>
              <Badge tone="brand">{car.gearbox}</Badge>
            </li>
            <li>
              <Badge>Minimum age {car.ageRequired}</Badge>
            </li>
          </ul>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 sm:grid-cols-4">
            {[
              ["Seats", car.seats],
              ["Bags", car.bagCapacity],
              ["Suitcases", car.suitcaseCapacity],
              ["Year", car.year],
            ].map(([label, value]) => (
              <div key={label} className="bg-white px-4 py-4 text-center">
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-500">
                  {label}
                </dt>
                <dd className="mt-1 text-2xl font-bold text-ink-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <p>
              <span className="text-3xl font-bold text-ink-900">
                {money(car.pricePerDay)}
              </span>
              <span className="text-ink-500"> / day</span>
            </p>

            <p className="mt-1 text-sm text-ink-500">
              Drivers aged {car.ageRequired} and over
            </p>

            <div className="my-5 h-px bg-ink-200" />

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">{money(car.pricePerDay)} x 3 days</dt>
                <dd className="font-medium text-ink-900">
                  {money(car.pricePerDay * 3)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Insurance</dt>
                <dd className="font-medium text-ink-900">
                  {money(Math.round(car.pricePerDay * 0.15))}
                </dd>
              </div>
            </dl>

            <div className="my-5 h-px bg-ink-200" />

            <div className="flex justify-between text-base font-bold text-ink-900">
              <span>Total</span>
              <span>
                {money(
                  car.pricePerDay * 3 + Math.round(car.pricePerDay * 0.15),
                )}
              </span>
            </div>

            <button
              type="button"
              className={buttonClass("primary", "mt-6 w-full")}
            >
              Book this car
            </button>

            <p className="mt-3 text-center text-xs text-ink-500">
              You won't be charged yet
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
