import { useState } from "react";
import { Link } from "react-router";
import { Car } from "../interfaces/Car";
import { Booking } from "../interfaces/Booking";
import { createBooking } from "../api/bookings";
import { useAuthContext } from "../context/auth";
import { daysBetween, todayInBuenosAires } from "../utils/dates";
import { formatDate, money, plural } from "../utils/format";
import { Button } from "../ui/Button";
import { FormAlert } from "../ui/FormAlert";
import { FormField } from "../ui/FormField";
import { buttonClass } from "../ui/buttonStyles";

const MAX_DAYS = 30;

type CarProps = {
  car: Car;
};

export const BookingForm = ({ car }: CarProps) => {
  const { user } = useAuthContext();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleBook = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const created = await createBooking(car.id, startDate, endDate);
      setBooking(created);
    } catch (err) {
      setBooking(null);
      setError(
        err instanceof Error ? err.message : "We couldn't place your booking",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookAgain = () => {
    setBooking(null);
    setStartDate("");
    setEndDate("");
  };

  const isValidRange =
    startDate !== "" && endDate !== "" && endDate > startDate;
  const days = daysBetween(startDate, endDate);
  const total = days * car.pricePerDay;
  const isTooLong = isValidRange && days > MAX_DAYS;

  if (user === null) {
    return (
      <div className="text-center">
        <p className="text-sm text-ink-700">
          Log in to choose your dates and book this car.
        </p>
        <Link to="/login" className={buttonClass("primary", "mt-4 w-full")}>
          Log in to book
        </Link>
        <p className="mt-3 text-xs text-ink-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-700 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    );
  }

  if (booking) {
    return (
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="m5 12 5 5L20 7" />
            </svg>
          </span>
          <div>
            <p className="font-semibold text-ink-900">Booking confirmed</p>
            <p className="text-sm text-ink-500">
              {plural(daysBetween(booking.startDate, booking.endDate), "day", "days")}
            </p>
          </div>
        </div>

        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">Pick-up</dt>
            <dd className="font-medium text-ink-900">
              {formatDate(booking.startDate)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Return</dt>
            <dd className="font-medium text-ink-900">
              {formatDate(booking.endDate)}
            </dd>
          </div>
        </dl>

        <div className="my-5 h-px bg-ink-200" />

        <div className="flex justify-between text-base font-bold text-ink-900">
          <span>Total</span>
          <span>{money(booking.totalPrice)}</span>
        </div>

        <Link to="/bookings" className={buttonClass("primary", "mt-6 w-full")}>
          See my bookings
        </Link>
        <Button variant="ghost" className="mt-2" onClick={handleBookAgain}>
          Book other dates
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <FormField
          id="booking-start"
          label="Pick-up"
          type="date"
          value={startDate}
          onChange={handleStartDate}
          min={todayInBuenosAires()}
        />
        <FormField
          id="booking-end"
          label="Return"
          type="date"
          value={endDate}
          onChange={handleEndDate}
          min={startDate || todayInBuenosAires()}
        />
      </div>

      <div className="my-5 h-px bg-ink-200" />

      {isValidRange ? (
        <>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">
                {money(car.pricePerDay)} × {plural(days, "day", "days")}
              </dt>
              <dd className="font-medium text-ink-900">{money(total)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex justify-between text-base font-bold text-ink-900">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </>
      ) : (
        <p className="text-sm text-ink-500">
          Choose your pick-up and return dates to see the total.
        </p>
      )}

      {isTooLong && (
        <p className="mt-3 text-xs font-medium text-red-600">
          Bookings can last {MAX_DAYS} days at most.
        </p>
      )}

      <Button
        className="mt-6"
        disabled={!isValidRange || isTooLong || submitting}
        onClick={handleBook}
      >
        {submitting ? "Booking..." : "Book this car"}
      </Button>

      <p className="mt-3 text-center text-xs text-ink-500">
        The return day is not charged. Free cancellation before pick-up.
      </p>

      {error && <FormAlert message={error} />}
    </div>
  );
};
