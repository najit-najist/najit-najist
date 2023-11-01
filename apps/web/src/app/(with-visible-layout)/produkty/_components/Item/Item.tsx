import { Product } from '@najit-najist/api';
import Link from 'next/link';
import { FC, Suspense } from 'react';
import { EditLink } from './EditLink';
import { ImageSlider } from './ImageSlider';
import HTMLReactParser from 'html-react-parser';
import clsx from 'clsx';
import { Badge } from '@najit-najist/ui';

export const Item: FC<Product & { showEditLink?: boolean }> = ({
  images,
  name,
  price,
  slug,
  id,
  description,
  publishedAt,
  category,
}) => {
  const linkHref = `/produkty/${slug}` as const;

  return (
    <div className="bg-white border border-ocean-300 rounded-lg shadow flex w-full items-stretch flex-col md:flex-row">
      <div
        className={clsx(
          'relative block w-full md:w-72 aspect-square flex-none'
        )}
      >
        <ImageSlider
          imageUrls={images.slice(0, 4)}
          itemId={id}
          itemLink={linkHref}
        />
        {!publishedAt ? (
          <div
            className={clsx(
              'absolute w-full h-full bg-white opacity-50 top-0 left-0'
            )}
          />
        ) : null}
        <div className="absolute top-0 right-0 m-2 flex flex-col items-end gap-2">
          {!publishedAt ? (
            <Badge className="whitespace-nowrap">Nepublikováno</Badge>
          ) : null}
        </div>
      </div>
      <div className="p-5 flex flex-col justify-between w-full h-full">
        <span className="mb-2 text-sm uppercase font-semibold text-project-accent block font-title">
          Produkt - <Badge color="blue">{category?.name ?? 'Ostatní'}</Badge>
        </span>
        <div className="flex-none flex items-center justify-between">
          <Link href={linkHref}>
            <h5 className="mb-2 text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 font-title">
              {name}
            </h5>
          </Link>
          <Suspense>
            <EditLink href={linkHref as any} />
          </Suspense>
        </div>

        <div className="text-5xl text-project-primary font-bold my-3">
          <span className="tracking-wider">{price.value}</span>
          <span className="tracking-[-0.1rem] underline text-gray-700 text-3xl ml-1">
            Kč
          </span>
        </div>

        <div className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-3 tracking-wide">
          {HTMLReactParser(description ?? '')}
        </div>
        {/* <div className="flex justify-between mt-auto">
          <ItemLink href={linkHref} />
        </div> */}
      </div>
    </div>
  );
};
