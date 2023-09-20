import { AuthService, getTrpcCaller } from '@najit-najist/api/server';
import { SearchForm } from './_components/SearchForm';
import { Item } from './_components/Item';
import {
  AvailableModels,
  RecipeDifficulty,
  RecipeType,
  UserActions,
  canUser,
} from '@najit-najist/api';
import { PageTitle } from '@components/common/PageTitle';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/solid';
import { getCachedLoggedInUser } from '@server-utils';
import { PageHeader } from '@components/common/PageHeader';
import { PageDescription } from '@components/common/PageDescription';

type Params = {
  searchParams: { query?: string; difficulty?: string; type?: string };
};

export const metadata = {
  title: 'Recepty',
  description:
    'Vyberte si z naší kolekce receptů zaměřenou pro lidi s intolerancí',
};

export const revalidate = 0;

const fallbackDifficulty: RecipeDifficulty = {
  id: 'default',
  slug: '',
  name: 'Všechny',
  color: '',
  created: '',
  updated: '',
};

const fallbackType: RecipeType = {
  id: 'default',
  slug: '',
  title: 'Všechny',
  created: '',
  updated: '',
};

export default async function RecipesPage({ searchParams }: Params) {
  const {
    query,
    difficulty: difficultySlugFromUrl,
    type: typeSlugFromUrl,
  } = searchParams;
  await AuthService.authPocketBase();
  const currentUser = await getCachedLoggedInUser();

  const trpc = getTrpcCaller();

  const userDidSearch = !!query || !!difficultySlugFromUrl || !!typeSlugFromUrl;
  const [
    { items: recipeDifficulties },
    { items: recipeTypes },
    { items: recipes },
  ] = await Promise.all([
    trpc.recipes.difficulties.getMany({ perPage: 999 }),
    trpc.recipes.types.getMany({ perPage: 999 }),
    trpc.recipes.getMany({
      difficultySlug: difficultySlugFromUrl,
      typeSlug: typeSlugFromUrl,
      search: query,
      perPage: 999,
    }),
  ]);

  return (
    <>
      <PageHeader className="container">
        <div className="flex justify-between items-center">
          <PageTitle>{metadata.title}</PageTitle>
          {currentUser &&
          canUser(currentUser, {
            action: UserActions.CREATE,
            onModel: AvailableModels.RECIPES,
          }) ? (
            <Link href="/recepty/novy" className="">
              <PlusIcon className="inline w-12" />
            </Link>
          ) : null}
        </div>
        <PageDescription>{metadata.description}</PageDescription>
      </PageHeader>
      <SearchForm
        types={[fallbackType, ...recipeTypes]}
        difficulties={[fallbackDifficulty, ...recipeDifficulties]}
        initialValues={{ query, difficultySlug: difficultySlugFromUrl ?? '' }}
      />
      <div className="container grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10">
        {recipes.length ? (
          recipes.map((props) => <Item key={props.id} {...props} />)
        ) : (
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            {userDidSearch ? (
              <>Pro vaše vyhledávání nemáme žádné recepty ☹️</>
            ) : (
              <>Zatím pro Vás nemáme žádné recepty...</>
            )}
          </div>
        )}
      </div>
    </>
  );
}
