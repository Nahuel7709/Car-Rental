const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/** 2947 -> "$ 2.947" */
export function money(value: number) {
  return priceFormatter.format(value);
}

/** plural(1, "seat", "seats") -> "1 seat" */
export function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}
