import { Skeleton } from '@components/common/Skeleton';
import { FC } from 'react';

export const ItemSkeleton: FC = () => (
  <Skeleton className="sm:max-w-sm border border-ocean-300 shadow h-[550px]" />
);
