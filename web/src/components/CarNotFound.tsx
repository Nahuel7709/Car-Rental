import { Link } from "react-router";
import { buttonClass } from "../ui/buttonStyles";

export const CarNotFound = () => {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-500">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
          aria-hidden="true"
        >
          <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm18 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
          <path d="M3 17v-4.2a2 2 0 0 1 .3-1L5.6 8A2 2 0 0 1 7.3 7h9.4a2 2 0 0 1 1.7 1l2.3 3.8a2 2 0 0 1 .3 1V17" />
          <path d="m9 10 6 4M15 10l-6 4" />
        </svg>
      </span>

      <h2 className="mt-4 text-xl font-bold text-ink-900">
        We couldn't find that car
      </h2>

      <p className="mt-2 text-sm text-ink-500">
        It may no longer be available, or the link may be wrong.
      </p>

      <Link to="/cars" className={buttonClass("primary", "mt-6")}>
        Browse all cars
      </Link>
    </div>
  );
};
