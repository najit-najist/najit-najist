'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { products } from '@najit-najist/database/models';
import { getFileUrl } from '@server/utils/getFileUrl';
import clsx from 'clsx';
import { useKeenSlider } from 'keen-slider/react.es';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const arrowButtonClassName = clsx(
  'bg-white p-2 hover:bg-green-50 first-of-type:rounded-l last-of-type:rounded-r',
);
const arrowClassName = clsx('w-4 h-4');

export const ImageSlider: FC<{
  imageUrls: string[];
  itemLink: string;
  itemId: number;
  outOfStrock?: boolean;
}> = ({ imageUrls, itemLink, itemId, outOfStrock }) => {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { spacing: 10 },
    disabled: !imageUrls.length,
  });

  return (
    <>
      <Link href={itemLink as any}>
        <div
          ref={sliderRef}
          className={clsx(
            'keen-slider h-full rounded-lg overflow-hidden hover:shadow-2xl duration-200',
            outOfStrock && 'opacity-50',
          )}
        >
          {imageUrls.map((imageName) => (
            <div key={imageName} className="keen-slider__slide min-w-full">
              <Image
                width={300}
                height={300}
                src={getFileUrl(products, itemId, imageName, { width: 300 })}
                alt=""
                className="rounded-t-lg md:rounded-tr-none md:rounded-l-lg absolute top-0 left-0 w-full h-full object-center object-cover"
              />
            </div>
          ))}
        </div>
      </Link>
      {imageUrls.length > 1 ? (
        <div className="absolute flex m-4 bottom-0 right-0">
          <button
            onClick={() => {
              instanceRef.current?.prev();
            }}
            className={arrowButtonClassName}
          >
            <ArrowLeftIcon className={arrowClassName} />
          </button>
          <button
            onClick={() => {
              instanceRef.current?.next();
            }}
            className={arrowButtonClassName}
          >
            <ArrowRightIcon className={arrowClassName} />
          </button>
        </div>
      ) : null}
    </>
  );
};
