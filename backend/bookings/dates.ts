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
