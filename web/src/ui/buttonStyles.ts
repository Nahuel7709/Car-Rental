export type ButtonVariant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center cursor-pointer rounded-xl px-4 py-2.5 " +
  "text-sm font-semibold transition-colors focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700",
  secondary:
    "border border-ink-300 bg-white text-ink-900 hover:border-ink-500 hover:bg-ink-100",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100",
};

/**
 * Devuelve las clases de un boton.
 * Sirve tanto para un <button> como para un <Link> que tiene que verse igual.
 */
export function buttonClass(variant: ButtonVariant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`.trim();
}
