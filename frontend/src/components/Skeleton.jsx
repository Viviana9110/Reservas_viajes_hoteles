const Skeleton = ({ className = "" }) => (
  <div className={`skeleton ${className}`} />
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-md p-4 space-y-3">
    <Skeleton className="h-48 w-full rounded-xl" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <div className="flex justify-between pt-2">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-9 w-24 rounded-md" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-200">
    <Skeleton className="h-14 w-14 rounded-lg" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-20 rounded-md" />
  </div>
);

export default Skeleton;
