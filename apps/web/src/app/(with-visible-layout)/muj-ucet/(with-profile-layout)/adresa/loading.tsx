import { Skeleton } from '@najit-najist/ui';

export default function Loading() {
  return (
    <div className="w-full my-5">
        <Skeleton className="w-full min-h-[80vh]" />
    </div>
  );
}
