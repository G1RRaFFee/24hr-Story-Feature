import { JSX, memo } from "react";

import { Skeleton } from "../ui/skeleton";
import { Plus } from "lucide-react";

const StoriesSkeleton = memo((): JSX.Element => {
  const skeletonItems = Array(5).fill(null);
  return (
    <div className="flex items-center space-x-4">
      <button>
        <Plus size={20} />
      </button>
      {skeletonItems.map((_, index) => (
        <Skeleton key={index} className="h-12 w-12 rounded-full" />
      ))}
    </div>
  );
});

export default StoriesSkeleton;
