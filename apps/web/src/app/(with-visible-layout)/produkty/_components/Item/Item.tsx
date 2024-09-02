import { AddToCartButton } from '@components/page-components/ProductPageManageContent/AddToCartButton';
import { ProductWithRelationsLocal } from '@custom-types';
import { TruckIcon } from '@heroicons/react/20/solid';
import { Badge, Price } from '@najit-najist/ui';
import clsx from 'clsx';
import Link from 'next/link';
import { FC, Suspense } from 'react';
import { stripHtml } from 'string-strip-html';

import { EditLink } from './EditLink';
import { ImageSlider } from './ImageSlider';

export const Item: FC<
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
  onlyForDeliveryMethod,
}) => {
  const linkHref = `/produkty/${encodeURIComponent(slug)}`;
  let descriptionPreview = stripHtml(description ?? '').result;

  if (descriptionPreview.length > 70) {
    descriptionPreview = descriptionPreview.substring(0, 70) + '...';
  }

  const outOfStock = typeof stock?.value === 'number' && !stock?.value;

  return (
    <article className="flex flex-col pt-5 first:pt-0 xs:pt-0">
      <div className={clsx('relative block w-full aspect-square flex-none')}>
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
          {onlyForDeliveryMethod && !outOfStock ? (
            <Badge color="yellow">
              <TruckIcon className="w-4 h-4" />
              Pouze {onlyForDeliveryMethod.name.toLowerCase()}
            </Badge>
          ) : null}
          {outOfStock ? <Badge color="red">Vyprodáno</Badge> : null}
        </div>
        <div className="absolute bottom-0 left-0 m-2 flex flex-col items-end gap-2">
          <Suspense>
            <EditLink href={linkHref as any} />
          </Suspense>
        </div>
      </div>
      <div className="pb-5 flex flex-col justify-between w-full h-full">
        <div className="flex-none">
          <h3 className="text-project-secondary uppercase text-sm font-semibold mt-4 mb-1">
            {category?.name ?? 'Ostatní'}
          </h3>
          <Link href={linkHref} className="hover:underline">
            <h2 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-title">
              {name}
            </h2>
          </Link>
        </div>

        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 tracking-wide">
          {descriptionPreview}
        </p>

        <div className="flex items-center justify-between">
          <Price
            value={price?.value ?? 0}
            className={outOfStock ? 'line-through' : ''}
          />
          {!outOfStock ? (
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
          ) : null}
        </div>
      </div>
    </article>
  );
};
