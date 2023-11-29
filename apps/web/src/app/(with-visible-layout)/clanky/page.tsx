import { PageDescription } from '@components/common/PageDescription';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { PlusIcon } from '@heroicons/react/24/solid';
import { AvailableModels, UserActions, canUser } from '@najit-najist/api';
import { getCachedLoggedInUser, getCachedTrpcCaller } from '@server-utils';
import Link from 'next/link';

import { Item } from './_components/Item';
import { SearchForm } from './_components/SearchForm';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Články',
  description: 'Vyberte si z naší knihovny článků',
};

type Params = {
  searchParams: {
    query?: string;
  };
};

export default async function Page({ searchParams }: Params) {
  const { query } = searchParams;
  const currentUser = await getCachedLoggedInUser();

  const { items: posts } = await getCachedTrpcCaller().posts.getMany({
    query,
  });

  return (
    <>
      <PageHeader className="container">
        <div className="flex justify-between items-center">
          <PageTitle>{metadata.title}</PageTitle>
          {currentUser &&
          canUser(currentUser, {
            action: UserActions.CREATE,
            onModel: AvailableModels.POST,
          }) ? (
            <Link href="/clanky/novy" className="">
              <PlusIcon className="inline w-12" />
            </Link>
          ) : null}
        </div>
        <PageDescription>{metadata.description}</PageDescription>
      </PageHeader>
      <div className="container">
        <SearchForm initialData={{ query }} />
        <div className="mt-5 space-y-20 lg:space-y-20 py-10">
          {posts.length ? (
            posts.map((post) => <Item key={post.id} {...post} />)
          ) : (
            <div>
              {query ? (
                <>
                  Pro vaše vyhledávání{' '}
                  <span className="font-bold text-project-accent">
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
    </>
  );
}
