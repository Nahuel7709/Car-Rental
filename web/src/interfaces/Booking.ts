export type Status = "CONFIRMED" | "CANCELLED";

interface carBooked {
  id: string;
  brand: string;
  model: string;
  imageUrl?: string;
}

export interface Booking {
  id: string;
  status: Status;
  totalPrice: number;
  startDate: string;
  endDate: string;
  car: carBooked;
}
