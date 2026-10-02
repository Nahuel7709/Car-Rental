import { Link, useNavigate } from "react-router";
import { useAuthContext } from "../context/auth";
import { buttonClass } from "../ui/buttonStyles";
import { useState } from "react";

export const Header = () => {
  const { loading, user, logout, authError } = useAuthContext();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleLogout() {
    setLogoutError(null);
    try {
      await logout();
      navigate("/cars");
    } catch (error) {
      setLogoutError("We couldn't log you out. Please try again.");
    }
  }

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

        <div className="flex min-h-10 items-center gap-2">
          {loading || authError ? null : user ? (
            <>
              <span className="hidden items-center gap-2 text-sm font-medium text-ink-700 sm:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                {user.name}
              </span>
              {user.role === "ADMIN" && (
                <Link to="/admin" className={buttonClass("ghost", "py-2")}>
                  Add car
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className={buttonClass("secondary", "py-2")}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={buttonClass("ghost", "py-2")}>
                Log in
              </Link>
              <Link to="/register" className={buttonClass("primary", "py-2")}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {logoutError && (
        <div role="alert" className="border-t border-red-200 bg-red-50">
          <div className="max-w-8xl mx-auto flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-700 sm:px-6">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <span className="flex-1">{logoutError}</span>
            <button
              type="button"
              onClick={() => setLogoutError(null)}
              className="cursor-pointer rounded-lg px-2 py-1 font-semibold transition-colors hover:bg-red-100"
              aria-label="Dismiss"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
