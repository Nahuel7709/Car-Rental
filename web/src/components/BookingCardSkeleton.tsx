export const BookingCardSkeleton = () => {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm sm:flex-row">
      <div className="aspect-4/3 animate-pulse bg-ink-200 sm:aspect-auto sm:w-56" />
      <div className="flex flex-1 flex-col gap-4 border-t border-ink-200 p-5 sm:border-l sm:border-t-0">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-ink-200" />
            <div className="h-3 w-24 animate-pulse rounded bg-ink-200" />
          </div>
          <div className="h-6 w-20 animate-pulse rounded-full bg-ink-200" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 animate-pulse rounded-xl bg-ink-200" />
          <div className="h-10 animate-pulse rounded-xl bg-ink-200" />
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="h-5 w-24 animate-pulse rounded bg-ink-200" />
          <div className="h-10 w-24 animate-pulse rounded-xl bg-ink-200" />
        </div>
      </div>
    </article>
  );
};
