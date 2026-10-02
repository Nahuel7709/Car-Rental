import { useState } from "react";
import { createCarRequest } from "../api/cars";
import {
  CategoryValue,
  CreateCarInput,
  GearboxValue,
  VehicleTypeValue,
} from "../interfaces/CreateCarInput";
import { Button } from "../ui/Button";
import { FormAlert } from "../ui/FormAlert";
import { FormField } from "../ui/FormField";
import { FormSelect } from "../ui/FormSelect";

const initialForm = {
  brand: "",
  model: "",
  year: "",
  imageUrl: "",
  vehicleType: "SEDAN",
  category: "ECONOMY",
  gearbox: "MANUAL",
  pricePerDay: "",
  seats: "",
  bagCapacity: "",
  suitcaseCapacity: "",
  ageRequired: "",
};

const vehicleTypeOptions = [
  { value: "SEDAN", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "FAMILY_CAR", label: "Family car" },
  { value: "STATION_WAGON", label: "Station wagon" },
];

const categoryOptions = [
  { value: "ECONOMY", label: "Economy" },
  { value: "PREMIUM", label: "Premium" },
  { value: "LUXURY", label: "Luxury" },
];

const gearboxOptions = [
  { value: "MANUAL", label: "Manual" },
  { value: "AUTOMATIC", label: "Automatic" },
];

type CarForm = typeof initialForm;
type CarFieldErrors = Partial<Record<keyof CarForm, string>>;

