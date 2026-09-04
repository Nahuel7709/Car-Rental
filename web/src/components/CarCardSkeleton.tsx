export const CarCardSkeleton = () => {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3 animate-pulse">
      <div className="h-5 w-2/3 rounded bg-gray-200" />
      <div className="h-4 w-1/2 rounded bg-gray-200" />
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-20 rounded-full bg-gray-200" />
        <div className="h-6 w-16 rounded-full bg-gray-200" />
        <div className="h-6 w-24 rounded-full bg-gray-200" />
      </div>
      <div className="w-full aspect-video rounded-lg bg-gray-200" />
      <div className="mt-auto flex flex-col gap-3">
        <div className="h-7 w-1/3 rounded bg-gray-200" />
        <div className="h-10 w-full rounded-lg bg-gray-200" />
      </div>
    </article>
  );
};
