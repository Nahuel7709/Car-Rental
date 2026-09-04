import { Button } from "./Button";

type ErrorMessageProps = {
  message: string;
  onRetry: () => void;
};

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-lg font-semibold text-red-800">Something went wrong</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      <Button fullWidth={false} onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
};
