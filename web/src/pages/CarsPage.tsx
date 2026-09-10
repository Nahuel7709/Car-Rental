import { CarList } from "../components/CarList";
import { CarFilters } from "../components/CarFilters";
import { CarListSkeleton } from "../components/CarListSkeleton";
import { ErrorMessage } from "../ui/ErrorMessage";
import { useCarsContext } from "../context/cars";
import { useFilters } from "../hooks/useFilters";

export const CarsPage = () => {
  const { cars, loading, error, getCars } = useCarsContext();
  const {
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
  } = useFilters(cars);

  if (loading) return <CarListSkeleton />;
  if (error) return <ErrorMessage message={error} onRetry={getCars} />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          Cars available
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          {filteredCars.length} {filteredCars.length === 1 ? "car" : "cars"}
          {areFiltered && " matching your filters"}
        </p>
      </div>

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
