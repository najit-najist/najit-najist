import { Skeleton } from '@components/common/Skeleton';

export default function Loading() {
  return (
    <div className="w-full space-y-5">
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full min-h-[80vh]" />
    </div>
  );
}
