import { useState } from "react";
import { cancelBookingRequest } from "../api/bookings";
import { BookingCard } from "../components/BookingCard";
import { useBookings } from "../hooks/useBookings";
import { ErrorMessage } from "../ui/ErrorMessage";
import { FormAlert } from "../ui/FormAlert";

export const MyBookingsPage = () => {
  const { bookings, loading, error, getBookings } = useBookings();
  const [cancelError, setCancelError] = useState<null | string>(null);

  if (!window.confirm("Cancel this booking?")) return;

  setCancelError(null);

  async function handleCancel(id: string) {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelError(null);
    try {
      await cancelBookingRequest(id);
      getBookings();
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "We couldn't cancel the booking",
      );
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={getBookings} />;
  }

  if (bookings.length === 0) {
    return (
      <div>
        <p>You don’t have bookings yet</p>
      </div>
    );
  }

  return (
    <div>
      {cancelError && <FormAlert message={cancelError} />}
      {bookings.map((booking) => (
        <BookingCard
          booking={booking}
          onCancel={handleCancel}
          key={booking.id}
        />
      ))}
    </div>
  );
};
