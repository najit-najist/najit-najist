import { Skeleton } from '@components/common/Skeleton';
import { FC } from 'react';

export const ProductSkeleton: FC = () => {
  return (
    <div className="flex space-x-6 border-b border-gray-200 py-10">
      <Skeleton className="h-24 w-24 flex-none rounded-project sm:h-20 sm:w-20" />
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full">
          <Skeleton className="w-full max-w-20 h-5" />
          <Skeleton className="w-full max-w-56 mt-2 h-8" />
        </div>
        <div className="ml-auto pt-6 md:pt-8 flex">
          <Skeleton className="w-20 h-6" />
          <Skeleton className="w-32 h-6 ml-10" />
        </div>
      </div>
    </div>
  );
};
