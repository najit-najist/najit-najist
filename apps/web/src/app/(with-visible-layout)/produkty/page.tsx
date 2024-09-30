import { PageDescription } from '@components/common/PageDescription';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  ProductCategory,
  products as productsModel,
} from '@najit-najist/database/models';
import {
  BreadcrumbItem,
  Breadcrumbs,
  buttonStyles,
  Tooltip,
} from '@najit-najist/ui';
import { UserActions, canUser } from '@server/utils/canUser';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { getProductCategories } from '@server/utils/getProductCategories';
import { getProducts } from '@server/utils/getProducts';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { z } from 'zod';

import { Filters } from './_components/Filters';
import { InfiniteProducts } from './_components/InfiniteProducts';
import { ProductsMainPageParams, ProductsPageSortBy } from './_types';

const SEARCH_PAGE_TITLE = 'Výsledek vyhledávání produktů';

function createTitleFromCategories(categories: ProductCategory[]) {
  return categories
    .map((value, index, values) => {
      let result = value.name;
      if (index === values.length - 2) {
        result += ' a';
      } else if (index !== values.length - 1) {
        result += ',';
      }

      return result;
    })
    .join(' ');
}

export async function generateMetadata(
  { searchParams }: ProductsMainPageParams,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { 'category-slug': categoriesSlugFromUrl, query } = searchParams;
  const result = {
    title: query ? SEARCH_PAGE_TITLE : 'Všechny Produkty',
    description:
      'Vytvořili jsme pro Vás jednoduchý seznam produktů, které si můžete objednat a nechat připravit na prodejně. Jednoduše si vyberte ze seznamu,  objednávku odešlete mailem z Vašeho registrovaného e-mailu na adresu  prodejnahk@najitnajist.cz  nebo si vše objednejte a zaplaťte přímo v prodejně na ulici Tomkova 1230/4a  v Hradci Králové.',
  };
  const categoriesAsArray = categoriesSlugFromUrl?.split(',');

  if (categoriesAsArray?.length && !query) {
    result.title = SEARCH_PAGE_TITLE;

    if (categoriesAsArray.length === 1) {
      const { items: categories } = await getProductCategories({
        perPage: 10,
        omitEmpty: true,
        filter: { slug: categoriesAsArray },
      });

      result.title = createTitleFromCategories(categories);
    }
  }

  return result;
}

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
  const {
    query,
    'category-slug': categoriesSlugFromUrl,
    sort: unsanitizedSort,
  } = searchParams;
  const userDidSearch = !!query || !!categoriesSlugFromUrl;
  const currentUser = await getCachedLoggedInUser();
  const { data: sortBy } = z
    .nativeEnum(ProductsPageSortBy)
    .safeParse(unsanitizedSort);
  const [selectedCategorySlug] = categoriesSlugFromUrl?.split(',') ?? [];
  const search: Parameters<typeof getProducts>[0] = {
    search: query,
    categorySlug: selectedCategorySlug ? [selectedCategorySlug] : undefined,
    perPage: 15,
    sortBy: {
      price:
        unsanitizedSort === ProductsPageSortBy.PRICE_ASCENDING
          ? 'asc'
          : unsanitizedSort === ProductsPageSortBy.PRICE_DESCENDING
            ? 'desc'
            : undefined,
    },
  };

  const [productsQueryResult, { items: categories }] = await Promise.all([
    getProducts(search, { loggedInUser: currentUser }),
    getProductCategories({ perPage: 9999, omitEmpty: true }),
  ]);

  let selectedCategory: (typeof categories)[number] | undefined = undefined;
  if (selectedCategorySlug) {
    selectedCategory = categories.find(
      (item) => selectedCategorySlug === item.slug,
    );
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { link: '/produkty', text: 'Produkty', active: !selectedCategory },
  ];
  if (selectedCategory) {
    breadcrumbs.push({
      link: `/produkty?category-slug=${selectedCategory.slug}`,
      active: true,
      text: selectedCategory.name,
    });
  }

  return (
    <>
      {/* <N otice /> */}
      <div className="container mx-auto my-2">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <PageHeader className="container !pb-5">
        <div className="flex justify-between items-center ">
          <PageTitle>
            {query && !selectedCategory
              ? SEARCH_PAGE_TITLE
              : selectedCategory
                ? createTitleFromCategories([selectedCategory])
                : 'Všechny Produkty'}
          </PageTitle>
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
          {query
            ? 'Vyberte si z našeho rozmanitého sortimentu vyhledaných produktů'
            : selectedCategory
              ? `Vyberte si z obsáhlého sortimentu v kategorii ${selectedCategory.name}`
              : 'Vyberte si z našeho rozmanitého sortimentu'}
        </PageDescription>
      </PageHeader>

      {!selectedCategory ? (
        <>
          <nav className="container flex flex-wrap gap-2 mb-5">
            {categories.map((category) => (
              <Link
                className={buttonStyles({
                  padding: 'off',
                  className: 'py-2 px-4',
                  appearance: 'spaceless',
                })}
                href={{ query: { 'category-slug': category.slug } }}
                key={category.id}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className="container my-5">
            <hr className="border-none h-1 bg-gray-100" />
          </div>
        </>
      ) : null}

      <Filters
        categories={[fallbackCategories, ...categories]}
        initialValues={{
          query,
          sort: sortBy ?? ProductsPageSortBy.RECOMMENDED,
        }}
      />

      <div className="w-full container mx-auto">
        <InfiniteProducts
          userDidSearch={userDidSearch}
          initialSearch={search}
          initialSearchResult={productsQueryResult}
        />
      </div>
    </>
  );
}
