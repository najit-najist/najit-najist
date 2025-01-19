import {
  ProductPreviewMedium,
  ProductPreviewMediumSkeleton,
} from '@components/common/ProductPreviewMedium';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { getProducts } from '@server/utils/getProducts';
import Link from 'next/link';
import { FC, Suspense } from 'react';

const Items: FC = async () => {
  const { items } = await getProducts({
    perPage: 4,
    sortBy: {
      publishedAt: 'desc',
    },
  });

  return items.map((post) => <ProductPreviewMedium key={post.id} {...post} />);
};

export const LatestProducts: FC = () => {
  return (
    <div className="container mx-auto mt-20">
      <div className="mx-auto flex flex-col sm:flex-row sm:items-center justify-between mt-10 mb-2 sm:mb-7">
        <h2 className="text-3xl sm:text-4xl font-bold font-title">
          Nejnovější produkty
        </h2>
        <Link
          href="/produkty"
          className="text-project-primary group hover:underline mt-3 sm:-mt-2"
        >
          Další produkty
          <ArrowRightIcon className="w-5 ml-3 inline-block -top-0.5 relative group-hover:translate-x-2 duration-150" />
        </Link>
      </div>
      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Suspense
          fallback={new Array(4).fill(1).map((_value, index) => (
            <ProductPreviewMediumSkeleton key={index} />
          ))}
        >
          <Items />
        </Suspense>
      </div>
    </div>
  );
};
