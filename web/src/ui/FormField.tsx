import { ComponentProps } from "react";

type FormFieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

const baseInput =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-ink-100";

export const FormField = ({
  id,
  label,
  error,
  hint,
  ...rest
}: FormFieldProps) => {
  const stateClass = error
    ? "border-red-400 hover:border-red-500 focus:ring-red-400"
    : "border-ink-300 hover:border-ink-500 focus:ring-brand-500";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-700">
        {label}
      </label>
      <input
        id={id}
        className={`${baseInput} ${stateClass}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-message` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${id}-message`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-message`} className="text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
