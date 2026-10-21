import { useState } from "react";
import { addDays } from "../utils/dates";
import { formatDate } from "../utils/format";

type DateRangePickerProps = {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  minDate: string;
  maxDays: number;
};

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** All the work is done with "YYYY-MM-DD" strings and UTC dates, so days never shift. */
function toDateString(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
}

export const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDays,
}: DateRangePickerProps) => {
  const initial = new Date(startDate || minDate);
  const [year, setYear] = useState(initial.getUTCFullYear());
  const [month, setMonth] = useState(initial.getUTCMonth());
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const minMonth = new Date(minDate);
  const isFirstMonth =
    year === minMonth.getUTCFullYear() && month === minMonth.getUTCMonth();

  // Monday-first grid: empty cells before day 1
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      toDateString(year, month, i + 1),
    ),
  ];

  const choosingReturn = startDate !== "" && endDate === "";
  const lastAllowed = choosingReturn ? addDays(startDate, maxDays) : null;
  // While choosing the return day, the range follows the mouse
  const rangeEnd = endDate || (choosingReturn ? hoverDate : null);

  function goToMonth(offset: number) {
    const next = new Date(Date.UTC(year, month + offset, 1));
    setYear(next.getUTCFullYear());
    setMonth(next.getUTCMonth());
  }

  function handleSelect(day: string) {
    if (!choosingReturn || day <= startDate) {
      onChange(day, "");
    } else {
      onChange(startDate, day);
    }
  }

  function isDisabled(day: string) {
    if (day < minDate) return true;
    if (lastAllowed !== null && day > lastAllowed) return true;
    return false;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-200 bg-ink-200">
        {[
          ["Pick-up", startDate],
          ["Return", endDate],
        ].map(([label, value]) => (
          <div key={label} className="bg-white px-4 py-2.5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
              {label}
            </p>
            <p
              className={`mt-0.5 text-sm font-semibold ${
                value ? "text-ink-900" : "text-ink-500"
              }`}
            >
              {value ? formatDate(value) : "Add date"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          disabled={isFirstMonth}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous month"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <p className="text-sm font-semibold text-ink-900">
          {monthFormatter.format(new Date(Date.UTC(year, month, 1)))}
        </p>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-100"
          aria-label="Next month"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 text-center text-xs font-medium text-ink-500">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className="py-1">
            {weekday}
          </span>
        ))}
      </div>

      <div
        className="mt-1 grid grid-cols-7 gap-y-1"
        onMouseLeave={() => setHoverDate(null)}
      >
        {cells.map((day, i) => {
          if (day === null) return <span key={`empty-${i}`} />;

          const disabled = isDisabled(day);
          const isStart = day === startDate;
          const isEnd = day === rangeEnd;
          const inRange =
            startDate !== "" &&
            rangeEnd !== null &&
            day > startDate &&
            day < rangeEnd;
          const hasRange = startDate !== "" && rangeEnd !== null && rangeEnd > startDate;

          // The light band behind the range, rounded at both ends
          const band =
            hasRange && (inRange || isStart || isEnd)
              ? `bg-brand-50 ${isStart ? "rounded-l-full" : ""} ${isEnd ? "rounded-r-full" : ""}`
              : "";

          const selected = isStart || (isEnd && endDate !== "");

          return (
            <div key={day} className={band}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleSelect(day)}
                onMouseEnter={() => setHoverDate(day)}
                aria-pressed={selected}
                aria-label={formatDate(day)}
                className={`mx-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm transition-colors disabled:cursor-not-allowed disabled:text-ink-300 disabled:line-through ${
                  selected
                    ? "bg-brand-600 font-semibold text-white"
                    : isEnd
                      ? "border border-brand-500 font-semibold text-brand-700"
                      : inRange
                        ? "font-medium text-brand-700 hover:bg-brand-100"
                        : "text-ink-900 hover:bg-ink-100"
                } ${day === minDate && !selected ? "font-bold" : ""}`}
              >
                {Number(day.slice(8))}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
        <span>
          {choosingReturn
            ? `Now choose the return day (up to ${maxDays} days)`
            : startDate === ""
              ? "Choose the pick-up day"
              : ""}
        </span>
        {startDate !== "" && (
          <button
            type="button"
            onClick={() => onChange("", "")}
            className="cursor-pointer font-semibold text-ink-700 underline-offset-2 hover:underline"
          >
            Clear dates
          </button>
        )}
      </div>
    </div>
  );
};
