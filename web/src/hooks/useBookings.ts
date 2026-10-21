import { useState, useCallback, useEffect } from "react";

import { fetchMyBookings } from "../api/bookings";
import { Booking } from "../interfaces/Booking";

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getBookings = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchMyBookings();
      setBookings(data);
    } catch (err) {
      setError("Error trying to load the bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  return { bookings, loading, error, getBookings };
}
