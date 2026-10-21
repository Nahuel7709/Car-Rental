import { Booking } from "../interfaces/Booking";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { todayInBuenosAires } from "../utils/dates";
import { money } from "../utils/format";

type BookingCardProps = {
  booking: Booking;
  onCancel: (id: string) => void;
};

export const BookingCard = ({ booking, onCancel }: BookingCardProps) => {
  const canCancel =
    booking.status === "CONFIRMED" && booking.startDate >= todayInBuenosAires();

  return (
    <div>
      <Badge>{booking.status}</Badge>
      <p>{booking.car.brand}</p>
      <p>{booking.car.model}</p>
      <p>Start date: {booking.startDate}</p>
      <p>End date: {booking.endDate}</p>
      <p>{money(booking.totalPrice)}</p>
      {canCancel && (
        <Button onClick={() => onCancel(booking.id)}>Cancel</Button>
      )}
    </div>
  );
};
