import { ReactNode } from "react";
import { useCars } from "../../hooks/useCars";
import { CarsContext } from "./CarsContext";

export function CarsProvider({ children }: { children: ReactNode }) {
  const value = useCars();
  return <CarsContext.Provider value={value}>{children}</CarsContext.Provider>;
}
