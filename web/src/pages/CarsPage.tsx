import { useState } from "react";
import { Car, VehicleTypeFilter, CategoryFilter } from "../interfaces/Car";
import { CarList } from "../components/CarList";
import { CarFilters } from "../components/CarFilters";
import { CarListSkeleton } from "../components/CarListSkeleton";
import { ErrorMessage } from "../ui/ErrorMessage";

type CarsPageProps = {
  cars: Car[];
  loading: boolean;
  error: string | null;
  getCars: () => void;
};

export const CarsPage = ({ cars, loading, error, getCars }: CarsPageProps) => {
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

  if (loading) return <CarListSkeleton />;
  if (error) return <ErrorMessage message={error} onRetry={getCars} />;
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
        onClearFilters={clearFilters}
        areFiltered={areFiltered}
      />
      <CarList cars={filteredCars} />
    </div>
  );
};
