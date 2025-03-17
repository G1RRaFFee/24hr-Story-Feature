import { JSX, memo } from "react";
import { Plus } from "lucide-react";

import { Skeleton } from "../ui/skeleton";

const StoriesSkeleton = memo((): JSX.Element => {
  const skeletonItems = Array(5).fill(null);
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full flex items-center justify-center">
        <Plus className="opacity-25" size={20} />
      </Skeleton>
      {skeletonItems.map((_, index) => (
        <Skeleton key={index} className="h-12 w-12 rounded-full" />
      ))}
    </div>
  );
});

export default StoriesSkeleton;
