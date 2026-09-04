import { CarCardSkeleton } from "./CarCardSkeleton";


type CarListSkeletonProps = {
  count?: number;
};

export const CarListSkeleton = ({ count = 6 }: CarListSkeletonProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
};
