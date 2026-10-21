import { Link } from "react-router";
import { Booking } from "../interfaces/Booking";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { daysBetween, todayInBuenosAires } from "../utils/dates";
import { formatDate, money, plural } from "../utils/format";

type BookingCardProps = {
  booking: Booking;
  onCancel: (id: string) => void;
  cancelling?: boolean;
};

export const BookingCard = ({
  booking,
  onCancel,
  cancelling = false,
}: BookingCardProps) => {
  const canCancel =
    booking.status === "CONFIRMED" && booking.startDate >= todayInBuenosAires();
  const isCancelled = booking.status === "CANCELLED";
  const days = daysBetween(booking.startDate, booking.endDate);

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm sm:flex-row ${
        isCancelled ? "opacity-70" : ""
      }`}
    >
      <Link
        to={`/cars/${booking.car.id}`}
        className="relative block aspect-4/3 bg-ink-100 p-4 sm:aspect-auto sm:w-56 sm:shrink-0"
      >
        <img
          src={booking.car.imageUrl ?? "/no-image.svg"}
          alt={
            booking.car.imageUrl
              ? `${booking.car.brand} ${booking.car.model}`
              : ""
          }
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 border-t border-ink-200 p-5 sm:border-l sm:border-t-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-ink-900">
              {booking.car.brand} {booking.car.model}
            </h3>
            <p className="mt-0.5 text-sm text-ink-500">
              {plural(days, "day", "days")}
            </p>
          </div>
          <Badge tone={isCancelled ? "neutral" : "brand"}>
            {isCancelled ? "Cancelled" : "Confirmed"}
          </Badge>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-200 bg-ink-200">
          <div className="bg-white px-4 py-2.5">
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-500">
              Pick-up
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-ink-900">
              {formatDate(booking.startDate)}
            </dd>
          </div>
          <div className="bg-white px-4 py-2.5">
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-500">
              Return
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-ink-900">
              {formatDate(booking.endDate)}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between gap-3">
          <p>
            <span className="block text-xs text-ink-500">Total</span>
            <span className="text-lg font-bold text-ink-900">
              {money(booking.totalPrice)}
            </span>
          </p>
          {canCancel && (
            <Button
              variant="secondary"
              fullWidth={false}
              disabled={cancelling}
              onClick={() => onCancel(booking.id)}
            >
              {cancelling ? "Cancelling..." : "Cancel booking"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};
