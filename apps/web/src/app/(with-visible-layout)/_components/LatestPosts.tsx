import { ArrowRightIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { AvailableModels, Post, getFileUrl } from '@najit-najist/api';
import { getCachedTrpcCaller } from '@server-utils';
import HTMLReactParser from 'html-react-parser';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const Item: FC<Post> = ({
  image,
  id,
  publishedAt,
  created,
  categories,
  description,
  title,
  slug,
}) => {
  const link: any = `/clanky/${slug}`;

  return (
    <article className="relative isolate w-full">
      <Link
        href={link}
        className="relative aspect-square w-full lg:shrink-0 block"
      >
        {image ? (
          <Image
            width={300}
            height={300}
            unoptimized
            src={getFileUrl(AvailableModels.POST, id, image)}
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
      <div className="px-4">
        <div className="flex items-center gap-x-4 text-xs mt-2">
          <time
            dateTime={String(publishedAt) ?? created}
            className="text-gray-500"
          >
            {dayjs(publishedAt ? publishedAt : created).format(
              'DD. MM. YYYY @ HH:mm'
            )}
          </time>
          <div className="flex space-x-3">
            {categories.map(({ id, title }) => (
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
              {title}
            </Link>
          </h3>
          <div className="mt-5 text-sm leading-6 text-gray-600 line-clamp-5">
            {HTMLReactParser(description)}
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

export const LatestPosts: FC = async () => {
  const { items } = await getCachedTrpcCaller().posts.getMany({ perPage: 4 });

  return (
    <div className="container mx-auto mt-20" id="o-nas">
      <div className="mx-auto flex items-center justify-between mt-10 mb-7 ">
        <h2 className="text-3xl sm:text-4xl font-bold font-title">
          Nejnovější články
        </h2>
        <Link
          href="/clanky"
          className="text-project-primary group hover:underline"
        >
          Další články
          <ArrowRightIcon className="w-5 ml-3 inline-block -top-0.5 relative group-hover:translate-x-2 duration-150" />
        </Link>
      </div>
      <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {items.map((post) => (
          <Item key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};
