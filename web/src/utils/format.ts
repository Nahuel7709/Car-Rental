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

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

/**
 * "2026-11-10" -> "Nov 10, 2026"
 * Formats in UTC because the date is stored as UTC midnight.
 * In local time (UTC-3) it would show the day before.
 */
export function formatDate(date: string) {
  return dateFormatter.format(new Date(date));
}
