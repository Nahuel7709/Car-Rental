import { useState } from "react";
import { Car, CategoryFilter, VehicleTypeFilter } from "../interfaces/Car";

export function useFilters(cars: Car[]) {
  const [search, setSearch] = useState("");
  const [onlyAutomatic, setOnlyAutomatic] = useState(false);
  const [vehicleTypeSelect, setVehicleTypeSelect] =
    useState<VehicleTypeFilter>("All");
  const [category, setCategory] = useState<CategoryFilter>("All");

  function clearFilters() {
    setSearch("");
    setOnlyAutomatic(false);
    setVehicleTypeSelect("All");
    setCategory("All");
  }

  const areFiltered =
    search !== "" ||
    onlyAutomatic ||
    vehicleTypeSelect !== "All" ||
    category !== "All";

  const searchTerm = search.toLowerCase().trim();

  const filteredCars = cars.filter((car) => {
    const searchFilter =
      car.brand.toLowerCase().includes(searchTerm) ||
      car.model.toLowerCase().includes(searchTerm);

    const automaticFilter = !onlyAutomatic || car.gearbox === "Automatic";

    const vehicleTypeFilter =
      vehicleTypeSelect === "All" || car.vehicleType === vehicleTypeSelect;

    const categoryFilter = category === "All" || car.category === category;

    return (
      searchFilter && automaticFilter && vehicleTypeFilter && categoryFilter
    );
  });

  return {
    search,
    onlyAutomatic,
    vehicleTypeSelect,
    category,
    clearFilters,
    areFiltered,
    filteredCars,
    setSearch,
    setOnlyAutomatic,
    setVehicleTypeSelect,
    setCategory,
  };
}
