export const CarCardSkeleton = () => {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
      <div className="aspect-4/3 animate-pulse bg-ink-200" />
      <div className="flex flex-1 flex-col gap-3 border-t border-ink-200 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-ink-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-ink-200" />
        <div className="flex gap-1.5">
          <div className="h-6 w-20 animate-pulse rounded-full bg-ink-200" />
          <div className="h-6 w-32 animate-pulse rounded-full bg-ink-200" />
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div className="space-y-1.5">
            <div className="h-5 w-24 animate-pulse rounded bg-ink-200" />
            <div className="h-3 w-20 animate-pulse rounded bg-ink-200" />
          </div>
          <div className="h-10 w-20 animate-pulse rounded-xl bg-ink-200" />
        </div>
      </div>
    </article>
  );
};
