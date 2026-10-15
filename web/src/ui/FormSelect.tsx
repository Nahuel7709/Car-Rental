import { ComponentProps } from "react";

type FormSelectOption = {
  value: string;
  label: string;
};

type FormSelectProps = ComponentProps<"select"> & {
  id: string;
  label: string;
  options: FormSelectOption[];
};

const selectClass =
  "w-full cursor-pointer appearance-none rounded-xl border border-ink-300 bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22 stroke-linecap=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat py-2.5 pl-4 pr-10 text-sm text-ink-900 transition-colors hover:border-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-ink-100";

export const FormSelect = ({ id, label, options, ...rest }: FormSelectProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-700">
        {label}
      </label>
      <select id={id} className={selectClass} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
