import { Booking } from "../interfaces/Booking";
import { Badge } from "../ui/Badge";
import { money } from "../utils/format";

type BookingCardProps = {
  booking: Booking;
};

export const BookingCard = ({ booking }: BookingCardProps) => {
  return (
    <div>
      <Badge>{booking.status}</Badge>
      <p>{booking.car.brand}</p>
      <p>{booking.car.model}</p>
      <p>Start date: {booking.startDate}</p>
      <p>End date: {booking.endDate}</p>
      <p>{money(booking.totalPrice)}</p>
    </div>
  );
};
