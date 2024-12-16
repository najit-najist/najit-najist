import { Skeleton } from '@components/common/Skeleton';

export default function Loading() {
  return (
    <div className="w-full">
      <Skeleton className="w-full min-h-96" />
    </div>
  );
}
