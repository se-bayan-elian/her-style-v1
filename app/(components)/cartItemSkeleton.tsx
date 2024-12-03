import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function CartItemsSkeleton() {
  return (
    <div className="grid grid-cols-12 md:gap-4 gap-2 mb-4 w-full opacity-50">
      <div className="col-span-3">
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex flex-col gap-1 col-span-5 items-end text-right justify-between">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <div className="flex items-start justify-start space-x-1">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-6" />
        </div>
      </div>
      <div className="relative h-[100px] col-span-4">
        <Skeleton className="h-full w-full rounded" />
        <Skeleton className="absolute top-2 right-2 h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}

export default CartItemsSkeleton;
