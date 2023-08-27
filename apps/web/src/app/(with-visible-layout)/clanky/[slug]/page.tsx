import { PostPageManageContent } from '@components/page-components/PostPageManageContent';
import { AvailableModels, canUser, Post, UserActions } from '@najit-najist/api';
import {
  getLoggedInUser,
  getTrpcCaller,
  isUserLoggedIn,
} from '@najit-najist/api/server';
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
  const post = await getTrpcCaller()
    .posts.getOne({
      slug: postSlug,
    })
    .catch(() => {});

  return {
    title: !!searchParams.editor ? `Upravení ${post?.title}` : post?.title,
  };
}

export const revalidate = 0;

export default async function PostUnderPage({
  params: { slug: postSlug },
  searchParams,
}: PageParams) {
  let post: Post;
  const isEditorEnabled = !!searchParams.editor;
  const loggedInUser = await getLoggedInUser().catch(() => undefined);
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

  if (isEditorEnabled && !canEdit) {
    redirect('/');
  }

  try {
    post = await getTrpcCaller().posts.getOne({
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
