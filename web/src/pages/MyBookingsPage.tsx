import { useState } from "react";
import { Link } from "react-router";
import { cancelBookingRequest } from "../api/bookings";
import { BookingCard } from "../components/BookingCard";
import { BookingListSkeleton } from "../components/BookingListSkeleton";
import { useBookings } from "../hooks/useBookings";
import { ErrorMessage } from "../ui/ErrorMessage";
import { FormAlert } from "../ui/FormAlert";
import { buttonClass } from "../ui/buttonStyles";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Booking } from "../interfaces/Booking";
import { formatDate, money } from "../utils/format";

export const MyBookingsPage = () => {
  const { bookings, loading, error, getBookings, updateBooking } =
    useBookings();
  const [cancelError, setCancelError] = useState<null | string>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  // The booking shown in the confirmation dialog, or null when it is closed
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  function askToCancel(id: string) {
    setCancelError(null);
    setBookingToCancel(bookings.find((booking) => booking.id === id) ?? null);
  }

  async function handleCancel() {
    if (bookingToCancel === null) return;
    setCancellingId(bookingToCancel.id);
    try {
      const cancelled = await cancelBookingRequest(bookingToCancel.id);
      updateBooking(cancelled);
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "We couldn't cancel the booking",
      );
    } finally {
      setCancellingId(null);
      setBookingToCancel(null);
    }
  }

  if (loading) {
    return <BookingListSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={getBookings} />;
  }

  if (bookings.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-500">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </span>

        <h2 className="mt-4 text-xl font-bold text-ink-900">
          You don't have bookings yet
        </h2>

        <p className="mt-2 text-sm text-ink-500">
          Choose a car and pick your dates to make your first booking.
        </p>

        <Link to="/cars" className={buttonClass("primary", "mt-6")}>
          Browse all cars
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          My bookings
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
        </p>
      </div>

      {cancelError && (
        <div className="-mt-6 mb-6">
          <FormAlert message={cancelError} />
        </div>
      )}

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onCancel={askToCancel}
            cancelling={cancellingId === booking.id}
          />
        ))}
      </div>

      <ConfirmDialog
        open={bookingToCancel !== null}
        title="Cancel this booking?"
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        confirmVariant="danger"
        loading={cancellingId !== null}
        loadingLabel="Cancelling..."
        onConfirm={handleCancel}
        onCancel={() => setBookingToCancel(null)}
      >
        {bookingToCancel && (
          <>
            <p className="text-sm text-ink-700">
              Your booking of the{" "}
              <span className="font-semibold text-ink-900">
                {bookingToCancel.car.brand} {bookingToCancel.car.model}
              </span>{" "}
              from {formatDate(bookingToCancel.startDate)} to{" "}
              {formatDate(bookingToCancel.endDate)} (
              {money(bookingToCancel.totalPrice)}) will be cancelled.
            </p>
            <p className="mt-2 text-sm text-ink-500">
              The dates will be free for other customers. This can't be undone.
            </p>
          </>
        )}
      </ConfirmDialog>
    </div>
  );
};
