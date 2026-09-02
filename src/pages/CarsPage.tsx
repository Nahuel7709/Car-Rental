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

  const filteredCars = cars.filter((car) => {
    const searchFilter =
      car.brand.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase());

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
        onVehicleTypeSelect={setVehicleTypeSelect}
        category={category}
        onCategory={setCategory}
      />
      <CarList cars={filteredCars} />
    </div>
  );
};
