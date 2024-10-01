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
        <Suspense>
          <div className="absolute bottom-0 left-0 m-2">
            <EditLink href={linkHref as any} />
          </div>
        </Suspense>
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
      <div className="pb-5 flex flex-col w-full h-full">
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
