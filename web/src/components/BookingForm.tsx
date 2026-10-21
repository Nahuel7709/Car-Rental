import { useState } from "react";
import { Car } from "../interfaces/Car";
import { daysBetween, todayInBuenosAires } from "../utils/dates";
import { money } from "../utils/format";
import { Button } from "../ui/Button";
import { useAuthContext } from "../context/auth";
import { Link } from "react-router";
import { Booking } from "../interfaces/Booking";
import { createBooking } from "../api/bookings";
import { FormAlert } from "../ui/FormAlert";

type CarProps = {
  car: Car;
};

export const BookingForm = ({ car }: CarProps) => {
  const { user } = useAuthContext();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<null | string>("");
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

  const isValidRange =
    startDate !== "" && endDate !== "" && endDate > startDate;
  const days = daysBetween(startDate, endDate);
  const total = days * car.pricePerDay;

  if (user === null) {
    return (
      <div>
        <p>Log in to book</p>
        <Link to={"/login"}>
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  if (booking) {
    return (
      <div>
        <p>Booking confirmed</p>
        <p>
          Start date: {booking.startDate} - End date: {booking.endDate}
        </p>
        <p>Total: {money(booking.totalPrice)}</p>
        <Link to={"/bookings"}>
          <Button>See my bookings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <input
        type="date"
        value={startDate}
        onChange={handleStartDate}
        min={todayInBuenosAires()}
      />
      <input
        type="date"
        value={endDate}
        onChange={handleEndDate}
        min={startDate}
      />
      {isValidRange && (
        <div>
          <p>
            {days} days × {money(car.pricePerDay)}
          </p>
          <p>Total: {money(total)}</p>
        </div>
      )}
      {days > 30 && <p>Bookings can last 30 days at most</p>}

      <Button
        disabled={!isValidRange || days > 30 || submitting}
        onClick={handleBook}
      >
        {submitting ? "Booking..." : "Book this car"}
      </Button>

      {error && <FormAlert message={error} />}
    </div>
  );
};
