import { PageDescription } from '@components/common/PageDescription';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { getClient } from '@vanilla-trpc';

import { Item } from './_components/Item';
import { SearchForm } from './_components/SearchForm';

export const revalidate = 30;

export const metadata = {
  title: 'Články',
};

export const revalidate = 30;

export const metadata = {
  title: 'Články',
};

export default async function Page() {
  const { items: posts } = await getClient().posts.getMany.query();

  return (
    <div className="container">
      <PageHeader>
        <PageTitle>Blog</PageTitle>
        <PageDescription>Vyberte si z naší knihovny článků</PageDescription>
      </PageHeader>
      <SearchForm />
      <div className="mt-5 space-y-20 lg:space-y-20 py-10">
        {posts.length ? (
          posts.map((post) => <Item key={post.id} {...post} />)
        ) : (
          <div className="underline">Zatím žádné články...</div>
        )}
      </div>
    </div>
  );
}
