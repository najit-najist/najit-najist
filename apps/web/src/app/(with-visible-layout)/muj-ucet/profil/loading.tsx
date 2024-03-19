import { Skeleton } from '@najit-najist/ui';

export default function Loading() {
  return (
    <div className="container grid grid-cols-1 md:grid-cols-6 mx-auto my-5">
      <div className="col-span-2 px-5 sm:px-10 mb-5 md:mb-0 pt-5">
        <Skeleton className="w-full aspect-square" rounded="full" />
      </div>
      <div className="col-span-4">
        <Skeleton className="w-full min-h-[80vh]" />
      </div>
    </div>
  );
}
