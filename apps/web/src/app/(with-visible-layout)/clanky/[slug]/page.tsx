import { PostPageManageContent } from '@components/page-components/PostPageManageContent';
import { AvailableModels, canUser, Post, UserActions } from '@najit-najist/api';
import { getTrpcCaller } from '@najit-najist/api/server';
import { getCachedLoggedInUser, getCachedTrpcCaller } from '@server-utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageParams = {
  params: { slug: string };
  searchParams: { editor: string };
};

export async function generateMetadata({
  params: { slug: postSlug },
  searchParams,
}: PageParams): Promise<Metadata> {
  const post = await getCachedTrpcCaller()
    .posts.getOne({
      slug: postSlug,
    })
    .catch(() => {});

  return {
    title: !!searchParams.editor ? `Upravení ${post?.title}` : post?.title,
  };
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function PostUnderPage({
  params: { slug: postSlug },
  searchParams,
}: PageParams) {
  let post: Post;
  const isEditorEnabled = !!searchParams.editor;
  const loggedInUser = await getCachedLoggedInUser();
  const canEdit =
    loggedInUser &&
    canUser(loggedInUser, {
      action: UserActions.UPDATE,
      onModel: AvailableModels.POST,
    });
  const canCreate =
    loggedInUser &&
    canUser(loggedInUser, {
      action: UserActions.CREATE,
      onModel: AvailableModels.POST,
    });

  try {
    post = await getCachedTrpcCaller().posts.getOne({
      slug: postSlug,
    });

    if (!post.publishedAt && !canCreate) {
      throw new Error('Not published');
    }
  } catch (error) {
    return notFound();
  }

  return (
    <PostPageManageContent
      isEditorHeaderShown={canEdit}
      viewType={isEditorEnabled ? 'edit' : 'view'}
      post={post}
    />
  );
}
