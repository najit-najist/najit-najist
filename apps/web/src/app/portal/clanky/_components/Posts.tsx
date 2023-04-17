'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { FC, useState } from 'react';
import { trpc } from 'trpc';

export const Posts: FC = () => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(40);
  const { data: posts } = trpc.posts.getMany.useQuery(
    { page: page, perPage: itemsPerPage },
    { suspense: true }
  );

  return (
    <>
      {posts?.items.map((post) => (
        <tr key={post.slug}>
          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
            {post.title}
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {dayjs(post.created).format('DD. MM. YYYY - HH:mm')}
          </td>
          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
            <Link
              href={`/portal/clanky/${post.slug}`}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Upravit
              <span className="sr-only">, {post.title}</span>
            </Link>
          </td>
        </tr>
      ))}
    </>
  );
};
