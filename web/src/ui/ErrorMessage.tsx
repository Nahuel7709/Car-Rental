import { Button } from "./Button";

type ErrorMessageProps = {
  message: string;
  onRetry: () => void;
};

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        </svg>
      </span>
      <p className="mt-4 text-lg font-semibold text-ink-900">
        Something went wrong
      </p>
      <p className="mt-1 text-sm text-ink-700">{message}</p>
      <div className="mt-5 flex justify-center">
        <Button fullWidth={false} onClick={onRetry}>
          Try again
        </Button>
      </div>
    </div>
  );
};
