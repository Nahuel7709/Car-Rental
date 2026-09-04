import { CategoryFilter, VehicleTypeFilter } from "../interfaces/Car";

type CarFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onlyAutomatic: boolean;
  onToggleAutomatic: () => void;
  vehicleTypeSelect: VehicleTypeFilter;
  onVehicleTypeChange: (value: VehicleTypeFilter) => void;
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  onClearFilters: () => void;
  areFiltered: boolean;
};

export const CarFilters = ({
  search,
  onSearchChange,
  onlyAutomatic,
  onToggleAutomatic,
  vehicleTypeSelect,
  onVehicleTypeChange,
  category,
  onCategoryChange,
  onClearFilters,
  areFiltered,
}: CarFiltersProps) => {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <input
        className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm"
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button
        className={`rounded-full border px-4 py-2 text-sm cursor-pointer ${
          onlyAutomatic
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-gray-300 bg-white text-gray-700"
        }`}
        onClick={onToggleAutomatic}
        type="button"
        aria-pressed={onlyAutomatic}
      >
        Automatic
      </button>
      <select
        className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm"
        value={vehicleTypeSelect}
        onChange={(e) =>
          onVehicleTypeChange(e.target.value as VehicleTypeFilter)
        }
        aria-label="Vehicle type"
      >
        <option value="All">All Types</option>
        <option value="Sedan">Sedan</option>
        <option value="SUV">SUV</option>
        <option value="Family car">Family car</option>
        <option value="Station wagon">Station wagon</option>
      </select>
      <select
        className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
        aria-label="Categories"
      >
        <option value="All">All Categories</option>
        <option value="Economy">Economy</option>
        <option value="Premium">Premium</option>
        <option value="Luxury">Luxury</option>
      </select>
      {areFiltered && (
        <button
          className="rounded-full border px-4 py-2 text-sm cursor-pointer border-gray-300 bg-white text-gray-700 hover:border-red-600"
          onClick={onClearFilters}
          type="button"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
