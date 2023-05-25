import { PostPageManageContent } from '@components/page-components/PostPageManageContent';
import { Post } from '@najit-najist/api';
import { isUserLoggedIn } from '@najit-najist/api/server';
import { getClient } from '@vanilla-trpc';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

type PageParams = {
  params: { slug: string };
  searchParams: { editor: string };
};

export async function generateMetadata({
  params: { slug: postSlug },
  searchParams,
}: PageParams): Promise<Metadata> {
  const post = await getClient().posts.getOne.query({
    slug: postSlug,
  });

  return {
    title: !!searchParams.editor ? `Upravení ${post.title}` : post.title,
  };
}

export const revalidate = 0;

export default async function PostUnderPage({
  params: { slug: postSlug },
  searchParams,
}: PageParams) {
  let post: Post;
  const isEditorEnabled = !!searchParams.editor;
  const userLoggedIn = await isUserLoggedIn();

  if (isEditorEnabled && !userLoggedIn) {
    redirect('/');
  }

  try {
    post = await getClient().posts.getOne.query({
      slug: postSlug,
    });

    if (!post.publishedAt) {
      throw new Error('Not published');
    }
  } catch (error) {
    return notFound();
  }

  return (
    <PostPageManageContent
      isEditorHeaderShown={userLoggedIn}
      viewType={isEditorEnabled ? 'edit' : 'view'}
      post={post}
    />
  );
}
