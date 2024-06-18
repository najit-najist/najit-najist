import { PageDescription } from '@components/common/PageDescription';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  ProductCategory,
  products as productsModel,
} from '@najit-najist/database/models';
import { Tooltip } from '@najit-najist/ui';
import { UserActions, canUser } from '@server/utils/canUser';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { getCachedTrpcCaller } from '@server/utils/getCachedTrpcCaller';
import Link from 'next/link';

import { AsideFilters } from './_components/AsideFilters';
import { InfiniteProducts } from './_components/InfiniteProducts';
import { ProductsMainPageParams } from './_types';

export const metadata = {
  title: 'Všechny Produkty',
  description:
    'Vytvořili jsme pro Vás jednoduchý seznam produktů, které si můžete objednat a nechat připravit na prodejně. Jednoduše si vyberte ze seznamu,  objednávku odešlete mailem z Vašeho registrovaného e-mailu na adresu  prodejnahk@najitnajist.cz  nebo si vše objednejte a zaplaťte přímo v prodejně na ulici Tomkova 1230/4a  v Hradci Králové.',
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const fallbackCategories: ProductCategory = {
  id: 0,
  slug: '',
  name: 'Všechny',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default async function RecipesPage({
  searchParams,
}: ProductsMainPageParams) {
  const { query, 'category-slug': categoriesSlugFromUrl } = searchParams;
  const userDidSearch = !!query || !!categoriesSlugFromUrl;
  const currentUser = await getCachedLoggedInUser();
  const trpc = getCachedTrpcCaller();
  const categoriesAsArray = categoriesSlugFromUrl?.split(',');
  const search = {
    search: query,
    categorySlug: categoriesAsArray,
    perPage: 15,
  };

  const [productsQueryResult, { items: categories }] = await Promise.all([
    trpc.products.get.many(search),
    trpc.products.categories.get.many({ perPage: 1000, omitEmpty: true }),
  ]);

  let selectedCategories: typeof categories = [];
  if (categoriesAsArray?.length) {
    selectedCategories = categories.filter((item) =>
      categoriesAsArray?.includes(item.slug)
    );
  }

  return (
    <>
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
                <Link href="/administrace/produkty/novy" className="">
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
        <div className="w-full">
          <InfiniteProducts
            userDidSearch={userDidSearch}
            initialSearch={search}
            initialSearchResult={productsQueryResult}
          />
        </div>
      </div>
    </>
  );
}
