import { PageDescription } from '@components/common/PageDescription';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  AppRouterOutput,
  AvailableModels,
  ProductCategory,
  UserActions,
  canUser,
} from '@najit-najist/api';
import { ProductService } from '@najit-najist/api/server';
import { getCachedLoggedInUser, getCachedTrpcCaller } from '@server-utils';
import { cookies } from 'next/headers';
import Link from 'next/link';

import { Item } from './_components/Item';
import { Notice } from './_components/Notice';
import { SearchForm } from './_components/SearchForm';
import { PRODUCTS_NOTICE_STATE_COOKIE_NAME } from './_components/_constants';

type Params = {
  searchParams: { query?: string; 'category-slug'?: string };
};

export const metadata = {
  title: 'Produkty k objednání',
  description:
    'Vytvořili jsme pro Vás jednoduchý seznam produktů, které si můžete objednat a nechat připravit na prodejně. Jednoduše si vyberte ze seznamu,  objednávku odešlete mailem z Vašeho registrovaného e-mailu na adresu  prodejnahk@najitnajist.cz  nebo si vše objednejte a zaplaťte přímo v prodejně na ulici Tomkova 1230/4a  v Hradci Králové.',
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';
const DEFAULT_CATEGORY_TITLE = 'Ostatní';

const fallbackCategories: ProductCategory = {
  id: 'default',
  slug: '',
  name: 'Všechny',
  created: new Date(),
};

export default async function RecipesPage({ searchParams }: Params) {
  const { query, 'category-slug': categorySlugFromUrl } = searchParams;
  const userDidSearch = !!query || !!categorySlugFromUrl;
  const currentUser = await getCachedLoggedInUser();
  const trpc = getCachedTrpcCaller();
  const cookiesList = cookies();

  const [{ items: products }, { items: categories }] = await Promise.all([
    ProductService.getMany({
      search: query,
      perPage: 999,
      categorySlug: categorySlugFromUrl,
    }),
    trpc.products.categories.get.many(),
  ]);

  const categoriesWithProducts = new Map<string, typeof products>(
    !categorySlugFromUrl ? [[DEFAULT_CATEGORY_TITLE, []]] : []
  );

  for (const product of products) {
    const categoryTitle = product.category?.name ?? DEFAULT_CATEGORY_TITLE;
    if (!categoriesWithProducts.has(categoryTitle)) {
      categoriesWithProducts.set(categoryTitle, []);
    }

    categoriesWithProducts.get(categoryTitle)?.push(product);
  }

  const categoriesWithProductsAsArray = [...categoriesWithProducts];
  // Move default group to end as that makes more sense
  const groupOther = categoriesWithProductsAsArray.shift()!;
  // If it has some items then we add it to the end, if no items then don`t
  if (groupOther[1].length) {
    categoriesWithProductsAsArray.push(groupOther);
  }

  return (
    <>
      {cookiesList?.get(PRODUCTS_NOTICE_STATE_COOKIE_NAME)?.value ===
      'true' ? null : (
        <Notice />
      )}
      <PageHeader className="container">
        <div className="flex justify-between items-center">
          <PageTitle>{metadata.title}</PageTitle>
          {currentUser &&
          canUser(currentUser, {
            action: UserActions.CREATE,
            onModel: AvailableModels.PRODUCTS,
          }) ? (
            <Link href="/produkty/novy" className="">
              <PlusIcon className="inline w-12" />
            </Link>
          ) : null}
        </div>
      </PageHeader>
      <SearchForm
        categories={[fallbackCategories, ...categories]}
        initialValues={{ query, categorySlug: categorySlugFromUrl ?? '' }}
      />
      <div className="container flex flex-col gap-8 my-10">
        {products.length ? (
          categoriesWithProductsAsArray.map(
            ([name, productsForGroup], index) => (
              <section key={name}>
                {categoriesWithProductsAsArray.length !== 1 ? (
                  <>
                    <h1 className="font-title mb-2 text-3xl text-project-primary">
                      {name}
                    </h1>
                    <hr className="w-full border-0 bg-gray-200 h-0.5 mb-5" />
                  </>
                ) : null}
                <div className="flex flex-col gap-5">
                  {productsForGroup.map((props) => (
                    <Item key={props.id} {...props} />
                  ))}
                </div>
              </section>
            )
          )
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
    </>
  );
}
