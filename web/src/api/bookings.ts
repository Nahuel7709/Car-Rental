import { Booking } from "../interfaces/Booking";

const API_URL = import.meta.env.VITE_API_URL;

export async function createBooking(
  carId: string,
  startDate: string,
  endDate: string,
): Promise<Booking> {
  const res = await fetch(`${API_URL}/bookings/`, {
    credentials: "include",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carId, startDate, endDate }),
  });

  if (res.status === 409) {
    throw new Error("This car is not available for those dates");
  }

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }

  const data = await res.json();
  return data;
}

export async function fetchMyBookings(): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/bookings/`, {
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }
  const data = await res.json();
  return data;
}

export async function cancelBookingRequest(id: string): Promise<Booking> {
  const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
    credentials: "include",
    method: "PATCH",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }

  const data = await res.json();
  return data;
}
