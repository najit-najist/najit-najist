import { ProductService } from '@najit-najist/api/server';
import { SearchForm } from './_components/SearchForm';
import { Item } from './_components/Item';
import { AvailableModels, UserActions, canUser } from '@najit-najist/api';
import { PageTitle } from '@components/common/PageTitle';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { getCachedLoggedInUser } from '@server-utils';

type Params = {
  searchParams: { query?: string };
};

export const metadata = {
  title: 'Produkty',
};

export const revalidate = 0;

export default async function RecipesPage({ searchParams }: Params) {
  const { query } = searchParams;
  const userDidSearch = !!query;
  const currentUser = await getCachedLoggedInUser();

  const { items: products } = await ProductService.getMany({
    search: query,
    perPage: 999,
  });

  return (
    <>
      <div className="container flex justify-between items-center">
        <PageTitle>{metadata.title}</PageTitle>

        {currentUser &&
        canUser(currentUser, {
          action: UserActions.CREATE,
          onModel: AvailableModels.RECIPES,
        }) ? (
          <Link href="/produkty/novy" className="">
            <PlusIcon className="inline w-12" />
          </Link>
        ) : null}
      </div>
      <SearchForm initialValues={{ query }} />
      <div className="container flex flex-col gap-5 my-10">
        {products.length ? (
          products.map((props) => <Item key={props.id} {...props} />)
        ) : (
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            {userDidSearch ? (
              <>Pro vaše vyhledávání nemáme žádné produkty ☹️</>
            ) : (
              <>Zatím pro Vás nemáme žádné produkty...</>
            )}
          </div>
        )}
      </div>
    </>
  );
}
