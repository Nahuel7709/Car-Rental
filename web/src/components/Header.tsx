import { Link } from "react-router";

export const Header = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-ink-200 bg-white/85 backdrop-blur">
      <div className="max-w-8xl mx-auto flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link to="/cars" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm18 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
              <path d="M3 17v-4.2a2 2 0 0 1 .3-1L5.6 8A2 2 0 0 1 7.3 7h9.4a2 2 0 0 1 1.7 1l2.3 3.8a2 2 0 0 1 .3 1V17" />
              <path d="M7 12h10" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-ink-900">
            Car<span className="text-brand-600">Rental</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-700 sm:flex">
          <Link to="/cars" className="transition-colors hover:text-brand-700">
            Cars
          </Link>
          <span className="cursor-default">Locations</span>
          <span className="cursor-default">Help</span>
        </nav>
      </div>
    </header>
  );
};
