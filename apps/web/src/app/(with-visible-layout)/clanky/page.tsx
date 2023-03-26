import { PageDescription } from '@components/common/PageDescription';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { getClient } from '@vanilla-trpc';

import { Item } from './components/Item';

export const revalidate = 30;

export default async function Page() {
  const { items: posts } = await getClient().posts.getMany.query();

  return (
    <div className="container">
      <PageHeader>
        <PageTitle>Blog</PageTitle>
        <PageDescription>Vyberte si z naší knihovny článků</PageDescription>
      </PageHeader>
      <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20 py-10">
        {posts.length ? (
          posts.map((post) => <Item key={post.id} {...post} />)
        ) : (
          <div className="underline">Zatím žádné články...</div>
        )}
      </div>
    </div>
  );
}
