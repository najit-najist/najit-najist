import { Badge } from '@components/common/Badge';
import { Skeleton } from '@components/common/Skeleton';
import { LazyUserListActions } from '@components/page-components/RecipePageManageContent/LazyUserListActions';
import { RecipeWithRelations } from '@custom-types';
import {
  AcademicCapIcon,
  ArchiveBoxIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { User } from '@najit-najist/database/models';
import { extractTimeFromSteps } from '@server/utils/extractTimeFromSteps';
import Link from 'next/link';
import { FC, Suspense } from 'react';

import { ImageSlider } from './ImageSlider';

export const RecipePreviewMedium: FC<
  RecipeWithRelations & {
    showEditLink?: boolean;
    loggedInUser?: Pick<User, 'role'>;
  }
> = ({ images, slug, title, id, steps, difficulty, category }) => {
  const linkHref = `/recepty/${slug}` as const;

  return (
    <div className="sm:max-w-sm flex flex-col">
      <div className="relative block w-full aspect-square flex-none hover:shadow-xl rounded-project duration-200">
        <ImageSlider
          imageUrls={images.map(({ file }) => file).slice(0, 4)}
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
            <ArchiveBoxIcon className="w-4 h-4" /> {category.title}
          </Badge>
        </div>

        <div className="m-1 absolute top-0 left-0 rounded-project p-1 flex gap-2">
          <Suspense
            fallback={
              <>
                <Skeleton className="w-9 h-9" />
                {/* <Skeleton className="w-9 h-9" /> */}
              </>
            }
          >
            <LazyUserListActions recipeId={id} />
          </Suspense>
        </div>
      </div>
      <div className="p-2 sm:p-5 flex flex-col justify-between h-full">
        <div className="flex-none">
          <Link href={linkHref} className="hover:underline">
            <h5 className="mb-2 text-center text-xl sm:text-3xl font-bold tracking-tight text-gray-900 font-title">
              {title}
            </h5>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const RecipePreviewMediumSkeleton: FC = () => (
  <div>
    <Skeleton className="sm:max-w-sm shadow h-[305px]" />
    <Skeleton className="sm:max-w-20 shadow h-7 mx-auto my-6" />
  </div>
);
