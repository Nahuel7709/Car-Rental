//todayInBuenosAires(): Returns the date today in Buenos Aires as string YYYY-MM-DD.
export function todayInBuenosAires() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());
}

//daysBetween(start, end): Receives two strings and returns the amount of days.
export function daysBetween(start: string, end: string) {
  const totalDays = (Date.parse(end) - Date.parse(start)) / 86400000;
  return totalDays;
}

/** addDays("2026-11-10", 3) -> "2026-11-13". Works in UTC, so it never shifts a day. */
export function addDays(date: string, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}
