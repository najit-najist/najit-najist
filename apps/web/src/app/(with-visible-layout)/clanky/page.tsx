import { PageDescription } from '@components/common/PageDescription';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { getTrpcCaller } from '@najit-najist/api/server';

import { Item } from './_components/Item';
import { SearchForm } from './_components/SearchForm';

export const revalidate = 30;

export const metadata = {
  title: 'Články',
};

type Params = {
  searchParams: {
    query?: string;
  };
};

export default async function Page({ searchParams }: Params) {
  const { query } = searchParams;

  const { items: posts } = await getTrpcCaller().posts.getMany({
    query,
  });

  return (
    <div className="container">
      <PageHeader>
        <PageTitle>Blog</PageTitle>
        <PageDescription>Vyberte si z naší knihovny článků</PageDescription>
      </PageHeader>
      <SearchForm initialData={{ query }} />
      <div className="mt-5 space-y-20 lg:space-y-20 py-10">
        {posts.length ? (
          posts.map((post) => <Item key={post.id} {...post} />)
        ) : (
          <div>
            {query ? (
              <>
                Pro vaše vyhledávání{' '}
                <span className="font-bold text-deep-green-300">
                  &apos;{query}&apos;
                </span>{' '}
                nemáme žádné články ☹️
              </>
            ) : (
              <>Zatím pro Vás nemáme žádné články...</>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
