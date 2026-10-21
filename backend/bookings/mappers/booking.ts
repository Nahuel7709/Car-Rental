import type { BookingModel } from "../../generated/prisma/models.ts";
import type { Booking } from "../interfaces/Booking.ts";

type BookingWithCar = BookingModel & {
  car: { id: string; brand: string; model: string; imageUrl: string | null };
};

export function toApiBooking(booking: BookingWithCar): Booking {
  return {
    id: booking.id,
    status: booking.status,
    totalPrice: booking.totalPrice,
    startDate: booking.startDate.toISOString().slice(0, 10),
    endDate: booking.endDate.toISOString().slice(0, 10),
    car: {
      id: booking.car.id,
      brand: booking.car.brand,
      model: booking.car.model,
      imageUrl: booking.car.imageUrl ?? undefined,
    },
  };
}
