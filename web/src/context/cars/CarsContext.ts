import { createContext, useContext } from "react";
import { type Car } from "../../interfaces/Car";

type CarsContextValue = {
  cars: Car[];
  loading: boolean;
  error: string | null;
  getCars: () => Promise<void>;
};

export const CarsContext = createContext<CarsContextValue | undefined>(
  undefined,
);

export function useCarsContext() {
  const ctx = useContext(CarsContext);
  if (ctx === undefined) {
    throw new Error("useCarsContext must be inside the CarsProvider");
  }
  return ctx;
}