function isWholeNumber(value: string) {
  return value.trim() !== "" && Number.isInteger(Number(value));
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validateCar(form: CarForm): CarFieldErrors {
  const errors: CarFieldErrors = {};

  if (form.brand.trim().length < 2) {
    errors.brand = "Brand has a minimum of 2 characters";
  }
  if (form.model.trim().length < 2) {
    errors.model = "Model has a minimum of 2 characters";
  }
  if (!isWholeNumber(form.year)) {
    errors.year = "Year is required";
  } else if (Number(form.year) < 1900 || Number(form.year) > 2040) {
    errors.year = "Year must be between 1900 and 2040";
  }
  if (form.imageUrl.trim() !== "" && !isValidUrl(form.imageUrl.trim())) {
    errors.imageUrl = "Enter a valid URL (https://...)";
  }
  if (!isWholeNumber(form.pricePerDay)) {
    errors.pricePerDay = "Price is required";
  } else if (Number(form.pricePerDay) < 1 || Number(form.pricePerDay) > 200000) {
    errors.pricePerDay = "Price must be between 1 and 200000";
  }
  if (!isWholeNumber(form.seats)) {
    errors.seats = "Seats is required";
  } else if (Number(form.seats) < 1 || Number(form.seats) > 30) {
    errors.seats = "Seats must be between 1 and 30";
  }
  if (!isWholeNumber(form.bagCapacity)) {
    errors.bagCapacity = "Bags is required";
  } else if (Number(form.bagCapacity) < 0 || Number(form.bagCapacity) > 20) {
    errors.bagCapacity = "Bags must be between 0 and 20";
  }
  if (!isWholeNumber(form.suitcaseCapacity)) {
    errors.suitcaseCapacity = "Suitcases is required";
  } else if (
    Number(form.suitcaseCapacity) < 0 ||
    Number(form.suitcaseCapacity) > 20
  ) {
    errors.suitcaseCapacity = "Suitcases must be between 0 and 20";
  }
  if (!isWholeNumber(form.ageRequired)) {
    errors.ageRequired = "Minimum age is required";
  } else if (Number(form.ageRequired) < 18 || Number(form.ageRequired) > 50) {
    errors.ageRequired = "Minimum age must be between 18 and 50";
  }

  return errors;
}

export const AdminPage = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<CarFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const errors = validateCar(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    const input: CreateCarInput = {
      brand: form.brand,
      model: form.model,
      year: Number(form.year),
      imageUrl: form.imageUrl.trim() === "" ? undefined : form.imageUrl.trim(),
      vehicleType: form.vehicleType as VehicleTypeValue,
      category: form.category as CategoryValue,
      gearbox: form.gearbox as GearboxValue,
      pricePerDay: Number(form.pricePerDay),
      seats: Number(form.seats),
      bagCapacity: Number(form.bagCapacity),
      suitcaseCapacity: Number(form.suitcaseCapacity),
      ageRequired: Number(form.ageRequired),
    };

    try {
      const car = await createCarRequest(input);
      setSuccess(`${car.brand} ${car.model} was created`);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl py-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
          Admin
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink-900">
          Add a new car
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Fill in the details to add a car to the catalog.
        </p>
      </div>

      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm sm:p-8">
        {error && (
          <div className="-mt-6 mb-6">
            <FormAlert message={error} />
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-6 flex items-start gap-2.5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 3 3 5-6" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-8"
        >
          <section>
            <h2 className="text-sm font-semibold text-ink-900">Basic info</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField
                id="brand"
                name="brand"
                label="Brand"
                placeholder="Toyota"
                value={form.brand}
                error={fieldErrors.brand}
                onChange={handleChange}
                disabled={submitting}
              />
              <FormField
                id="model"
                name="model"
                label="Model"
                placeholder="Corolla"
                value={form.model}
                error={fieldErrors.model}
                onChange={handleChange}
                disabled={submitting}
              />
              <FormField
                id="year"
                name="year"
                label="Year"
                type="number"
                placeholder="2024"
                value={form.year}
                error={fieldErrors.year}
                onChange={handleChange}
                disabled={submitting}
              />
              <FormField
                id="imageUrl"
                name="imageUrl"
                label="Image URL"
                type="url"
                placeholder="https://..."
                hint="Optional."
                value={form.imageUrl}
                error={fieldErrors.imageUrl}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-ink-900">Type</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <FormSelect
                id="vehicleType"
                name="vehicleType"
                label="Vehicle type"
                options={vehicleTypeOptions}
                value={form.vehicleType}
                onChange={handleChange}
                disabled={submitting}
              />
              <FormSelect
                id="category"
                name="category"
                label="Category"
                options={categoryOptions}
                value={form.category}
                onChange={handleChange}
                disabled={submitting}
              />
              <FormSelect
                id="gearbox"
                name="gearbox"
                label="Gearbox"
                options={gearboxOptions}
                value={form.gearbox}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-ink-900">
              Capacity and conditions
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField
                id="pricePerDay"
                name="pricePerDay"
                label="Price per day"
                type="number"
                placeholder="50"
                value={form.pricePerDay}
                error={fieldErrors.pricePerDay}
                onChange={handleChange}
                disabled={submitting}
              />
              <FormField
                id="seats"
                name="seats"
                label="Seats"
                type="number"
                placeholder="5"
                value={form.seats}
                error={fieldErrors.seats}
                onChange={handleChange}
                disabled={submitting}
              />
              <FormField
                id="bagCapacity"
                name="bagCapacity"
                label="Bags"
                type="number"
                placeholder="2"
                value={form.bagCapacity}
                error={fieldErrors.bagCapacity}
                onChange={handleChange}
                disabled={submitting}
              />
              <FormField
                id="suitcaseCapacity"
                name="suitcaseCapacity"
                label="Suitcases"
                type="number"
                placeholder="1"
                value={form.suitcaseCapacity}
                error={fieldErrors.suitcaseCapacity}
                onChange={handleChange}
                disabled={submitting}
              />
              <FormField
                id="ageRequired"
                name="ageRequired"
                label="Minimum age"
                type="number"
                placeholder="21"
                value={form.ageRequired}
                error={fieldErrors.ageRequired}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </section>

          <div className="flex justify-end border-t border-ink-200 pt-6">
            <Button
              type="submit"
              fullWidth={false}
              disabled={submitting}
              className="disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating car..." : "Create car"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
