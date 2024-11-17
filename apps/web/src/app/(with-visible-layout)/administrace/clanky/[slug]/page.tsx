import { PostPageManageContent } from '@components/page-components/PostPageManageContent';
import { PostWithRelations } from '@custom-types';
import { posts } from '@najit-najist/database/models';
import { UserActions, canUser } from '@server/utils/canUser';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { getCachedTrpcCaller } from '@server/utils/getCachedTrpcCaller';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageParams = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const trpc = await getCachedTrpcCaller();
  const post = await trpc.posts
    .getOne({
      slug,
    })
    .catch(() => {});

  return {
    title: `Upravení ${post?.title}`,
  };
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function PostUnderPage({ params }: PageParams) {
  const { slug } = await params;
  let post: PostWithRelations;
  const loggedInUser = await getCachedLoggedInUser();
  const canEdit =
    loggedInUser &&
    canUser(loggedInUser, {
      action: UserActions.UPDATE,
      onModel: posts,
    });
  const canCreate =
    loggedInUser &&
    canUser(loggedInUser, {
      action: UserActions.CREATE,
      onModel: posts,
    });

  try {
    const trpc = await getCachedTrpcCaller();
    post = await trpc.posts.getOne({
      slug,
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
      viewType={'edit'}
      post={post}
    />
  );
}
