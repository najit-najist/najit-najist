import { PostWithRelations } from '@custom-types';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { dayjs, getFileUrl } from '@najit-najist/api';
import { posts } from '@najit-najist/database/models';
import HTMLReactParser from 'html-react-parser';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

export const Item: FC<PostWithRelations> = (post) => {
  const link: any = `/clanky/${post.slug}`;
  return (
    <article className="relative isolate flex flex-col gap-6 lg:flex-row">
      <Link
        href={link}
        className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0 block"
      >
        {post.image ? (
          <Image
            width={300}
            height={300}
            unoptimized
            src={getFileUrl(posts, post.id, post.image)}
            alt=""
            className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
          />
        ) : (
          <div className="flex w-full h-full bg-white">
            <PhotoIcon className="w-20 h-20 m-auto" />
          </div>
        )}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      </Link>
      <div>
        <div className="flex items-center gap-x-4 text-xs mt-2">
          <time
            dateTime={String(post.publishedAt) ?? post.createdAt}
            className="text-gray-500"
          >
            {dayjs
              .tz(post.publishedAt ? post.publishedAt : post.createdAt)
              .format('DD. MM. YYYY @ HH:mm')}
            {!post.publishedAt ? (
              <span className="text-red-400"> - Nepublikováno</span>
            ) : null}
          </time>
          <div className="flex space-x-3">
            {post.categories.map(({ category: { id, title } }) => (
              <button
                key={id}
                className="relative z-10 rounded-full bg-gray-50 py-1.5 px-3 font-medium text-gray-600 hover:bg-gray-100"
              >
                {title}
              </button>
            ))}
          </div>
        </div>
        <div className="group relative max-w-xl">
          <h3 className="font-title mt-3 text-2xl font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <Link href={link}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
          <div className="mt-5 text-sm leading-6 text-gray-600">
            {HTMLReactParser(post.description)}
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
