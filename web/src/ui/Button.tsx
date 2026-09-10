import { ComponentProps } from "react";
import { buttonClass, type ButtonVariant } from "./buttonStyles";

type ButtonProps = ComponentProps<"button"> & {
  fullWidth?: boolean;
  variant?: ButtonVariant;
};

export const Button = ({
  children,
  fullWidth = true,
  variant = "primary",
  className = "",
  ...rest
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={buttonClass(
        variant,
        `${fullWidth ? "w-full" : ""} ${className}`,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
