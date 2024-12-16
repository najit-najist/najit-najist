'use client';

import { getFileUrl } from '@components/common/internal/getFileUrl';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { recipes } from '@najit-najist/database/models';
import clsx from 'clsx';
import { useKeenSlider } from 'keen-slider/react.es';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { Button } from '../Button';

const arrowClassName = clsx('w-6 h-6 ');

export const ImageSlider: FC<{
  imageUrls: string[];
  itemLink: string;
  itemId: number;
}> = ({ imageUrls, itemLink, itemId }) => {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { spacing: 10 },
    disabled: !imageUrls.length,
  });

  return (
    <>
      <Link href={itemLink as any}>
        <div ref={sliderRef} className="keen-slider h-full">
          {imageUrls.map((imageName) => (
            <div key={imageName} className="keen-slider__slide min-w-full">
              <Image
                width={300}
                height={300}
                src={getFileUrl(recipes, itemId, imageName)}
                alt=""
                className="rounded-project absolute top-0 left-0 w-full h-full object-center object-cover"
              />
            </div>
          ))}
        </div>
      </Link>
      {imageUrls.length > 1 ? (
        <div className="absolute flex m-4 bottom-0 right-0 gap-2">
          <Button
            onClick={() => {
              instanceRef.current?.prev();
            }}
            className="!px-1 !py-3 w-12 h-12"
          >
            <ArrowLeftIcon className={arrowClassName} />
          </Button>
          <Button
            onClick={() => {
              instanceRef.current?.next();
            }}
            className="!px-1 !py-3 w-12 h-12"
          >
            <ArrowRightIcon className={arrowClassName} />
          </Button>
        </div>
      ) : null}
    </>
  );
};
