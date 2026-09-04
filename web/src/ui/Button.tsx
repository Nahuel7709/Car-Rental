import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  fullWidth?: boolean;
};

export const Button = ({
  children,
  fullWidth = true,
  ...rest
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-300 ${
        fullWidth ? "w-full" : ""
      }`}
      {...rest}
    >
      {children}
    </button>
  );
};
