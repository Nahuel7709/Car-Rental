import { CategoryFilter, VehicleTypeFilter } from "../interfaces/Car";

type CarFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onlyAutomatic: boolean;
  onToggleAutomatic: () => void;
  vehicleTypeSelect: VehicleTypeFilter;
  onVehicleTypeSelect: (value: VehicleTypeFilter) => void;
  category: CategoryFilter;
  onCategory: (value: CategoryFilter) => void;
};

export const CarFilters = ({
  search,
  onSearchChange,
  onlyAutomatic,
  onToggleAutomatic,
  vehicleTypeSelect,
  onVehicleTypeSelect,
  category,
  onCategory,
}: CarFiltersProps) => {
  return (
    <div className="m-5">
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button
        className={onlyAutomatic ? "bg-amber-500" : "bg-blue-50"}
        onClick={onToggleAutomatic}
        type="button"
        aria-pressed={onlyAutomatic}
      >
        Automatic
      </button>
      <select
        value={vehicleTypeSelect}
        name="VehicleType"
        onChange={(e) =>
          onVehicleTypeSelect(e.target.value as VehicleTypeFilter)
        }
      >
        <option value="All">All</option>
        <option value="Sedan">Sedan</option>
        <option value="SUV">SUV</option>
        <option value="Family car">Family car</option>
        <option value="Station wagon">Station wagon</option>
      </select>
      <select
        value={category}
        name="category"
        onChange={(e) => onCategory(e.target.value as CategoryFilter)}
      >
        <option value="All">All</option>
        <option value="Economy">Economy</option>
        <option value="Premium">Premium</option>
        <option value="Luxury">Luxury</option>
      </select>
    </div>
  );
};
