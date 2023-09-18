import { Product, stripHtml } from '@najit-najist/api';
import Link from 'next/link';
import { FC } from 'react';
import { EditLink } from './EditLink';
import { ImageSlider } from './ImageSlider';
import { ItemLink } from './ItemLink';

export const Item: FC<Product & { showEditLink?: boolean }> = ({
  images,
  name,
  price,
  stock,
  slug,
  id,
  description,
}) => {
  const linkHref = `/produkty/${slug}` as const;

  return (
    <div className="bg-white border border-ocean-300 rounded-lg shadow flex w-full items-stretch flex-col md:flex-row">
      <div className="relative block w-full md:w-72 aspect-square flex-none">
        <ImageSlider
          imageUrls={images.slice(0, 4)}
          itemId={id}
          itemLink={linkHref}
        />
      </div>
      <div className="p-5 flex flex-col justify-between w-full h-full">
        <div className="flex-none">
          <Link href={linkHref}>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 font-title">
              {name}
            </h5>
          </Link>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
            {stripHtml(description ?? '').result}
          </p>
        </div>
        <div className="flex justify-between mt-auto">
          <ItemLink href={linkHref} />
          <EditLink href={linkHref} />
        </div>
      </div>
    </div>
  );
};
