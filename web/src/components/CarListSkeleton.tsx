import { CarCardSkeleton } from "./CarCardSkeleton";

type CarListSkeletonProps = {
  count?: number;
};

export const CarListSkeleton = ({ count = 8 }: CarListSkeletonProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
};
