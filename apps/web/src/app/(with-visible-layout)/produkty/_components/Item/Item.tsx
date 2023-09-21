import { Product } from '@najit-najist/api';
import Link from 'next/link';
import { FC, Suspense } from 'react';
import { EditLink } from './EditLink';
import { ImageSlider } from './ImageSlider';
import HTMLReactParser from 'html-react-parser';
import clsx from 'clsx';

export const Item: FC<Product & { showEditLink?: boolean }> = ({
  images,
  name,
  price,
  stock,
  slug,
  id,
  description,
  publishedAt,
}) => {
  const linkHref = `/produkty/${slug}` as const;

  return (
    <div className="bg-white border border-ocean-300 rounded-lg shadow flex w-full items-stretch flex-col md:flex-row">
      <div
        className={clsx(
          'relative block w-full md:w-72 aspect-square flex-none',
          !publishedAt ? 'opacity-30' : ''
        )}
      >
        <ImageSlider
          imageUrls={images.slice(0, 4)}
          itemId={id}
          itemLink={linkHref}
        />
      </div>
      <div className="p-5 flex flex-col justify-between w-full h-full">
        <span className="mb-2 text-sm uppercase font-semibold text-ocean-400 block font-title">
          Produkt
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

        <div className="text-5xl text-deep-green-500 font-bold my-3">
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
