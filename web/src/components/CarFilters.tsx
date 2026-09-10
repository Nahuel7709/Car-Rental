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

const selectClass =
  "cursor-pointer appearance-none rounded-xl border border-ink-300 bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22 stroke-linecap=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat py-2.5 pl-4 pr-10 text-sm font-medium text-ink-900 transition-colors hover:border-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500";

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
    <div className="sticky top-16 z-10 mb-8 rounded-2xl border border-ink-200 bg-white/90 p-3 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-56 flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <input
            className="w-full rounded-xl border border-ink-300 bg-white py-2.5 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-500 transition-colors hover:border-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            type="text"
            placeholder="Search by brand or model"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search"
          />
        </div>

        <button
          className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
            onlyAutomatic
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-ink-300 bg-white text-ink-900 hover:border-ink-500"
          }`}
          onClick={onToggleAutomatic}
          type="button"
          aria-pressed={onlyAutomatic}
        >
          Automatic
        </button>

        <select
          className={selectClass}
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
          className={selectClass}
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
            className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-700 underline-offset-4 transition-colors hover:bg-brand-50 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500"
            onClick={onClearFilters}
            type="button"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};
