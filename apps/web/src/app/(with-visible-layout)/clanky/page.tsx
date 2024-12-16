import { BreadcrumbItem, Breadcrumbs } from '@components/common/Breadcrumbs';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { PageDescription } from '@components/common/PageDescription';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { PlusIcon } from '@heroicons/react/24/solid';
import { posts as postsModel } from '@najit-najist/database/models';
import { UserActions, canUser } from '@server/utils/canUser';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { getCachedTrpcCaller } from '@server/utils/getCachedTrpcCaller';
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
  searchParams: Promise<{
    query?: string;
  }>;
};

export default async function Page({ searchParams }: Params) {
  const { query } = await searchParams;
  const currentUser = await getCachedLoggedInUser();
  const trpc = await getCachedTrpcCaller();

  const { items: posts } = await trpc.posts.getMany({
    query,
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { link: '/clanky', text: 'Články', active: true },
  ];

  return (
    <>
      <div className="hidden sm:block container mx-auto mt-6 mb-2">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <PageHeader className="container">
        <div className="flex justify-between items-center">
          <PageTitle>{metadata.title}</PageTitle>
          {currentUser &&
          canUser(currentUser, {
            action: UserActions.CREATE,
            onModel: postsModel,
          }) ? (
            <Link
              href="/administrace/clanky/novy"
              className={buttonStyles({
                appearance: 'ghost',
                className: 'w-16 h-16 !px-2',
              })}
            >
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
