import { ProductService } from '@najit-najist/api/server';
import { SearchForm } from './_components/SearchForm';
import { Item } from './_components/Item';
import {
  AppRouterOutput,
  AvailableModels,
  ProductCategory,
  UserActions,
  canUser,
} from '@najit-najist/api';
import { PageTitle } from '@components/common/PageTitle';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { getCachedLoggedInUser, getCachedTrpcCaller } from '@server-utils';
import { PageHeader } from '@components/common/PageHeader';
import { PageDescription } from '@components/common/PageDescription';

type Params = {
  searchParams: { query?: string; 'category-slug'?: string };
};

export const metadata = {
  title: 'Produkty k objednání',
  description:
    'Vytvořili jsme pro Vás jednoduchý seznam produktů, které si můžete objednat a nechat připravit na prodejně. Jednoduše si vyberte ze seznamu,  objednávku odešlete mailem z Vašeho registrovaného e-mailu na adresu  prodejnahk@najitnajist.cz  nebo si vše objednejte a zaplaťte přímo v prodejně na ulici Tomkova 1230/4a  v Hradci Králové.',
};

export const revalidate = 0;
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
        <PageDescription>
          <p>
            Vytvořili jsme pro Vás jednoduchý seznam produktů, které si můžete
            objednat a nechat připravit na prodejně. Jednoduše si vyberte ze
            seznamu, objednávku odešlete mailem z Vašeho registrovaného e-mailu
            na adresu{' '}
            <Link
              href="maito:prodejnahk@najitnajist.cz"
              className="text-blue-500 hover:underline"
            >
              prodejnahk@najitnajist.cz
            </Link>{' '}
            nebo si vše objednejte a zaplaťte přímo v prodejně na ulici Tomkova
            1230/4a v Hradci Králové. <br /> Do mailu zapište kód produktu,
            počet kusů a datum a přibližný čas vyzvednutí objednávky - např. B1,
            2 ks, 26.9.2023 14:00 <br /> Seznam Produktů je zatím dostupný pouze
            pro registrované a tedy přihlášené uživatele, chceme vědět, komu
            budeme jídlo připravovat a v případě lehkého opomenutí koho
            kontaktovat. Objednávku do 200,- Kč můžete zaplatit v prodejně při
            vyzvednutí, objednávku nad 200,- Kč (např. na celý týden dopředu)
            uhraďte předem celkovou částku jedním převodním příkazem na účet
            131-823110227 / 0100 a do zprávy pro příjemce uveďte registrovaný
            email.
          </p>
          <p>
            Pracujeme na kompletním objednávkovém systému, kde si podobně
            vyberete z aktuálně dostupných produktů, zaškrtnete si vyhovující
            kombinaci, den a přibližný čas vyzvednutí objednávky a vše zaplatíte
            přes platební bránu.
          </p>
        </PageDescription>
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
                    <h1 className="font-title mb-2 text-3xl text-deep-green-400">
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
