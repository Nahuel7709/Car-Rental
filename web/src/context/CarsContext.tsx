import { createContext, ReactNode, useContext } from "react";
import { type Car } from "../interfaces/Car";
import { useCars } from "../hooks/useCars";

type CarsContextValue = {
  cars: Car[];
  loading: boolean;
  error: string | null;
  getCars: () => void;
};

export const CarsContext = createContext<CarsContextValue | undefined>(
  undefined,
);

export function CarsProvider({ children }: { children: ReactNode }) {
  const value = useCars();
  return <CarsContext.Provider value={value}>{children}</CarsContext.Provider>;
}

export function useCarsContext() {
  const ctx = useContext(CarsContext);
  if (ctx === undefined) {
    throw new Error("useCarsContext must be inside the CarsProvider");
  }
  return ctx;
}
