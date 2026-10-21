import { BookingCard } from "../components/BookingCard";
import { useBookings } from "../hooks/useBookings";
import { ErrorMessage } from "../ui/ErrorMessage";

export const MyBookingsPage = () => {
  const { bookings, loading, error, getBookings } = useBookings();

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
      {bookings.map((booking) => (
        <BookingCard booking={booking} key={booking.id} />
      ))}
    </div>
  );
};
