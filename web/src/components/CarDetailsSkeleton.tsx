export const CarDetailsSkeleton = () => {
  return (
    <div>
      <div className="h-4 w-28 animate-pulse rounded bg-ink-200" />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="aspect-2/1 animate-pulse rounded-2xl bg-ink-200" />
          <div className="mt-6 h-8 w-2/3 animate-pulse rounded bg-ink-200" />
          <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-ink-200" />
          <div className="mt-6 flex gap-2">
            <div className="h-7 w-24 animate-pulse rounded-full bg-ink-200" />
            <div className="h-7 w-28 animate-pulse rounded-full bg-ink-200" />
            <div className="h-7 w-20 animate-pulse rounded-full bg-ink-200" />
          </div>
        </div>

        <div className="h-56 animate-pulse rounded-2xl bg-ink-200" />
      </div>
    </div>
  );
};
