import { Skeleton } from '@components/common/Skeleton';
import { FC } from 'react';

export const ProductSkeleton: FC = () => {
  return (
    <div className="flex space-x-6 border-b border-gray-200 py-10">
      <Skeleton className="h-20 w-20 flex-none rounded-lg sm:h-40 sm:w-40" />
      <div className="w-full">
        <Skeleton className="w-full max-w-36 h-8" />
        <Skeleton className="w-full max-w-lg mt-2 h-44" />
        <Skeleton className="w-full max-w-sm h-5 mt-6" />
      </div>
    </div>
  );
};
