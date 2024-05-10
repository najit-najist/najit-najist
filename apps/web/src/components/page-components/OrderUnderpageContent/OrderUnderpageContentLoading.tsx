import { Skeleton } from '@najit-najist/ui';
import { FC } from 'react';

import { OrderSubtitleSkeleton } from './OrderSubtitleSkeleton';
import { ProductSkeleton } from './ProductSkeleton';

export const OrderUnderpageContentLoading: FC = () => {
  return (
    <div className="pb-24 pt-16">
      <div className="mx-auto container">
        <Skeleton className="max-w-72 w-full h-6" />
        <OrderSubtitleSkeleton />
        <Skeleton className="mt-12 h-5 w-28" />
        <Skeleton className="mt-2 h-5 w-9" />
        <div className="mt-10 border-t border-gray-200">
          {new Array(3).fill(true).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
