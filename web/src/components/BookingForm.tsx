import { useState } from "react";
import { Car } from "../interfaces/Car";
import { daysBetween, todayInBuenosAires } from "../utils/dates";
import { money } from "../utils/format";
import { Button } from "../ui/Button";

type CarProps = {
  car: Car;
};

export const BookingForm = ({ car }: CarProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const isValidRange =
    startDate !== "" && endDate !== "" && endDate > startDate;
  const days = daysBetween(startDate, endDate);
  const total = days * car.pricePerDay;

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

      <Button disabled={!isValidRange || days > 30}>Book this car</Button>
    </div>
  );
};
