import { LazyUserListActions } from '@components/page-components/RecipePageManageContent/LazyUserListActions';
import { RecipeWithRelations, UserWithRelations } from '@custom-types';
import {
  AcademicCapIcon,
  ArchiveBoxIcon,
  ClockIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { User, recipes } from '@najit-najist/database/models';
import { Badge, Skeleton, buttonStyles } from '@najit-najist/ui';
import { UserActions, canUser } from '@server/utils/canUser';
import { extractTimeFromSteps } from '@server/utils/extractTimeFromSteps';
import Link from 'next/link';
import { FC, Suspense } from 'react';
import { stripHtml } from 'string-strip-html';

import { ImageSlider } from './ImageSlider';

export const Item: FC<
  RecipeWithRelations & {
    showEditLink?: boolean;
    loggedInUser?: Pick<User, 'role'>;
  }
> = ({
  images,
  slug,
  title,
  id,
  description,
  steps,
  difficulty,
  category,
  loggedInUser,
}) => {
  const linkHref = `/recepty/${slug}` as const;

  return (
    <div className="sm:max-w-sm bg-white border border-ocean-300 rounded-lg shadow flex flex-col">
      <div className="relative block w-full aspect-square flex-none">
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

        <div className="m-1 absolute top-0 left-0 rounded-md p-1 flex gap-2">
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
      <div className="p-5 flex flex-col justify-between h-full">
        <div className="flex-none">
          <Link href={linkHref}>
            <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 font-title">
              {title}
            </h5>
          </Link>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
            {stripHtml(description).result}
          </p>
        </div>
        <div className="flex justify-between mt-auto">
          <Link
            href={linkHref}
            className={buttonStyles({
              appearance: 'small',
              className: 'inline-flex',
            })}
          >
            Zobrazit
            <svg
              aria-hidden="true"
              className="w-4 h-4 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
          {loggedInUser &&
          canUser(loggedInUser, {
            action: UserActions.UPDATE,
            onModel: recipes,
          }) ? (
            <Link
              href={`${linkHref}?editor=true`}
              className={buttonStyles({
                appearance: 'spaceless',
                color: 'blue',
                className: 'px-2 py-1 h-9 w-9',
              })}
            >
              <PencilIcon className="w-5 h-5 mt-0.5" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};
