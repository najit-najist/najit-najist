import {
  AcademicCapIcon,
  ArchiveBoxIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { extractTimeFromSteps, Recipe, stripHtml } from '@najit-najist/api';
import { Badge } from '@najit-najist/ui';
import Link from 'next/link';
import { FC } from 'react';
import { EditLink } from './EditLink';
import { ImageSlider } from './ImageSlider';
import { ItemLink } from './ItemLink';

export const Item: FC<Recipe & { showEditLink?: boolean }> = ({
  images,
  slug,
  title,
  id,
  description,
  steps,
  difficulty,
  type,
}) => {
  const linkHref = `/recepty/${slug}` as const;

  return (
    <div className="max-w-sm bg-white border border-ocean-300 rounded-lg shadow flex flex-col">
      <div className="relative block w-full aspect-square flex-none">
        <ImageSlider
          imageUrls={images.slice(0, 4)}
          itemId={id}
          itemLink={linkHref}
        />
        <div className="absolute top-0 right-0 m-2 flex flex-col items-end gap-2">
          <Badge color="blue" className="whitespace-nowrap">
            <ClockIcon className="w-4 h-4" /> {extractTimeFromSteps(steps)}{' '}
            minut
          </Badge>
          <Badge color="yellow" className="whitespace-nowrap">
            <AcademicCapIcon className="w-4 h-4" /> {difficulty.name}
          </Badge>
          <Badge className="whitespace-nowrap">
            <ArchiveBoxIcon className="w-4 h-4" /> {type.title}
          </Badge>
        </div>
      </div>
      <div className="p-5 flex flex-col justify-between h-full">
        <div className="flex-none">
          <Link href={linkHref}>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h5>
          </Link>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
            {stripHtml(description).result}
          </p>
        </div>
        <div className="flex justify-between mt-auto">
          {/* @ts-ignore */}
          <ItemLink href={linkHref} />
          {/* @ts-ignore */}
          <EditLink href={linkHref} />
        </div>
      </div>
    </div>
  );
};
