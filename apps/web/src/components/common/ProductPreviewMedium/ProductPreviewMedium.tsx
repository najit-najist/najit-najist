import { Badge } from '@components/common/Badge';
import { Price } from '@components/common/Price';
import { AddToCartButton } from '@components/page-components/ProductPageManageContent/AddToCartButton';
import { OnlyDeliveryMethodBadge } from '@components/page-components/ProductPageManageContent/editorComponents/OnlyDeliveryMethodBadge';
import { ProductWithRelationsLocal } from '@custom-types';
import { TruckIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { FC, Suspense } from 'react';
import { stripHtml } from 'string-strip-html';

import { Skeleton } from '../Skeleton';
import { EditLink } from './EditLink';
import { ImageSlider } from './ImageSlider';

export const ProductPreviewMedium: FC<
  Omit<ProductWithRelationsLocal, 'composedOf' | 'alergens'> & {
    showEditLink?: boolean;
  }
> = ({
  images,
  name,
  price,
  slug,
  id,
  description,
  publishedAt,
  stock,
  category,
  limitedToDeliveryMethods,
}) => {
  const linkHref = `/produkty/${encodeURIComponent(slug)}`;
  let descriptionPreview = stripHtml(description ?? '').result;

  if (descriptionPreview.length > 70) {
    descriptionPreview = descriptionPreview.substring(0, 70) + '...';
  }

  const outOfStock = typeof stock?.value === 'number' && !stock?.value;

  return (
    <article className="flex flex-col pt-5 sm:first:pt-0 xs:pt-0">
      <div className="relative block w-full aspect-square flex-none">
        <ImageSlider
          imageUrls={images.slice(0, 4).map(({ file }) => file)}
          itemId={id}
          itemLink={linkHref}
          outOfStrock={outOfStock}
        />
        {!publishedAt ? (
          <div
            className={clsx(
              'absolute w-full h-full bg-white opacity-50 top-0 left-0',
            )}
          />
        ) : null}
        <div className="absolute top-0 left-0 m-2 flex flex-col items-end gap-2">
          {!publishedAt ? (
            <Badge className="whitespace-nowrap">Nepublikováno</Badge>
          ) : null}
          {limitedToDeliveryMethods.length && !outOfStock ? (
            <OnlyDeliveryMethodBadge
              size="normal"
              onlyDeliveryMethods={limitedToDeliveryMethods.map((item) =>
                item.deliveryMethod.name.toLowerCase(),
              )}
            />
          ) : null}
          {outOfStock ? <Badge color="red">Vyprodáno</Badge> : null}
        </div>
        <div className="absolute bottom-0 left-0 m-2">
          <EditLink href={linkHref as any} />
        </div>
        {!outOfStock ? (
          <div className="absolute bottom-0 right-0 m-2">
            <AddToCartButton
              productId={id}
              productMetadata={{
                images,
                name,
                slug,
              }}
              disabled={!publishedAt}
              withIcon
              withoutText
            />
          </div>
        ) : null}
      </div>
      <div className="sm:pb-5 flex flex-col w-full h-full">
        <div className="flex items-center justify-between mt-3">
          <Price
            value={price ?? 0}
            // TODO
            // discount={price ?? 0}
            className={outOfStock ? 'line-through' : ''}
          />
        </div>

        <div className="flex-none">
          <Link href={linkHref} className="hover:underline">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 font-title leading-6 min-h-12">
              {name}
            </h2>
          </Link>
          <h3 className="text-project-secondary uppercase text-[12px] font-semibold mt-1.5">
            {category?.name ?? 'Ostatní'}
          </h3>
        </div>

        <p className="mb-3 font-normal text-[12px] leading-5 text-gray-700 dark:text-gray-400 tracking-wide mt-2">
          {descriptionPreview}
        </p>
      </div>
    </article>
  );
};

export const ProductPreviewMediumSkeleton: FC = () => (
  <div className="flex flex-col pt-5 sm:first:pt-0 xs:pt-0">
    <Skeleton className="relative aspect-square w-full" />
    <div className="sm:pb-5 flex flex-col w-full h-full">
      <Skeleton className="w-5/6 h-8 mt-3" />
      <div className="flex-none">
        <div className="min-h-12">
          <Skeleton className="w-2/6 h-5 mt-2" />
        </div>
        <Skeleton className="w-4/6 h-5" />
      </div>
      <Skeleton className="w-full h-10 mt-2 mb-3" />
    </div>
  </div>
);
