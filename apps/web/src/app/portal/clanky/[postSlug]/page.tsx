import { Post, User } from '@najit-najist/api';
import { getClient } from '@vanilla-trpc';
import { notFound } from 'next/navigation';
import { Content } from './_components/Content';

type Params = { params: { postSlug: string } };

export default async function Page({ params }: Params) {
  let user: Post;

  try {
    user = await getClient().posts.getOne.query({
      slug: params.postSlug,
    });
  } catch (error) {
    return notFound();
  }

  return <Content post={user} />;
}
