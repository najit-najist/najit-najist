import { PageDescription } from '@components/common/PageDescription';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { PlusIcon } from '@heroicons/react/24/outline';
import { UserActions, canUser } from '@najit-najist/api';
import {
  ProductCategory,
  products as productsModel,
} from '@najit-najist/database/models';
import { Tooltip } from '@najit-najist/ui';
import { getCachedLoggedInUser, getCachedTrpcCaller } from '@server-utils';
import Link from 'next/link';

import { AsideFilters } from './_components/AsideFilters';
import { Item } from './_components/Item';

type Params = {
  searchParams: { query?: string; 'category-slug'?: string };
};

export const metadata = {
  title: 'Všechny Produkty',
  description:
    'Vytvořili jsme pro Vás jednoduchý seznam produktů, které si můžete objednat a nechat připravit na prodejně. Jednoduše si vyberte ze seznamu,  objednávku odešlete mailem z Vašeho registrovaného e-mailu na adresu  prodejnahk@najitnajist.cz  nebo si vše objednejte a zaplaťte přímo v prodejně na ulici Tomkova 1230/4a  v Hradci Králové.',
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const fallbackCategories: ProductCategory = {
  id: 'default',
  slug: '',
  name: 'Všechny',
  created: new Date(),
};

export default async function RecipesPage({ searchParams }: Params) {
  const { query, 'category-slug': categoriesSlugFromUrl } = searchParams;
  const userDidSearch = !!query || !!categoriesSlugFromUrl;
  const currentUser = await getCachedLoggedInUser();
  const trpc = getCachedTrpcCaller();
  const categoriesAsArray = categoriesSlugFromUrl?.split(',');

  const [{ items: products }, { items: categories }] = await Promise.all([
    trpc.products.get.many({
      search: query,
      perPage: 999,
      categorySlug: categoriesAsArray,
    }),
    trpc.products.categories.get.many(),
  ]);

  let selectedCategories: typeof categories = [];
  if (categoriesAsArray?.length) {
    selectedCategories = categories.filter((item) =>
      categoriesAsArray?.includes(item.slug)
    );
  }

  return (
    <>
      {/* TODO: make this into editable notice? */}
      {/* <Notice /> */}
      <PageHeader className="container">
        <div className="flex justify-between items-center">
          <PageTitle>{metadata.title}</PageTitle>
          {currentUser &&
          canUser(currentUser, {
            action: UserActions.CREATE,
            onModel: productsModel,
          }) ? (
            <Tooltip
              trigger={
                <Link href="/produkty/novy" className="">
                  <PlusIcon className="inline w-12" />
                </Link>
              }
            >
              Přidat nový produkt
            </Tooltip>
          ) : null}
        </div>
        <PageDescription>
          Vyberte si z našeho rozmanitého sortimentu
        </PageDescription>
      </PageHeader>

      <div className="container pb-10">
        <hr className="border-none h-1 bg-gray-100" />
      </div>

      <div className="flex flex-col sm:flex-row container gap-10">
        <AsideFilters
          categories={[fallbackCategories, ...categories]}
          initialValues={{ query, categories: selectedCategories }}
        />
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xs:gap-5 sm:gap-10 w-full divide-y-2 xs:divide-y-0">
          {products.length ? (
            products.map((props) => <Item key={props.id} {...props} />)
          ) : (
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
              {userDidSearch ? (
                <>Pro Vaše vyhledávání nemáme žádné produkty ☹️</>
              ) : (
                <>Zatím pro Vás nemáme žádné produkty...</>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
