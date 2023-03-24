import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import type { Post } from '@najit-najist/api';
import { getFileUrl } from '@utils';
import { getClient } from '@vanilla-trpc';
import dayjs from 'dayjs';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function PostUnderPage({
  params: { slug: postSlug },
}: {
  params: { slug: string };
}) {
  let post: Post;

  try {
    post = await getClient().posts.getOne.query({
      slug: postSlug,
    });
  } catch (error) {
    return notFound();
  }

  return (
    <div>
      <PageHeader className="container">
        <time
          dateTime={post.publishedAt}
          className="text-gray-500 font-semibold"
        >
          {dayjs(post.publishedAt).format('DD. MM. YYYY @ HH:mm')}
        </time>
        <PageTitle>{post.title}</PageTitle>
      </PageHeader>

      <div className="bg-[#388659] py-10 my-14">
        <div className="container flex space-x-10">
          {post.image ? (
            <div className="w-1/2 aspect-[16/10] relative flex-none -mt-24 mb-5">
              <Image
                width={300}
                height={300}
                unoptimized
                src={getFileUrl('posts', post.id, post.image)}
                alt=""
                className="absolute inset-0 h-full w-full rounded-lg bg-gray-50 object-cover shadow-md"
              />
            </div>
          ) : null}
          <p className="text-white font-suez text-xl leading-10 max-w-4xl">
            {post.description}
          </p>
        </div>
      </div>

      <div
        className="container text-xl pb-10"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
    </div>
  );
}
