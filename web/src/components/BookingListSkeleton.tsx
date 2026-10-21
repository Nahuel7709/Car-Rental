import { BookingCardSkeleton } from "./BookingCardSkeleton";

type BookingListSkeletonProps = {
  count?: number;
};

export const BookingListSkeleton = ({ count = 3 }: BookingListSkeletonProps) => {
  return (
    <div>
      <div className="mb-6 space-y-2">
        <div className="h-8 w-48 animate-pulse rounded bg-ink-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-ink-200" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
