import { PostWithRelations } from '@custom-types/index';
import { dayjs } from '@dayjs';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { posts } from '@najit-najist/database/models';
import { getFileUrl } from '@server/utils/getFileUrl';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { Skeleton } from '../Skeleton';
import { EditLink } from './EditLink';

export const PostPreviewMedium: FC<PostWithRelations> = async ({
  image,
  id,
  publishedAt,
  createdAt,
  categories,
  title,
  slug,
}) => {
  const link = `/clanky/${slug}`;
  const importedImage = image ? getFileUrl(posts, id, image) : null;

  return (
    <article className="relative isolate w-full">
      <Link
        href={link}
        className="relative aspect-square w-full lg:shrink-0 block"
      >
        {importedImage ? (
          <Image
            width={300}
            height={300}
            unoptimized
            src={importedImage}
            alt=""
            className="absolute inset-0 h-full w-full bg-gray-50 object-cover hover:shadow-xl duration-200 rounded-project"
          />
        ) : (
          <div className="flex w-full h-full bg-white hover:shadow-xl duration-200 ring-1 ring-inset ring-gray-900/10 rounded-project">
            <PhotoIcon className="w-20 h-20 m-auto" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 m-2">
          <EditLink href={`/administrace/${link}`} />
        </div>
      </Link>
      <div className="px-2">
        <div className="group relative max-w-xl mt-2">
          <h3 className="font-title mt-4 text-lg sm:text-xl font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <Link href={link}>
              <span className="absolute inset-0" />
              {title}
            </Link>
          </h3>
        </div>
        <div className="flex items-center gap-x-4 text-xs mt-1">
          <time
            dateTime={String(publishedAt ?? createdAt)}
            className="text-gray-500 mt-1"
          >
            {dayjs
              .tz(publishedAt ? publishedAt : createdAt)
              .format('DD. MM. YYYY v HH:mm')}
          </time>
          <div className="flex space-x-3">
            {categories.map(({ category }) => (
              <button
                key={category.id}
                className="relative z-10 rounded-full bg-gray-50 py-1.5 px-3 font-medium text-gray-600 hover:bg-gray-100"
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
        {/* <div className="mt-6 flex border-t border-gray-900/5 pt-6">
<div className="relative flex items-center gap-x-4">
  <div className="h-10 w-10 rounded-full bg-gray-50" />
  <div className="text-sm leading-6">
    <p className="font-semibold text-gray-900">
      <a>
        <span className="absolute inset-0" />
        {post.author.name}
      </a>
    </p>
    <p className="text-gray-600">{post.author.role}</p>
  </div>
</div>
</div> */}
      </div>
    </article>
  );
};

export const PostPreviewMediumSkeleton: FC = () => (
  <div>
    <Skeleton className="relative aspect-square w-full" />
    <Skeleton className="w-4/6 h-7 mt-2" />
    <Skeleton className="w-2/6 h-5 mt-2" />
  </div>
);
