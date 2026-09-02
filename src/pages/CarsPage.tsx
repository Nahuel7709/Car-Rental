import { useState } from "react";
import { Car, VehicleTypeFilter, CategoryFilter } from "../interfaces/Car";
import { CarList } from "../components/CarList";
import { CarFilters } from "../components/CarFilters";

type CarsPageProps = {
  cars: Car[];
};

export const CarsPage = ({ cars }: CarsPageProps) => {
  const [search, setSearch] = useState("");
  const [onlyAutomatic, setOnlyAutomatic] = useState(false);
  const [vehicleTypeSelect, setVehicleTypeSelect] =
    useState<VehicleTypeFilter>("All");
  const [category, setCategory] = useState<CategoryFilter>("All");

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

  return (
    <div>
      <CarFilters
        search={search}
        onSearchChange={setSearch}
        onlyAutomatic={onlyAutomatic}
        onToggleAutomatic={() => setOnlyAutomatic((prev) => !prev)}
        vehicleTypeSelect={vehicleTypeSelect}
        onVehicleTypeChange={setVehicleTypeSelect}
        category={category}
        onCategoryChange={setCategory}
      />
      <CarList cars={filteredCars} />
    </div>
  );
};
